/***
 * RESTART LOGIC FOR TESTING ONLY
 * This will re-use an id if it's already active, useful
 * for testing since we dont want to start a new scraping
 * instance on the ubio servers every time.
 *
 */
function startCheckoutJourney(proxyUrl, descriptorId, descriptorVersion, url, sessionId) {
    console.log('SERVICE: trying old ID');
    var id = localStorage.getItem("ubio-id");
    ubio.setJobId(id);
    ubio.setProxyUrl(proxyUrl);

    ubio.addCallback("initialise", function (id) {
        console.log("Storing JobID in local storage " + id);
        localStorage.setItem("ubio-id", id);
    });

    $.ajax({
        type: "GET",
        url: proxyUrl + "/api/jobs/" + id,
        contentType: 'application/json; charset=UTF-8',
        success: function (result) {
            if (result.state === "fail" || result.waitingFor === "url") {
                ubio.startCheckout(proxyUrl, descriptorId, descriptorVersion, url, sessionId)
            } else {
                ubio.restartCheckout(proxyUrl, id);
            }
        },
        error: function () {
            ubio.startCheckout(proxyUrl, descriptorId, descriptorVersion, url, sessionId)
        }
    });
}



