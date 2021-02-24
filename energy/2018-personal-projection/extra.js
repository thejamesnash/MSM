console.log('Loaded extras');
var extraStuff = function(){
    var b = document.body;

    function AJAX_JSON_Req(url, callback) {
        var AJAX_req = new XMLHttpRequest();
        AJAX_req.open("GET", url, true);
        AJAX_req.setRequestHeader("Content-type", "application/json");
        AJAX_req.onreadystatechange = function () {
            if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {
                var response = JSON.parse(AJAX_req.responseText);
                console.log(response);
                callback(response);
            }
        }
        AJAX_req.send();

    };

    var getParameterByName = function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    var currentUser = getParameterByName('user');
    localStorage.setItem('userName',currentUser);
    console.log(currentUser);

    var jsonCallback = function(data){
        localStorage.setItem('jsonFile', JSON.stringify(data));
        var userData = data[currentUser];

        userTariff = userData.tariffName;
        monthEnd = userData.promoMonthDuration;

        localStorage.setItem('userProvider', userData.provider_name)

        var tariffs = [];
        var string = '<option value="173298">Fixed Price Energy April 2016</option><option value="122276">Fixed Price Energy April 2015 NSC</option><option value="122696">Fixed Price Energy April 2015 NSC Online</option><option value="173718">Fixed Price Energy April 2016 Online</option><option value="122066">Fixed Price Energy April 2015 SC</option><option value="122486">Fixed Price Energy April 2015 SC Online</option><option value="240309">Fixed Price Energy August 2018</option><option value="240379">Fixed Price Energy August 2018 Online</option><option value="162652">Fixed Price Energy December 2015</option><option value="162862">Fixed Price Energy December 2015 Online</option><option value="141676">Fixed Price Energy February 2016</option><option value="141886">Fixed Price Energy February 2016 Online</option><option value="253804">Fixed Price Energy January 2018</option><option value="82272">Fixed Price Energy January 2015 NSC</option><option value="82342">Fixed Price Energy January 2015 NSC Online</option><option value="253734">Fixed Price Energy January 2018 Online</option><option value="82132">Fixed Price Energy January 2015 SC</option><option value="82202">Fixed Price Energy January 2015 SC Online</option><option value="181022">Fixed Price Energy June 2016</option><option value="180392">Fixed Price Energy June 2016 Online</option><option value="151582">Fixed Price Energy March 2015 v2</option><option value="151652">Fixed Price Energy March 2015 v2 Online</option><option value="106882">Fixed Price Energy November 2014 NSC</option><option value="107302">Fixed Price Energy November 2014 NSC Online</option><option value="106672">Fixed Price Energy November 2014 SC</option><option value="107092">Fixed Price Energy November 2014 SC Online</option><option value="313456">Fixed Price Energy October 2018</option><option value="452675">Fixed Price Energy October 2019</option><option value="452815">Fixed Price Energy October 2019 Online</option><option value="313386">Fixed Price Energy October 2018 Online</option><option value="400815">Fixed Price Energy October 2018 v2</option><option value="400703">Fixed Price Energy October 2018 v2 Online</option><option value="197417">Fixed Price Energy September 2017</option><option value="197487">Fixed Price Energy September 2017 Online</option><option value="18564">Green Energy H2O</option><option value="121392">Help Beat Cancer Discounted Energy Aug 15 NSC Online</option><option value="102376">Help Beat Cancer Discounted Energy August 2015 NSC</option><option value="126161">Help Beat Cancer Discounted Energy February 2015 NSC</option><option value="126354">Help Beat Cancer Discounted Energy February 2015 NSC Online</option><option value="121462">Help Beat Cancer Discounted Energy Jan 15 NSC</option><option value="121532">Help Beat Cancer Discounted Energy Jan 15 NSC Online</option><option value="147094">Help Beat Cancer Discounted Energy October 2014 SC</option><option value="147304">Help Beat Cancer Discounted Energy October 2014 SC Online</option><option value="416536">Help Beat Cancer Fix and Save April 2019</option><option value="416816">Help Beat Cancer Fix and Save April 2019 Online</option><option value="463090">Help Beat Cancer Fix and Save August 2019</option><option value="462810">Help Beat Cancer Fix and Save August 2019 Online</option><option value="476149">Help Beat Cancer Fix and Save January 2020</option><option value="475939">Help Beat Cancer Fix and Save January 2020 Online</option><option value="442339">Help Beat Cancer Fix and Save July 2019</option><option value="442129">Help Beat Cancer Fix and Save July 2019 Online</option><option value="454216">Help Beat Cancer Fix and Save July 2019 v2</option><option value="454006">Help Beat Cancer Fix and Save July 2019 v2 Online</option><option value="429314">Help Beat Cancer Fix and Save June 2019</option><option value="429524">Help Beat Cancer Fix and Save June 2019 Online</option><option value="397272">Help Beat Cancer Fixed Apr 2019 Online</option><option value="312294">Help Beat Cancer Fixed Energy June 2018 Online</option><option value="406556">Help Beat Cancer Fixed Price April 2019 v2 Online</option><option value="173354">Help Beat Cancer Fixed Price Energy April 2017</option><option value="173774">Help Beat Cancer Fixed Price Energy April 2017 Online</option><option value="405716">Help Beat Cancer Fixed Price Energy April 2019 Online v2</option><option value="417026">Help Beat Cancer Fixed Price Energy April 2019 v3</option><option value="417586">Help Beat Cancer Fixed Price Energy April 2019 v3 Online</option><option value="325018">Help Beat Cancer Fixed Price Energy Aug 2018</option><option value="325228">Help Beat Cancer Fixed Price Energy Aug 2018 Online</option><option value="462084">Help Beat Cancer Fixed Price Energy August 2019</option><option value="461874">Help Beat Cancer Fixed Price Energy August 2019 Online</option><option value="331556">Help Beat Cancer Fixed Price Energy December 2018</option><option value="331766">Help Beat Cancer Fixed Price Energy December 2018 Online</option><option value="293088">Help Beat Cancer Fixed Price Energy January 2018</option><option value="475519">Help Beat Cancer Fixed Price Energy January 2020</option><option value="353454">Help Beat Cancer Fixed Price Energy January 2019</option><option value="353244">Help Beat Cancer Fixed Price Energy January 2019 Online</option><option value="293368">Help Beat Cancer Fixed Price Energy January 2018 Online</option><option value="475029">Help Beat Cancer Fixed Price Energy January 2020 Online</option><option value="151708">Help Beat Cancer Fixed Price Energy January 2017 SC</option><option value="151918">Help Beat Cancer Fixed Price Energy January 2017 SC Online</option><option value="361122">Help Beat Cancer Fixed Price Energy January 2019 v2</option><option value="360492">Help Beat Cancer Fixed Price Energy January 2019 v2 Online</option><option value="442759">Help Beat Cancer Fixed Price Energy July 2019</option><option value="442549">Help Beat Cancer Fixed Price Energy July 2019 Online</option><option value="453796">Help Beat Cancer Fixed Price Energy July 2019 v2</option><option value="453376">Help Beat Cancer Fixed Price Energy July 2019 v2 Online</option><option value="428404">Help Beat Cancer Fixed Price Energy June 2019</option><option value="312504">Help Beat Cancer Fixed Price Energy June 2018</option><option value="428684">Help Beat Cancer Fixed Price Energy June 2019 Online</option><option value="393513">Help Beat Cancer Fixed Price Energy March 2019</option><option value="393303">Help Beat Cancer Fixed Price Energy March 2019 Online</option><option value="228678">Help Beat Cancer Fixed Price Energy May 2017</option><option value="228958">Help Beat Cancer Fixed Price Energy May 2017 Online</option><option value="257897">Help Beat Cancer Fixed Price Energy November 2017</option><option value="258177">Help Beat Cancer Fixed Price Energy November 2017 Online</option><option value="187987">Help Beat Cancer Fixed Price September 2016</option><option value="187777">Help Beat Cancer Fixed Price September 2016 Online</option><option value="416326">Help Beat Cancer Fixed Saver April 2019</option><option value="414996">Help Beat Cancer Fixed Saver April 2019 Online</option><option value="462600">Help Beat Cancer Fixed Saver August 2019</option><option value="462390">Help Beat Cancer Fixed Saver August 2019 Online</option><option value="476989">Help Beat Cancer Fixed Saver January 2020</option><option value="476779">Help Beat Cancer Fixed Saver January 2020 Online</option><option value="441919">Help Beat Cancer Fixed Saver July 2019</option><option value="441289">Help Beat Cancer Fixed Saver July 2019 Online</option><option value="453166">Help Beat Cancer Fixed Saver July 2019 v2</option><option value="452886">Help Beat Cancer Fixed Saver July 2019 v2 Online</option><option value="429104">Help Beat Cancer Fixed Saver June 2019</option><option value="428894">Help Beat Cancer Fixed Saver June 2019 Online</option><option value="146902">Online Energy Saver 23</option><option value="232160">Online Energy Saver 7 (December 2015) Offer</option><option value="232090">Online Energy Saver 8 (December 2015) Offer</option><option value="232020">Online Energy Saver 10 (November 2015) Offer</option><option value="231950">Online Energy Saver 11 (November 2015) Offer</option><option value="414590">Online Fix and Save April 2018 v2</option><option value="461678">Online Fix and Save August 2018</option><option value="476373">Online Fix and Save January 2019</option><option value="441513">Online Fix and Save July 2018</option><option value="428208">Online Fix and Save June 2018</option><option value="298168">Online Fixed Price Energy April 2017</option><option value="396796">Online Fixed Price Energy April 2018</option><option value="236153">Online Fixed Price Energy April 2016</option><option value="302016">Online Fixed Price Energy April 2017 v2</option><option value="415920">Online Fixed Price Energy April 2018 v3</option><option value="405520">Online Fixed Price Energy April 2018 v2</option><option value="255354">Online Fixed Price Energy August 2016</option><option value="321112">Online Fixed Price Energy August 2018</option><option value="326810">Online Fixed Price Energy August 2017</option><option value="461258">Online Fixed Price Energy August 2018 v2</option><option value="207055">Online Fixed Price Energy December 2015</option><option value="280108">Online Fixed Price Energy December 2016</option><option value="153288">Online Fixed Price Energy December 2014</option><option value="225402">Online Fixed Price Energy February 2016</option><option value="161589">Online Fixed Price Energy February 2015</option><option value="169524">Online Fixed Price Energy February 2015v3</option><option value="170110">Online Fixed Price Energy February 2015v2</option><option value="475743">Online Fixed Price Energy January 2019</option><option value="283666">Online Fixed Price Energy January 2017</option><option value="212493">Online Fixed Price Energy January 2016</option><option value="248484">Online Fixed Price Energy July 2016</option><option value="441023">Online Fixed Price Energy July 2018</option><option value="320902">Online Fixed Price Energy July 2017</option><option value="178222">Online Fixed Price Energy July 2015</option><option value="315296">Online Fixed Price Energy June 2017</option><option value="176010">Online Fixed Price Energy June 2015</option><option value="245233">Online Fixed Price Energy June 2016</option><option value="352768">Online Fixed Price Energy June 2018</option><option value="427928">Online Fixed Price Energy June 2018 v3</option><option value="360716">Online Fixed Price Energy June 2018 v2</option><option value="230830">Online Fixed Price Energy March 2016</option><option value="392897">Online Fixed Price Energy March 2018</option><option value="156536">Online Fixed Price Energy March 2015</option><option value="307483">Online Fixed Price Energy May 2017</option><option value="241201">Online Fixed Price Energy May 2016</option><option value="147738">Online Fixed Price Energy November 2014</option><option value="271310">Online Fixed Price Energy November 2016</option><option value="202468">Online Fixed Price Energy November 2015</option><option value="337454">Online Fixed Price Energy November 2017</option><option value="143930">Online Fixed Price Energy October 2014</option><option value="266505">Online Fixed Price Energy October 2016</option><option value="197767">Online Fixed Price Energy October 2015</option><option value="331150">Online Fixed Price Energy September 2017</option><option value="260833">Online Fixed Price Energy September 2016</option><option value="190894">Online Fixed Price Energy September 2015</option><option value="336404">Online Fixed Price Energy September 2017 v2</option><option value="397818">Online Fixed Saver April 2018</option><option value="239469">Online Fixed Saver April 2016</option><option value="405030">Online Fixed Saver April 2018 v3</option><option value="417810">Online Fixed Saver April 2018 v4</option><option value="397006">Online Fixed Saver April 2018 v2</option><option value="461468">Online Fixed Saver August 2018</option><option value="208281">Online Fixed Saver December 2017</option><option value="360926">Online Fixed Saver December 2017 v2</option><option value="476583">Online Fixed Saver January 2019</option><option value="441723">Online Fixed Saver July 2018</option><option value="427690">Online Fixed Saver June 2018</option><option value="375004">Online Fixed Saver March 2018</option><option value="378088">Online Fixed Saver March 2018 v2</option><option value="392687">Online Fixed Saver March 2018 v5</option><option value="392267">Online Fixed Saver March 2018 v4</option><option value="387942">Online Fixed Saver March 2018 v3</option><option value="343404">Online Fixed Saver November 2017</option><option value="352348">Online Fixed Saver November 2017 v2</option><option value="404190">Online Fix &amp; Save April 2018</option><option value="124541">Platinum Fixed Energy April 2015 NSC</option><option value="124611">Platinum Fixed Energy April 2015 NSC Online</option><option value="106477">Platinum Fixed Energy Nov 2014 NSC</option><option value="106557">Platinum Fixed Energy Nov 2014 NSC Online</option><option value="144899">Platinum Fixed Energy October 2015</option><option value="144969">Platinum Fixed Energy October 2015 Online</option><option value="102306">Simply Green Energy June 2015</option><option value="102236">Simply Green Energy June 2015 Online</option><option value="13885">Standard</option><option value="121029" selected="">Standard Online</option><option value="153344">Unifi Fixed Energy January 2015</option><option value="153386">Unifi Fixed Energy January 2015 Online</option><option value="144326">Unifi Fixed Energy November 2014</option><option value="144368">Unifi Fixed Energy November 2014 Online</option>'
        var array = string.split('>');

        tariffs.push(userTariff);
        array.forEach(function(a){
            if (a.includes('</')) {
                tariffs.push(a.split('<')[0])
            }
        });
        tariffs = tariffs.sort();

        document.querySelector('.tariffWrap > p').textContent = userTariff;

        var selectElement = document.querySelector('#tariffSel select');
        selectElement.innerHTML = '';

        var optionElement = document.createElement('option');
        optionElement.text = "--Please select--";
        optionElement.disabled = 'disabled';
        selectElement.appendChild(optionElement);

        tariffs.forEach(function(t){
            var optionElement = document.createElement('option');
            optionElement.text = t;
            selectElement.appendChild(optionElement);
        })

        selectElement.selectedIndex = 0;

        var checkWrap = document.createElement('div'),
            checkInput = document.createElement('input'),
            checkLabel = document.createElement('label');

        checkInput.type = 'checkbox';
        checkInput.id = 'unsureTariff';
        checkLabel.setAttribute('for', 'unsureTariff');
        checkLabel.textContent = "I don't know";
        checkLabel.className = 'blankCheck';

        var setNext = false;
        checkInput.addEventListener('change', function(){
            if (checkInput.checked) {
                selectElement.selectedIndex = 0;
                document.querySelector('.tariffSummary').classList.remove('hidden');
            }
            if (!setNext) {
                setNextStep();
                setNext = true;
            }
        })

        checkWrap.appendChild(checkInput);
        checkWrap.appendChild(checkLabel);
        document.querySelector('#tariffSel').appendChild(checkWrap);

        selectElement.addEventListener('change', function(){
            if (!setNext) {
                setNextStep();
                setNext = true;
            }
            checkInput.checked = false;
            document.querySelector('.tariffSummary').classList.remove('hidden');
        })

        console.log(userData);
        monthEnd = userData.promoMonthDuration;
        userType = userData.userType;
        localStorage.setItem('userType', userType);
        userTariff = userData.tariffName;
        userGasStandingCharge = userData.gas_charge_std;
        userGasTariff = userData.gas_unit_promo;
        userGasTariffAfter = userData.gas_unit_std;
        userElecStandingCharge = userData.electric_charge_std;
        userElecTariff = userData.electric_unit_promo;
        userElecTariffAfter = userData.electric_unit_std;

        document.querySelector('.tariffSummary img').src = userData.provider_logo

        console.log('Updating tariff figures on QS');
        console.log(userData.gas_unit_std);
        document.body.querySelector('.tariffExtra .gasUnitRate').textContent = userData.gas_unit_std;
        document.body.querySelector('.tariffExtra .elecUnitRate').textContent = userData.electric_unit_std;
        

        document.body.querySelector('.tariffExtra .gasStdCharge').textContent = userData.gas_charge_std;
        document.body.querySelector('.tariffExtra .elecStdCharge').textContent = userData.electric_charge_std;

        // Get current tariff
        // var currentTariffCost = getAnnualPrice(userGasStandingCharge,userGasTariff,userElecStandingCharge,userElecTariff);
    }
    AJAX_JSON_Req('energy-data-test.json',jsonCallback);
}
