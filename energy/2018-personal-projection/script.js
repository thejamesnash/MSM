var b = document.body;

var bestSaving = 0;
var bestSavingBigSupplier = 0;
var bestSavingCurrent = 0;

var sliderBtns = document.querySelectorAll('.filterLinks .sliderBtn');
var slider = document.querySelector('.compareSlider');
var tabTriggers = b.querySelectorAll('.resultsTabs > li');
var closeTriggers = b.querySelectorAll('.close-slider');
var breakdownLink = b.querySelectorAll('.breakdown-link');

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

var getGasPrice = function(gasUsageYearly,vat,gasStandingCharge,gasTariff){
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

var getElecPrice = function(elecUsageYearly,vat,elecStandingCharge,elecTariff){
    var elecBasePrice = elecUsageYearly * elecTariff;
    var elecStandingCharge = 365 * elecStandingCharge;
    var elecSubTotal = elecBasePrice + elecStandingCharge;
    var elecTotal = (elecSubTotal + ( elecSubTotal * vat )) / 100;
    return elecTotal;
};

var modifyJson = function(data){
    console.log(data);
    var newData = [];
    data.forEach(function(d){
        var increaseBy = function(v){
            
            var n = parseFloat(v);
            var a = n * 0.83186;
            return a;
        };
        d.electric_unit_promo = increaseBy(d.electric_unit_promo);
        d.electric_unit_std = increaseBy(d.electric_unit_std);
        d.gas_unit_promo = increaseBy(d.gas_unit_promo);
        d.gas_unit_std = increaseBy(d.gas_unit_std);
    
        newData.push(d);
    });
    console.log(JSON.stringify(newData));
};

var getAnnualPrice = function(gasStandingCharge,gasTariff,elecStandingCharge,elecTariff){
//    console.log('------ START ANNUAL PRICE -----');
//    console.log('GSC:' + gasStandingCharge);
//    console.log('GT:' + gasTariff);
//    console.log('ESC:' + elecStandingCharge);
//    console.log('ET:' + elecTariff);
//    console.log('------ END ANNUAL PRICE -----');

    var price;
    var vat = 0.05;

    gasDailyUsage = localStorage.getItem('gasDailyUsage');
    elecDailyUsage = localStorage.getItem('elecDailyUsage');

    gasUsageYearly =  gasDailyUsage * 365;
    elecUsageYearly =  elecDailyUsage * 365;


    
    //getGasPrice(gasUsageYearly,vat,gasStandingCharge,gasTariff);
    price = getGasPrice(gasUsageYearly,vat,gasStandingCharge,gasTariff) + getElecPrice(elecUsageYearly,vat,elecStandingCharge,elecTariff);
    //console.log(price);
    return price;
};

if( !localStorage.getItem('gasDailyUsage') ){
    //console.log('No gas daily usage');
    localStorage.setItem('gasDailyUsage', 40);
}
if( !localStorage.getItem('elecDailyUsage') ){
    //console.log('No electricity daily usage');
    localStorage.setItem('elecDailyUsage', 40)
}
if( !localStorage.getItem('userPersProj') ){
    //console.log('No personal projection');
    var personalProjection = getAnnualPrice(userGasStandingCharge,userGasTariff,userElecStandingCharge,userElecTariff,monthEnd,userGasTariffAfter,userElecTariffAfter,true);
    //console.log(personalProjection);
    localStorage.setItem('userPersProj', personalProjection);
}
if( localStorage.getItem('userPersProj') == 'NaN' ){
    //console.log('Personal projection is not a number');
    //onsole.log(getAnnualPrice(userGasStandingCharge,userGasTariff,userElecStandingCharge,userElecTariff,monthEnd,userGasTariffAfter,userElecTariffAfter,true));
    localStorage.setItem('userPersProj',1200)
}

var priceArray = [];

var rowSorter = function (ref,rowClass,reverse){
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
            if( reverse ){
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

var generateRating = function(){
    var starForge = function(n){
        var stars = '';
        var i;
        for (i = 0; i < n; i++) { 
            stars += '&#9733;';
        }
        return stars;
    };
    var starRating = randomNumber(2,5);
    var deadStars = 5 - starRating;
    var ratings = randomNumber(10,300);
    var ratingString = '<span class="rating"><b>'+ starForge(starRating) +'</b>'+ starForge(deadStars) +'</span> <small>'+ ratings +' Reviews</small>';
    
    return ratingString;
};

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
});

function setVal(cls, val){
    var allEls = b.querySelectorAll('aside .'+cls);
    allEls.forEach(function(el){
        el.textContent = val;
    })
}

var getResults = function(data){
    console.log('SERVICE: GET RESULT DATA');
    //console.log(data);
    modifyJson(data);
    var sameProvider = false;
    var grid = document.getElementById('results');
    
    console.log('SERVICE: GET USER DATA');
    var userData = data[currentUser];
    //console.log(userData);
    
    var monthEnd = userData.promoMonthDuration;
    //console.log('Promo duration: ' + monthEnd);
    var userTariff = userData.tariffName;
    //console.log('Tariff name: ' + userTariff);
    
    
    console.log('----- GAS -----');
    var userGasStandingCharge = userData.gas_charge_std;
    console.log('Gas SC: ' + userGasStandingCharge);
    var userGasTariff = userData.gas_unit_promo;
    console.log('Gas unit (promo): ' + userGasTariff);
    var userGasTariffAfter = userData.gas_unit_std;
    console.log('Gas unit (std): ' + userGasTariffAfter);
    var userGasUsageDaily = parseInt(localStorage.getItem('gasDailyUsage'));
    console.log('Gas usage daily: ' + userGasUsageDaily);
    var userGasUsageYearly = userGasUsageDaily * 365;
    console.log('Gas usage yearly: ' + userGasUsageYearly);
    var userGasCostYearly = getGasPrice(userGasUsageYearly,0.05,userGasStandingCharge,userGasTariff);
    console.log('Gas cost yearly: ' + userGasCostYearly);
    
    
    
    //getGasPrice(gasUsageYearly,vat,gasStandingCharge,gasTariff) + getElecPrice(elecUsageYearly,vat,elecStandingCharge,elecTariff)
    console.log('----- ELECTRICITY -----');
    var userElecStandingCharge = userData.electric_charge_std;
    console.log('Elec SC: ' + userElecStandingCharge);
    var userElecTariff = userData.electric_unit_promo;
    console.log('Elec unit (promo): ' + userElecTariff);
    var userElecTariffAfter = userData.electric_unit_std;
    console.log('Elec unit (std): ' + userElecTariffAfter);
    var userElecUsageDaily = parseInt(localStorage.getItem('elecDailyUsage'));
    console.log('Elec usage daily: ' + userElecUsageDaily);
    var userElecUsageYearly = userElecUsageDaily * 365;
    console.log('Elec usage yearly: ' + userElecUsageYearly);
    var userElecCostYearly = getElecPrice(userElecUsageYearly,0.05,userElecStandingCharge,userElecTariff);
    console.log('Elec cost yearly: ' + userElecCostYearly);
    
    console.log('----- COST -----');
    var userCurrentProjection = userElecCostYearly + userGasCostYearly;
    console.log('Current tariff projection: £' + userCurrentProjection);
    
    // SET PERSONAL PROJECTION
    
    setVal('userCurrCost', parseInt(userCurrentProjection).toFixed(2));
    setVal('ppCost', parseInt(userCurrentProjection).toFixed(2));
    setVal('pTotalCost', parseInt(userCurrentProjection).toFixed(2));
    setVal('cGasUsage',userGasUsageYearly);
    setVal('pGasCost',parseInt(userGasCostYearly).toFixed(2));
    setVal('cElecUsage',userElecUsageYearly);
    setVal('pElecCost',parseInt(userElecCostYearly).toFixed(2));
    
    console.log('SERVICE: RENDER RESULTS');
    var renderedResults = 0;
    var numberOfResults = data.length;
    console.log('Number of results in data: ' + numberOfResults);
    
    var renderResults = function(data){    
        if( renderedResults < numberOfResults  ){
            //console.log('SERVICE: RENDERING RESULT ' + renderedResults);
            var d = data[renderedResults];
            
            // SETTING VARIABLES
            var tariffName = d.tariffName;
            var tariffPromoDuration = d.promoMonthDuration;
            
            // Gas 
            var tariffGasStandingCharge = d.gas_charge_std;
            var tariffGasTariff = d.gas_unit_promo;
            var tariffGasTariffAfter = d.gas_unit_std;
            var tariffGasUsageDaily = userGasUsageDaily;
            var tariffGasUsageYearly = tariffGasUsageDaily * 365;
            var tariffGasCostYearly = getGasPrice(tariffGasUsageYearly,0.05,tariffGasStandingCharge,tariffGasTariff);
            
            // Electricity
            var tariffElecStandingCharge = d.electric_charge_std;
            var tariffElecTariff = d.electric_unit_promo;
            var tariffElecTariffAfter = d.electric_unit_std;
            var tariffElecUsageDaily = userElecUsageDaily;
            var tariffElecUsageYearly = tariffElecUsageDaily * 365;
            var tariffElecCostYearly = getElecPrice(tariffElecUsageYearly,0.05,tariffElecStandingCharge,tariffElecTariff);
            
            // Totals
            var tariffEstimatedYearlyCost = tariffElecCostYearly + tariffGasCostYearly;
            var tariffEstimatedMonthlyCost = tariffEstimatedYearlyCost / 12;
            
            var tariffYearlySaving = userCurrentProjection - tariffEstimatedYearlyCost;
            var tariffMonthlySaving = tariffYearlySaving / 12;
            var tariffExitFee = d.exitFee;
            
            var row = document.getElementById('primitive').cloneNode(true);
            
            row.id = '';
            
            row.querySelector('img').src = d.provider_logo;
            row.querySelector('.tariffName').textContent = tariffName;
            row.querySelector('.promoDuration').textContent = tariffPromoDuration;
            row.querySelector('.tariffRating').innerHTML = generateRating();
            row.querySelector('.exitFee').textContent = tariffExitFee;
            
            if( !row.classList.contains('no-saving') ){
                row.querySelector('.annualSaving').textContent = parseInt(tariffYearlySaving).toFixed(0);   
            }
            
            row.querySelector('.personalProj').textContent = parseInt(tariffEstimatedYearlyCost).toFixed(0);
            row.querySelector('.personalProjMonthly').textContent = parseInt(tariffEstimatedMonthlyCost).toFixed(0);
            
            row.setAttribute('data-annual-saving',tariffYearlySaving);
            row.setAttribute('data-monthly-saving',tariffMonthlySaving);
            
            grid.appendChild(row);
            
            if (d.provider_name == localStorage.getItem('userProvider')) {
                //console.log('SAME PROVIDER');
                row.setAttribute('data-current','true');
                sameProvider = true;
                if( bestSavingCurrent <  tariffYearlySaving ){
                    bestSavingCurrent = tariffYearlySaving;
                    b.querySelector('.currCheap').textContent = bestSavingCurrent.toFixed(0);
                }
            }

            if (d.bigName == true) {
                //console.log('BIG NAME');
                row.setAttribute('data-big','true');
                if( bestSavingBigSupplier <  tariffYearlySaving ){
                    bestSavingBigSupplier = tariffYearlySaving;
                    b.querySelector('.bigCheap').textContent = bestSavingBigSupplier.toFixed(0);
                }
            }
            
            if( bestSaving <  tariffYearlySaving ){
                bestSaving = tariffYearlySaving;
                
                b.querySelector('.fullCheap').textContent = bestSaving.toFixed(0);
            }
            
            // SLIDER ACTIONS
            var sliderBtns = row.querySelectorAll('.sliderBtn');
            sliderBtns.forEach(function(sbtn){
                sbtn.addEventListener('click', function(){
                    var sliderType = this.getAttribute('data-slider');
                    document.body.setAttribute('data-slider', sliderType);
                    document.body.classList.add('open-slider');
                    document.body.classList.add('fixed');
                    document.querySelectorAll('.slider').forEach(function(s){
                        s.scrollTop = 0;
                    })

                    b.querySelector('.detailsProviderLogo').setAttribute('src',d.provider_logo);
                    setVal('ppCost', parseInt(tariffEstimatedYearlyCost).toFixed(2));
                    setVal('savingCost', parseInt(tariffYearlySaving).toFixed(2));
                    setVal('detailsCost', parseInt(tariffEstimatedYearlyCost).toFixed(2));
                    setVal('detailsGasCost',parseInt(tariffGasCostYearly).toFixed(2));
                    setVal('detailsElecCost',parseInt(tariffElecCostYearly).toFixed(2));
                    setVal('detailsProvider',d.provider_name);
                    setVal('detailsTariffName',tariffName);
                    setVal('detailsTariffType',d.userType);
                    

                }); 
            });

            //console.log('SERVICE: SORTING CARDS');
            rowSorter('annual-saving','card',true);

            
            //console.log('SERVICE: RESULT ' + renderedResults + ' RENDERED');
            renderedResults = renderedResults + 1;
            renderResults(data);
        } else {
            console.log('SERVICE: ALL RESULTS RENDERED');
            setTimeout(function(){
                b.classList.remove('fixed');
                b.classList.remove('interstitial');
                b.classList.add('results-loaded');
                b.querySelector('.loading-panel').style.zIndex = -10;
            },0);
        }
    };
    

    renderResults(data);

    if (sameProvider == false) {
        document.querySelector('.resultsTabs li:first-child').setAttribute('disabled', 'disabled');
    }

};

window.scrollTop = 0;

// Close trigger behaviour
closeTriggers.forEach(function(el){
    el.addEventListener('click',function(){
        b.classList.remove('fixed');
        b.classList.remove('open-slider');
    });
});

// Tab behaviour
tabTriggers.forEach(function(el){
    el.addEventListener('click',function(){
        var showRef = el.getAttribute('data-sort-switch');
        console.log(showRef);
        b.setAttribute('data-filter',showRef);
    });
});

// Breakdown behaviour
breakdownLink.forEach(function(el){
    el.addEventListener('click',function(){
        var ref = false;
        if( el.classList.contains('show-breakdown') ){
            ref = true;
        }
        b.setAttribute('data-show-breakdown',ref);
    });
});

AJAX_JSON_Req('energy-data-test.json',getResults);