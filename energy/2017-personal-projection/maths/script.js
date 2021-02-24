var b = document.body;

var randomNumber = function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
};

function AJAX_JSON_Req(url, callback) {
    var AJAX_req = new XMLHttpRequest();
    AJAX_req.open("GET", url, true);
    AJAX_req.setRequestHeader("Content-type", "application/json");
    AJAX_req.onreadystatechange = function () {
        if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {
            var response = JSON.parse(AJAX_req.responseText);
            callback(response);
        }
    }
    AJAX_req.send();

};

var getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var currentUser = localStorage.getItem('userName');
console.log(currentUser);






var getAnnualPrice = function(gasStandingCharge,gasTariff,elecStandingCharge,elecTariff){
    var price;
    var vat = 0.05;

    gasDailyUsage = localStorage.getItem('gasDailyUsage');
    elecDailyUsage = localStorage.getItem('elecDailyUsage');

    gasUsageYearly =  gasDailyUsage * 365;
    elecUsageYearly =  elecDailyUsage * 365;

    var getGasPrice = function(gasStandingCharge,gasTariff){
//        var gasKWH = (gasUsageYearly * gasCorrectionFactor * gasCalorificValue * gasMetricConversion) + gasMetricConversion + gasConversionFactor;
        var gasBasePrice = gasUsageYearly * gasTariff;
        //console.log(gasBasePrice);
        var gasStandingCharge = 365 * gasStandingCharge;
        //console.log(gasStandingCharge);
        var gasSubTotal = gasBasePrice + gasStandingCharge;
        //console.log(gasSubTotal);
        var gasTotal = (gasSubTotal + ( gasSubTotal * vat )) / 100;
        return gasTotal;
    };

    var getElecPrice = function(elecStandingCharge,elecTariff){
        var elecBasePrice = elecUsageYearly * elecTariff;
        var elecStandingCharge = 365 * elecStandingCharge;
        var elecSubTotal = elecBasePrice + elecStandingCharge;
        var elecTotal = (elecSubTotal + ( elecSubTotal * vat )) / 100;
        return elecTotal;
    };
    getGasPrice(gasStandingCharge,gasTariff);
    price = getGasPrice(gasStandingCharge,gasTariff) + getElecPrice(elecStandingCharge,elecTariff);
    return price;
};

var priceArray = [];

var rowSorter = function (ref,rowClass){
    //console.log('Sorting by: ' + ref);
    var rows = document.body.querySelectorAll('.'+ rowClass);
    var sortResults = function () {
        rows.forEach(function (el, i) {
            var totalVal = (el.getAttribute('data-'+ref)) * 1;
            var rowOrder = priceArray.indexOf(totalVal) + 1;
            el.style.order = rowOrder;
        });
    };
    var sortPriceArray = function () {
        priceArray.sort(function (a, b) {
            if( ref === 'savingagainstexistingcard' | ref === 'limit' | ref === 'acceptance' ){
                return b - a
            } else {
                return a - b
            }
        });
        sortResults();
    };
    var buildPriceArray = function () {
        priceArray = [];
        rows.forEach(function (el, i) {
            var totalVal = (el.getAttribute('data-'+ref)) * 1;
            priceArray.push(totalVal);
        });
        sortPriceArray();
    };
    var initialSort = function () {
        rows.forEach(function (el, i) {
            el.style.order = i + 1;
        });
        buildPriceArray();
    };

    initialSort();
};

var sliderBtns = document.querySelectorAll('.filterLinks .sliderBtn');
sliderBtns.forEach(function(sb){
    sb.addEventListener('click', function(){
        var sliderType = sb.getAttribute('data-slider');
        document.body.setAttribute('data-slider', sliderType);
        document.body.classList.add('open-slider');
        document.body.classList.add('fixed');
        document.querySelectorAll('.slider').forEach(function(s){
            s.scrollTop = 0;
        })
    });
})


var getResults = function(data){
    console.log(data);
    var sameProvider = false;

    var ppSlider = document.querySelector('.ppExplain');
    var currPP = ppSlider.querySelectorAll('.ppCost');
    currPP.forEach(function(p){
        p.textContent = parseInt(localStorage.getItem('userPersProj')).toFixed(2);
    })

    if (localStorage.getItem('userType') == 'fixed') {
        document.querySelector('.ppExplain .remSpend .ppCost').textContent = parseInt(localStorage.getItem('userCurrRemain')).toFixed(2);
        document.querySelector('.ppExplain .newRemain').textContent = parseInt(localStorage.getItem('userNewRemain')).toFixed(2);
    }
    else {
        var compareTabs = document.querySelectorAll('.compareSlider .tabs li');
        compareTabs.forEach(function(tab){
            tab.classList.remove('active');
        })
        document.querySelector('.compareSlider .tabs li:last-child').classList.add('active');
    }

    var grid = document.getElementById('results');
    var userData = data[currentUser];
    console.log(userData);
    monthEnd = userData.promoMonthDuration;
    userTariff = userData.tariffName;
    userGasStandingCharge = userData.gas_charge_std;
    userGasTariff = userData.gas_unit_promo;
    userGasTariffAfter = userData.gas_unit_std;
    userElecStandingCharge = userData.electric_charge_std;
    userElecTariff = userData.electric_unit_promo;
    userElecTariffAfter = userData.electric_unit_std;

    var resultsData;
    var renderedResults = 0;
    var loadingCounter = document.querySelector('progress');
    var loadingCounterNo = 0;
    resultsData = data;

    var numberOfResults = resultsData.length;
    //loadingCounter.setAttribute('max',numberOfResults);
    var progressPercentagePerResult = (1 / numberOfResults) * 100;

    var renderResults = function(data){
        if( renderedResults < numberOfResults ){
            //console.log('Building a result');
            var thisData = data[renderedResults];
            loadingCounter.value = Math.round(loadingCounter.value + progressPercentagePerResult);
            var thisPrice = getAnnualPrice(thisData.gas_charge_std,thisData.gas_unit_promo,thisData.electric_charge_std,thisData.electric_unit_promo,thisData.promoMonthDuration,thisData.gas_unit_std,thisData.electric_unit_std);
            renderedResults = renderedResults + 1;
            if( thisPrice < currentTariffCost ){
               var barClass = 'dark';
            }

//            console.log(renderedResults-1)
            if (renderedResults-1 !== parseInt(currentUser) && thisData.userType !== 'var') {
                var row = document.getElementById('primitive').cloneNode(true);
                row.id = '';
                row.setAttribute('data-tariff-cost',thisPrice);
                row.setAttribute('data-annual-saving',thisPrice);
                row.setAttribute('data-pp-cost',thisPrice);

                row.querySelector('img').src = thisData.provider_logo;
                row.querySelector('.tariffName').textContent = thisData.tariffName;
                row.querySelector('.promoDuration').textContent = thisData.promoMonthDuration;
                row.querySelector('.annualSaving').textContent = (localStorage.getItem('userPersProj') - thisPrice).toFixed(2);
                row.setAttribute('data-saving', (localStorage.getItem('userPersProj') - thisPrice).toFixed(2))
                row.querySelector('.personalProj').textContent = thisPrice.toFixed(2);
                row.querySelector('.exitFee').textContent = thisData.exitFee;
                row.querySelector('.gasUnitRate').textContent = thisData.gas_unit_promo;
                row.querySelector('.elecUnitRate').textContent = thisData.electric_unit_promo;
                row.querySelector('.gasStdCharge').textContent = thisData.gas_charge_std;
                row.querySelector('.elecStdCharge').textContent = thisData.electric_charge_std;

                var sliderBtns = row.querySelector('.sliderBtn');
                sliderBtns.addEventListener('click', function(){
                    var sliderType = this.getAttribute('data-slider');
                    document.body.setAttribute('data-slider', sliderType);
                    document.body.classList.add('open-slider');
                    document.body.classList.add('fixed');
                    document.querySelectorAll('.slider').forEach(function(s){
                        s.scrollTop = 0;
                    })

                    var slider = document.querySelector('.compareSlider');
                    function setVal(cls, val){
                        var allEls = slider.querySelectorAll('.'+cls);
                        allEls.forEach(function(el){
                            el.textContent = val;
                        })
                    }
                    setVal('userCurrCost', parseInt(localStorage.getItem('userPersProj')).toFixed(2))
                    setVal('ppCost', parseInt(row.getAttribute('data-pp-cost')).toFixed(2))
                    setVal('savingCost', parseInt(row.getAttribute('data-saving')).toFixed(2))
                    setVal('currAnnual', parseInt(localStorage.getItem('userCurrentTariffCost')).toFixed(2))
                    setVal('currSaving', parseInt((localStorage.getItem('userCurrentTariffCost') - row.getAttribute('data-pp-cost'))).toFixed(2))

                });

                if (thisData.provider_name == localStorage.getItem('userProvider')) {
                    row.setAttribute('data-provider', true);
                    sameProvider = true;
                }

                if (thisData.bigName == true) {
                    row.setAttribute('data-big-name', true);
                }

                grid.appendChild(row);
            }

            rowSorter('tariff-cost','card');
            setTimeout(function(){
                makeChart(thisPrice,false,barClass);
                renderResults(data);
            },450);
            //},1);



        } else {
            console.log('All results rendered');
            setTimeout(function(){
                b.classList.remove('fixed');
                b.classList.remove('interstitial');
                b.classList.add('results-loaded');
                b.querySelector('.loading-panel').style.zIndex = -10;
            },3500);
        }
    };
    renderResults(data);

    if (sameProvider == false) {
        document.querySelector('.resultsTabs li:first-child').setAttribute('disabled', 'disabled');
    }

};

window.scrollTop = 0;

var hasChart = false;

// Get current tariff
var currentTariffCost = (localStorage.getItem('userCurrentTariffCost')*1);
//var currentTariffCost = 2300;
var minTariffCost = currentTariffCost;
var maxTariffCost = currentTariffCost;

var numberOfTariffs = 0;

var getTariffPosition = function(order){
    var tariffCostName;
    if( order == 1 ){
        console.log('Cheapest');
        tariffCostName = 'cheapest';
    } else {
        var tariffPercentagePosition = (order / numberOfTariffs) * 100;
        if( tariffPercentagePosition < 50 ){
            tariffCostName = 'cheap';
        } else if( tariffPercentagePosition >= 50 ){
            tariffCostName = 'medium';
        }

    }
    b.setAttribute('data-tariff-rating',tariffCostName);
    //console.log(tariffPercentagePosition);

};

var makeChart = function(tariff,current,barClass){
    
    console.log(tariff);

    var chart = document.body.querySelector('.chart');
    numberOfTariffs = numberOfTariffs + 1;
    var savingsAmount = 0;
    //console.log('There are ' + numberOfTariffs + ' tariffs charted');
    var setHeights = function(){
        chart.querySelectorAll('b').forEach(function(el){
            //el.style.height = (el.getAttribute('data-tariff')/10) + 'px';
            var difference = maxTariffCost - minTariffCost;
            var thisTariff = el.getAttribute('data-tariff');
            var thisDifference = thisTariff - minTariffCost;
            var height = ( thisDifference / difference ) * 100;
            el.style.height = height + '%';
        });
    };
    var addBar = function(tariff,current){
        var bar = document.createElement('b');
        if( tariff > maxTariffCost ){
           maxTariffCost = tariff;
        }
        if( tariff < minTariffCost ){
           minTariffCost = tariff;
        }
        if( current ){
            bar.classList.add('current');
        }
        
        b.querySelector('.legend-min').textContent = minTariffCost.toFixed(2);
        b.querySelector('.legend-max').textContent = maxTariffCost.toFixed(2);
        bar.setAttribute('data-tariff',tariff);
        bar.classList.add(barClass);
        //bar.style.height = (tariff / 10) + 'px';
        chart.appendChild(bar);
        
        setHeights();
        rowSorter('tariff','chart b');
//        console.log('--------------------------');
//        console.log('Current tariff: ' + currentTariffCost);
//        console.log('Cheapest tariff: ' + minTariffCost);
//        console.log('--------------------------');
        b.querySelector('.userSaving').textContent = (currentTariffCost - minTariffCost).toFixed(2);

    };
    addBar(tariff,current);
    var currentTariffPosition = chart.querySelector('b.current').style.order;
    getTariffPosition(currentTariffPosition);
};
makeChart(currentTariffCost,true);

b.querySelector('.ppLink').addEventListener('click',function(){
    var chartTarget = b.querySelector('.tariffChart');
    if( !hasChart ){
        var chart = b.querySelector('.loading-panel > header').cloneNode(true);
        chartTarget.appendChild(chart);
        hasChart = true;
    }
    b.setAttribute('data-slider','tariffChart');
    b.classList.add('open-slider');
    b.classList.add('fixed');
});

AJAX_JSON_Req('assets/energy-data-test.json',getResults);
//var retrievedJSON = localStorage.getItem('jsonFile');
//retrievedJSON =  JSON.parse(retrievedJSON)
//getResults(retrievedJSON)
