"use strict";

(function (exports) {
    var vaultUrl = "https://vault.automationcloud.net";
    var debugActive = false;
    var pollTimeout = 1000;
    var _proxyUrl = "";
    var jobId = 0;

    var lastStatus = {waitingFor: "", state: ""};
    var callbackEvents = ["initialise", "startProcessing","processing", "endProcessing", "carHireCover", "breakdownCover", "legalCover", "personalInjuryCover", "payment", "panToken", "finalPriceConsent", "networkError", "fail"];
    var eventCallback = [];


    exports.setProxyUrl = function (proxyUrl) {
        _proxyUrl = proxyUrl;
    };


    exports.getProxyUrl = function () {
        return _proxyUrl;
    };


    exports.setDebug = function (state) {
        debugActive = state;
    };


    exports.setJobId = function (id) {
        jobId = id;
    };


    exports.addCallback = function (eventName, callback) {
        if (callbackEvents.indexOf(eventName) === -1) {
            console.log("Unknown event [" + eventName + "] check it's valid");
        }
        if (typeof callback === 'function') {
            if (!eventCallback[eventName]) eventCallback[eventName]=[];
            eventCallback[eventName].push(callback);
        } else {
            console.log("Unable to register " + eventName + " callback not a function");
        }
    };



    exports.startCheckout = function (proxyUrl, descriptorId, descriptorVersion, goToSiteUrl, msmSessionId) {
        debug("STARTING CHECKOUT");
        _proxyUrl = proxyUrl;
        var postData = createStartCheckoutCmd(descriptorId, descriptorVersion, goToSiteUrl, msmSessionId);
        ajaxPost({
            url: proxyUrl + "/api/jobs",
            data: postData,
            success: function (result) {
                debug("START CHECKOUT SUCCESS", JSON.stringify(result));
                ubio.setJobId(result.id);
                executeCallback("initialise",result.id);
                ubio.journeyStateMonitor(result);
            },
            error: function (result) {
                debug("START CHECKOUT ERROR ", JSON.stringify(result));
                executeCallback("networkError", result);
            }
        });
    };


    exports.restartCheckout = function (proxyUrl, id) {
        debug("RESTARTING CHECKOUT ",id);
        _proxyUrl = proxyUrl;
        ubio.setJobId(id);
        executeCallback("initialise",id);
        ubio.journeyStateMonitor();
    };


    exports.journeyStateMonitor = function (status) {
        if (!status || !status.hasOwnProperty("state")) {
            status = {
                waitingFor: "",
                state: "processing"
            };
        }

        switch (status.state) {
            case "processing":
                if (lastStatus.state !== "processing") {
                    executeCallback("startProcessing", status);
                }
                executeCallback(status.state, status);
                scheduleJourneyStateMonitor();
                break;
            case "awaitingInput":
                // Dont fire the same event multiple times.
                if (status.waitingFor !== lastStatus.waitingFor) {
                    if (lastStatus.state === "processing") {
                        executeCallback("endProcessing", status);
                    }
                    debug("Waiting for " + status.waitingFor);
                    executeCallback(status.waitingFor, status);
                }
                scheduleJourneyStateMonitor();
                break;
            case "fail":
                if (status.state !== lastStatus.state) {
                    if (lastStatus.state === "processing") {
                        executeCallback("endProcessing", status);
                    }
                    debug("Error " + status.waitingFor);
                    executeCallback(status.state, status);
                }
                break;
        }

        lastStatus = status;
    };


    exports.sendJobInputData = function (data) {
        var putData = {input: data};
        ajaxPut({
            url: _proxyUrl + "/api/jobs/" + jobId,
            data: putData,
            error: function (result) {
                debug("SEND INPUT ERROR", JSON.stringify(result));
                executeCallback("networkError", result);
            }
        });
    };


    /********************************
     * PAYMENT CARD VAULT LOGIC START
     ********************************/

    exports.getPanToken = function (pan, callback) {
        ajaxPost({
            url: _proxyUrl + "/api/otp",
            success: function (result) {
                debug("PAN TOKEN SUCCESS", JSON.stringify(result));
                savePaymentCard(result.id, pan, callback);
            },
            error: function (result) {
                debug("PAN TOKEN ERROR", JSON.stringify(result));
                executeCallback("networkError", result);
            }
        });
    };


    function savePaymentCard(otp, pan, callback) {
        var postData = {otp: otp, pan: pan};
        /***
         * IMPORTANT: This call must go directly to UBIO servers and NOT through
         * MSM servers for PCI DSS compliance.
         */
        ajaxPost({
            url: vaultUrl + "/pan",
            data: postData,
            success: function (result) {
                debug("SAVE PAYMENT CARD SUCCESS", JSON.stringify(result));
                issueTemporaryPanToken(result.id, result.key, callback);
            },
            error: function (result) {
                debug("SAVE PAYMENT CARD ERROR", JSON.stringify(result));
                executeCallback("networkError", result);
            }
        });
    }


    function issueTemporaryPanToken(panId, key, callback) {
        var postData = {
            panId: panId,
            key: key
        };
        ajaxPost({
            url: _proxyUrl + "/api/pan/temporary",
            data: postData,
            success: function (result) {
                debug("TEMPORARY PAN TOKEN SUCCESS", JSON.stringify(result));
                ubio.sendJobInputData(createTemporaryPanToken(result.panToken));
                if (callback) callback(result);
            },
            error: function (result) {
                debug("TEMPORARY PAN TOKEN ERROR", JSON.stringify(result));
                executeCallback("networkError", result);
            }
        });
    }

    /******************************
     * PAYMENT CARD VAULT LOGIC END
     ******************************/


    function executeCallback(eventName, data) {
        if (eventName.indexOf(eventName) === -1) {
            console.log("Unknown event [" + eventName + "] check it is valid");
        }

        if (eventCallback[eventName]) {
            debug("Calling " + eventName + " handler", "");
            for (var x = 0; x < eventCallback[eventName].length; x++) {
                eventCallback[eventName][x](data);
            }
        } else {
            debug("Skipping " + eventName + ", no handler registered","");
        }
    }


    function scheduleJourneyStateMonitor() {
        setTimeout(function () {
            ajaxGet({
                url: _proxyUrl + "/api/jobs/" + jobId,
                success: function (result) {
                    ubio.journeyStateMonitor(result);
                },
                error: function (result) {
                    executeCallback("networkError", result);
                }
            })
        }, pollTimeout);
    }


    function debug(type, text) {
        if (debugActive) console.log(type + " " + text);
    }


    /** Protocol **/

    exports.createFinalPriceConsent = function (finalPrice) {
        return {
            "finalPriceConsent": {
                "price": {
                    "value": finalPrice,
                    "currencyCode": "gbp"
                }
            }
        }
    };

    exports.createAccountMsg = function (email, phonenumber) {
        return {
            "account": {
                "email": email,
                "phone": {
                    "countryCode": "gb",
                    "number": phonenumber
                },
                "isExisting": false,
                "password": ""
            }
        }
    };

    exports.createPayment = function (card, address, person) {
        return {
            "payment": {
                "card": card,
                "address": address,
                "person": person
            }
        }
    };

    exports.createPaymentCard = function (type, brand, expirationDate, name, cvv) {
        return {
            "type": type,
            "brand": brand,
            "expirationDate": expirationDate,
            "name": name,
            "cvv": cvv
        }
    };

    exports.createPerson = function (firstName, lastName, title, middleName) {
        return {
            "firstName": firstName,
            "lastName": lastName,
            "title": title,
            "middleName": middleName
        }
    };

    exports.createAddress = function (line1, line2, city, countrySubdivision, postcode, countryCode) {
        return {
            "line1": line1,
            "line2": line2,
            "city": city,
            "countrySubdivision": countrySubdivision,
            "postcode": postcode,
            "countryCode": countryCode
        }
    };

    function createTemporaryPanToken(panToken) {
        return {
            "panToken": panToken
        }
    }


    function createStartCheckoutCmd(descriptorId, descriptorVersion, providerUrl, sessionid) {
        return {
            "descriptorId": descriptorId,
            "descriptorVersion": descriptorVersion,
            "input": {
                "cookies": [{"name": "session-id", "value": sessionid, "url": "https://www.moneysupermarket.com"}],
                "url": providerUrl,
                "options": {
                    "legalCover": true,
                    "breakdownCover": true,
                    "personalInjuryCover": true,
                    "carHireCover": true
                }
            }
        };
    }

    /** Protocol **/

    function ajaxPost(args) {
        args.type = "POST";
        args.contentType = 'application/json; charset=UTF-8';
        args.data = JSON.stringify(args.data);
        $.ajax(args);
    }

    function ajaxGet(args) {
        args.type = "GET";
        args.contentType = 'application/json; charset=UTF-8';
        $.ajax(args);
    }

    function ajaxPut(args) {
        args.type = "PUT";
        args.contentType = 'application/json; charset=UTF-8';
        args.data = JSON.stringify(args.data);
        $.ajax(args);
    }

})(typeof exports === 'undefined' ? this['ubio'] = {} : exports);