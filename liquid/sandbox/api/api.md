<!DOCTYPE HTML>
<html>

<head>
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
</head>

<body>

    <main>
        <h1>API test page</h1>
        <fieldset>
            <legend>Address lookup</legend>
            <p><input type="text" id="postcode" placeholder="Enter your postcode" /></p>
            <p><button id="addressBtn">Get address</button></p>
        </fieldset>
        <fieldset>
            <legend>Vehicle lookup</legend>
            <p><input type="text" id="reg" placeholder="Enter your registration" /></p>
            <p><button id="vehicleBtn">Get vehicle</button></p>
        </fieldset>
        <fieldset>
            <legend>Credit cards search</legend>
<!--            <p><input type="text" id="reg" placeholder="Enter your registration" /></p>-->
            <p><button id="creditCardsBtn">Get cards</button></p>
        </fieldset>

    </main>
    <script>

        var ajax = function(method,url,data,callback) {
            var request = new XMLHttpRequest();
            request.open(method, url, true);
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var response = JSON.parse(request.responseText);
                    callback(response);
                }
            }
            if (data) {
                request.send(JSON.stringify(data));
            } else {
                request.send();
            }
        };

// Comment
        var logResponse = function(obj){
            console.log(obj);
        };

        var getAddressFromPostcode = function(postcode){
            var proxyRef = 'https://jamesnash-trial-prod.apigee.net/msmuxproxy/reference-data/v0/addresses?postcode='+postcode;
            ajax('GET',proxyRef,null,logResponse);
        };

        document.getElementById('addressBtn').addEventListener('click',function(){
            getAddressFromPostcode(document.getElementById('postcode').value);
        });

        var getVehicleFromReg = function(reg){
            var proxyRef = 'https://jamesnash-trial-prod.apigee.net/msmuxproxy/reference-data/v0/vehicles?registrationNumber='+reg;
            ajax('GET',proxyRef,null,logResponse);
        };

        document.getElementById('vehicleBtn').addEventListener('click',function(){
            getVehicleFromReg(document.getElementById('reg').value);
        });

        var getCreditCards = function(reg){
            var proxyRef = 'https://jamesnash-trial-prod.apigee.net/msmuxproxy/product/v1/search/credit-card-products?facets=true';
            ajax('POST',proxyRef,ccData,logResponse);
        };

        
        
        var ccData = {
          "offset": 0,
          "limit": 5,
          "sort": [
              {
                  "name": "code",
                  "order": "asc"
              }
          ],
          "filters": [
                 {
                  "name": "category.code",
                  "values": ["purchases"],
                  "filterType": "ALL"
              }
          ],
          "fields": ["brand.name", "code"]
        };
        
        document.getElementById('creditCardsBtn').addEventListener('click',function(){
            getCreditCards('CC_BALTRANSFER');
        });

    </script>
</body>
</html>
