//var userTariff = "Online Testing";
//var monthEnd = 7;

var gasDailyUsage,
    elecDailyUsage,
    gasUsageYearly,
    elecUsageYearly,
    userGasStandingCharge,
    userGasTariff,
    userGasTariffAfter,
    userElecStandingCharge,
    userElecTariff,
    userElecTariffAfter,
    userTariff,
    userType,
    monthEnd;

function lsVal(id) {
    return localStorage.getItem(id);
}


function getDailyUsage(val, term) {
    console.log(val)
    console.log(term)
    switch(term) {
        case 'termDay':
            return val
        break;
        case 'termWeek':
            return (val*52) / 365;
        break;
        case 'termMonth':
            return (val*12) / 365;
        break;
        case 'termQuarter':
            return (val*4) / 365;
        break;
        case 'termYear':
            return val/365;
        break;
    }
}

function getDailyUsageFromSpend(val, term, fuel) {
    fuel = fuel.charAt(0).toUpperCase() + fuel.slice(1);

    val = val*100; //convert to pence
    val = val - (val*0.05); //remove VAT
    console.log(val)
    console.log(term)
    var stdCharge = window['user' + fuel + 'StandingCharge'];

    if (userType == 'var') {
        var unitRate = window['user' + fuel + 'TariffAfter'];
    }
    else {
        var unitRate = window['user' + fuel + 'Tariff'];
    }

    switch(term) {
        case 'termDay':
            console.log(val - stdCharge)
            return (val - stdCharge) / unitRate;
        break;
        case 'termWeek':
            console.log((val*52)/365)
            return (((val*52)/365) - stdCharge) / unitRate;
        break;
        case 'termMonth':
            console.log((val*12)/365)
            return (((val*12)/365) - stdCharge) / unitRate;
        break;
        case 'termQuarter':
            console.log((val*4)/365)
            return (((val*4)/365) - stdCharge) / unitRate;
        break;
        case 'termYear':
            console.log(fuel + ' DAILY COST: ' + val/365)
            return ((val/365) - stdCharge) / unitRate;
        break;
    }
}

function getAnnualPrice(gasStandingCharge,gasTariff,elecStandingCharge,elecTariff,monthEnd,gasTariffAfter,elecTariffAfter,user){
    gasDailyUsage = localStorage.getItem('gasDailyUsage');
    elecDailyUsage = localStorage.getItem('elecDailyUsage');

    gasUsageYearly =  gasDailyUsage * 365;
    elecUsageYearly =  elecDailyUsage * 365;

    console.log(gasStandingCharge)
    console.log(gasTariff)
    console.log(elecStandingCharge)
    console.log(elecTariff)
    console.log(gasUsageYearly)
    console.log(elecUsageYearly)

    var price;
    var vat = 0.05;

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

    monthEnd = parseInt(monthEnd);
    console.log(monthEnd)

    var currYearPrice = 0;
    var afterYearPrice = 0;

    if (monthEnd > 0) {
        localStorage.setItem('monthsLeft', monthEnd)

        currYearPrice = getGasPrice(gasStandingCharge,gasTariff) + getElecPrice(elecStandingCharge,elecTariff);
        afterYearPrice = getGasPrice(gasStandingCharge,gasTariffAfter) + getElecPrice(elecStandingCharge,elecTariffAfter);

        console.log(currYearPrice)
        console.log(afterYearPrice)

        if (monthEnd >= 12) { //ALL PROMO
            price = currYearPrice;
        }
        else {
            var remMonths = 12 - monthEnd;
            console.log(monthEnd)
            currYearPrice = (currYearPrice/12)*monthEnd;
            console.log(currYearPrice)
            afterYearPrice = (afterYearPrice/12)*remMonths;
            console.log(afterYearPrice)
            price = currYearPrice + afterYearPrice;
        }
    }
    else {
        price = getGasPrice(gasStandingCharge,gasTariffAfter) + getElecPrice(elecStandingCharge,elecTariffAfter);
    }

    var currSpending = getGasPrice(gasStandingCharge,gasTariffAfter) + getElecPrice(elecStandingCharge,elecTariffAfter);
    if (gasTariff > 0) { //PROMO FIGURE OVER LAST 12 MONTHS
        currSpending = getGasPrice(gasStandingCharge,gasTariff) + getElecPrice(elecStandingCharge,elecTariff);
    }

    console.log(price);
    if (user) {
        localStorage.setItem('userCurrRemain', currYearPrice)
        localStorage.setItem('userNewRemain', afterYearPrice)
        localStorage.setItem('userMonthsLeft', monthEnd)
        localStorage.setItem('userCurrentTariffCost', currSpending)
        localStorage.setItem('userPersonalProj', price)
    }
    else {
        localStorage.setItem('currentTariffCost', currSpending)
        localStorage.setItem('personalProj', price)
    }
    return price;
};

var setNextStep = function() {
    var si = document.querySelector('.step-indicator'),
        active = si.querySelector('.active'),
        newActive = active.nextElementSibling;

    active.classList.remove('active');
    active.classList.add('done');

    if (newActive) {
        newActive.classList.add('active');
    }

}

function init(){
    setNextStep();
    extraStuff();
    localStorage.setItem('energyRadio', "use");

    var updateFigures = function() {
        switch(localStorage.getItem('energyRadio')) {
            case 'use':
                console.log(lsVal('elecUsage-0'))
                console.log(lsVal('gasUsage-0'))
                if (lsVal('elecUsage-0') && lsVal('gasUsage-0')) {
                    var gasTerm = 'termMonth';
                    var elecTerm = 'termMonth';
                    if (lsVal('gasUsageTerm')) {
                        gasTerm = lsVal('gasUsageTerm');
                    }
                    if (lsVal('elecUsageTerm')) {
                        elecTerm = lsVal('elecUsageTerm');
                    }

                    gasDailyUsage = getDailyUsage(lsVal('gasUsage-0'), gasTerm)
                    elecDailyUsage = getDailyUsage(lsVal('elecUsage-0'), elecTerm)

                    console.log(gasDailyUsage);
                    console.log(elecDailyUsage);

                    //get figures
                    localStorage.setItem('gasDailyUsage', gasDailyUsage)
                    localStorage.setItem('elecDailyUsage', elecDailyUsage)

                    var annPrice = getAnnualPrice(userGasStandingCharge,userGasTariff,userElecStandingCharge,userElecTariff,monthEnd,userGasTariffAfter,userElecTariffAfter,true)
                    localStorage.setItem('userPersProj', annPrice)

                }
                break;
            case 'spend':
                console.log(lsVal('elecSpend-0'))
                console.log(lsVal('gasSpend-0'))
                if (lsVal('elecSpend-0') && lsVal('gasSpend-0')) {
                    var gasTerm = 'termMonth';
                    var elecTerm = 'termMonth';
                    if (lsVal('gasSpendTerm')) {
                        gasTerm = lsVal('gasSpendTerm');
                    }
                    if (lsVal('elecSpendTerm')) {
                        elecTerm = lsVal('elecSpendTerm');
                    }

                    gasDailyUsage = getDailyUsageFromSpend(lsVal('gasSpend-0'), gasTerm, 'gas')
                    elecDailyUsage = getDailyUsageFromSpend(lsVal('elecSpend-0'), elecTerm, 'elec')

                    console.log(gasDailyUsage);
                    console.log(elecDailyUsage);

                    localStorage.setItem('gasDailyUsage', gasDailyUsage)
                    localStorage.setItem('elecDailyUsage', elecDailyUsage)

                    //get figures
                    var annPrice = getAnnualPrice(userGasStandingCharge,userGasTariff,userElecStandingCharge,userElecTariff,monthEnd,userGasTariffAfter,userElecTariffAfter,true)
                    localStorage.setItem('userPersProj', annPrice)

                }
                break;
            case 'none':
                console.log(lsVal('bedrooms'))
                if (lsVal('bedrooms')) {
                    if (lsVal('bedrooms') == 1) {
                        gasDailyUsage = (10800/365);
                        elecDailyUsage = (2600/365);
                    }
                    else if (lsVal('bedrooms') == 2) {
                        gasDailyUsage = (16500/365);
                        elecDailyUsage = (3300/365);
                    }
                    else if (lsVal('bedrooms') == 4) {
                        gasDailyUsage = (22000/365);
                        elecDailyUsage = (4000/365);
                    }

                    localStorage.setItem('gasDailyUsage', gasDailyUsage)
                    localStorage.setItem('elecDailyUsage', elecDailyUsage)

                    //get figures
                    var annPrice = getAnnualPrice(userGasStandingCharge,userGasTariff,userElecStandingCharge,userElecTariff,monthEnd,userGasTariffAfter,userElecTariffAfter,true)
                    localStorage.setItem('userPersProj', annPrice)
                }
                break;
        }

        if (userType == 'var') {
            document.querySelector('.summaryWrap .summText').innerHTML = "We estimate you will pay <b>£" + parseInt(localStorage.getItem('userCurrentTariffCost')).toFixed(2) + "</b> over the next 12 months, unless you switch to a cheaper tariff."
        }
        else {
            document.querySelector('.summaryWrap .annualSpend').textContent = parseInt(localStorage.getItem('userCurrentTariffCost')).toFixed(2)
            document.querySelector('.summaryWrap .ppSpend').textContent = parseInt(localStorage.getItem('userPersonalProj')).toFixed(2)
        }

    };

    //console.log(document.querySelector('.submitWrap > button'));
    document.querySelector('.submitWrap > button').addEventListener('click', function(){
        window.location = "/pds/energy/pp/results/";
    })

    var bedrooms = document.getElementsByName('bedrooms');
    var setNext2 = false;
    bedrooms.forEach(function(b){
        b.addEventListener('click', function(){
            if (!setNext2) {
                setNextStep();
                setNext2 = true;
            }
        })
    });

    document.querySelector('#emailConfirm-0').addEventListener('keyup', function() {
        document.getElementById('results').classList.remove('hidden');
    })

    var fuelInput = ["elecUsage", "gasUsage", "gasSpend", "elecSpend"];
    fuelInput.forEach(function(f){
        document.querySelector('#' + f).classList.add('inline-fuel');
        var selectUsage = document.createElement('div');
        selectUsage.innerHTML = '<div class="form-pseudo-select"><select id="' + f + 'Term" name="' + f + 'Term"><option value="termDay">Per day</option><option value="termWeek">Per week</option><option value="termMonth" selected="selected">Per month</option><option value="termQuarter">Per quarter</option><option value="termYear">Per year</option></select></div>'
        document.querySelector('#' + f + ' > div:last-child').appendChild(selectUsage);
        document.querySelector('#' + f + ' > div:last-child select').addEventListener('change', function(){
            localStorage.setItem(f + 'Term', this.value);
        })
    });

    var triggers = ['gasUsage-0', 'gasUsageTerm', 'elecUsage-0', 'elecUsageTerm', 'gasSpend-0', 'gasSpendTerm', 'elecSpend-0', 'elecSpendTerm', 'bedrooms-0', 'bedrooms-1', 'bedrooms-2']
    triggers.forEach(function(t){
        var el = document.getElementById(t);
        switch(el.type) {
            case "tel":
                el.addEventListener('blur', function(){
                    updateFigures();
                })
                break;
            case "select-one":
                el.addEventListener('change', function(){
                    updateFigures();
                })
                break;
            case "radio":
                el.addEventListener('click', function(){
                    updateFigures();
                })
                break;
        }

    })



};

var results = function() {
    console.log('RESULTS')

    var userMonthEnd = localStorage.getItem('userMonthsLeft');
    if (userMonthEnd >= 12) {
        userMonthEnd = 11;
    }

    document.body.classList.add('fixed');
    document.body.setAttribute('data-type', 'pp');
    document.body.setAttribute('data-compare', 'pp');

    var compareRadios = document.querySelectorAll('.compareRadios input');
    compareRadios.forEach(function(c){
        c.addEventListener('click', function(){
            document.body.setAttribute('data-type', c.value);
            document.body.setAttribute('data-compare', c.value);
            var compareTabs = document.querySelectorAll('.compareSlider .tabs li');
            compareTabs.forEach(function(tab){
                tab.classList.remove('active');
                if (tab.getAttribute('data-comparetype') == c.value) {
                    tab.classList.add('active');
                }
            })
        });
    });

    document.querySelectorAll('.close-slider').forEach(function(c){
        c.addEventListener('click', function(){
            document.body.classList.remove('open-slider');
            document.body.classList.remove('fixed');
        });
    })

    var monthSet = document.querySelectorAll('.months > b');
    for (var i=0; i < monthSet.length; i++) {
        if (i < userMonthEnd) {
            monthSet[i].className = 'set';
        }
        else if (i == userMonthEnd) {
            monthSet[i].className = 'set last';
        }
        else {
            break;
        }
    }

    var tabs = document.querySelectorAll('.tabs > li');
    console.log(tabs)
    tabs.forEach(function(t){
        t.addEventListener('click', function(){
            var siblings = this.parentElement.querySelectorAll('li');
            siblings.forEach(function(tab){
                tab.classList.remove('active');
            })
            this.classList.add('active');

            if (!this.parentElement.classList.contains('resultsTabs')) {
                var compareType = this.getAttribute('data-comparetype');
                document.body.setAttribute('data-compare', compareType)
            }
            else {
                var sortType = t.getAttribute('data-sort-switch');
                b.setAttribute('data-sort-type', sortType);
            }
        });
    })

    if (localStorage.getItem('userType') == 'var') {
        b.setAttribute('data-user-type', 'var')
        b.setAttribute('data-compare', 'pp')
        b.setAttribute('data-type', 'pp')
        document.getElementById('comparePP').checked = true;
    }
    else {
        b.setAttribute('data-user-type', 'fixed')
        b.setAttribute('data-compare', 'curr')
        b.setAttribute('data-type', 'curr')
        document.getElementById('compareCurr').checked = true;
    }

}

if(window.location.href.indexOf("results") > -1) {
    results();
}
