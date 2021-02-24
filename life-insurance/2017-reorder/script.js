// Define AJAX call
    var ajax = function (method, url, data, callback) {
        var request = new XMLHttpRequest();
        request.open(method, url, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var response = JSON.parse(request.responseText);
                callback(response);
            } else if (request.readyState == 4 && request.status == 201) {
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
    
    


var addValidation = function(){

    var maxAge = 70;
    var primaryDayInput = document.getElementById('dob-1-dd');
    var primaryMonthInput = document.getElementById('dob-1-mm');
    var primaryYearInput = document.getElementById('dob-1-yyyy');
    var primaryAgeError = document.getElementById('primaryAgeErrorMsg');
    var primaryAgeNow = 0;
    var primaryDob;

    var secondaryDayInput = document.getElementById('dob-2-dd');
    var secondaryMonthInput = document.getElementById('dob-2-mm');
    var secondaryYearInput = document.getElementById('dob-2-yyyy');
    var secondaryAgeError = document.getElementById('secondaryAgeErrorMsg');
    var secondaryAgeNow = 0;
    var secondaryDob;
    
    var maxPolicyLength = 50;
    
    var secondAppYes = document.getElementById('second-applicant-yes');
    var secondAppNo = document.getElementById('second-applicant-no');

    var termMsg = document.getElementById('termMsg');
    var termInput = document.getElementById('Enquiry_FormattedCoverTerm');
    var termError = document.getElementById('errorInvalidDuration');
    
    
    var coverAmountEl = document.getElementById('Enquiry_FormattedCoverAmount');
    var cicAmountEl = document.getElementById('cicAmount');
    var cicAmountReplay = document.body.querySelector('.cicAmountReplay');
    var cicYes = document.getElementById('cicz-yes');
    var cicNo = document.getElementById('cicz-no');
    var cicWrap = document.getElementById('cicValue');
    var submitBtn = document.getElementById('btnSeeResults');
    var coverCalculator = document.getElementById('coverCalculator');
    
    coverCalculator.addEventListener('click',function(evt){
        evt.preventDefault();
        alert('Sorry, this feature is not ready');
    });
    
    cicYes.addEventListener('click',function(evt){
        //evt.preventDefault();
        cicWrap.classList.remove('hide');
    });
    
    cicNo.addEventListener('click',function(evt){
        //evt.preventDefault();
        cicWrap.classList.add('hide');
    });
    
    var fireTermValidation = function(msg){
        termError.classList.remove('hide');
        termError.querySelector('p').textContent = msg;    
    };
    var hideTermValidation = function(){
        termError.classList.add('hide');    
    };
    
    var termCalculator = function(){
        var oldestApplicantAge,
            oldestDob,
            termContent,
            calculatedDuration;
            
        if( primaryAgeNow >= secondaryAgeNow ){
            console.log('Primary is older');
            oldestApplicantAge = primaryAgeNow;
            oldestDob = primaryDob;
        } else if( secondaryAgeNow > primaryAgeNow ){
            console.log('Secondary is older');
            oldestApplicantAge = secondaryAgeNow;
            oldestDob = secondaryDob;
        }
        
        if( oldestApplicantAge >= maxAge ){
            fireTermValidation("Unfortunately we can only provide products to users between 17 and 70 years of age");
            termContent = "";
            termInput.setAttribute('placeholder','e.g.: 0 years');
            termInput.setAttribute('data-max-value',0);
            
        } else if( oldestApplicantAge < maxAge ){
            hideTermValidation();
            calculatedDuration = (maxAge - oldestApplicantAge + 15);
            if( calculatedDuration > maxPolicyLength ){
                calculatedDuration = maxPolicyLength;
            }
            termContent = "Based on your date of birth the maximum policy duration is " + calculatedDuration + " years";
            termInput.setAttribute('placeholder','5 to '+calculatedDuration + ' years');
            termInput.setAttribute('data-max-value',calculatedDuration);
        }
        termMsg.textContent = termContent;

    };
    
    termInput.addEventListener('blur',function(){
        var termValue = Number(this.getAttribute('data-max-value'));
        var thisValue = Number(this.value);
        console.log('Maximum term: ' + termValue);
        console.log('Requested term: ' + thisValue);
        if( thisValue < 5  ){
            fireTermValidation('Sorry, the minimum policy duration is 5 years.');
        } else if( thisValue > 4 ){
            console.log('More than the minimum');
            hideTermValidation();
            if( thisValue > termValue ){
                fireTermValidation('Sorry, based on your date of birth the maximum policy duration for you is ' + termValue + ' years.');
            }
        }
//        if( this.value > termValue ){
//            if( this.value < 5 ){
//                fireTermValidation('Sorry, the minimum policy duration is 5 years.');
//            } else {
//                fireTermValidation('Sorry, based on your date of birth the maximum policy duration for you is ' + termValue + ' years.');
//            }
//        } else {
//            hideTermValidation();
//        }
        
    });

    var ontoTheNext = function(el){
        if(el.value.length > 1){
            el.nextElementSibling.focus();
        }
    };
    
    
    var updateCicValues = function(val){
        var cic = Math.ceil(val * 0.25);
        cicAmountEl.setAttribute('placeholder','e.g. £' + cic);
        cicAmountReplay.innerHTML = cic;
    };
    
    coverAmountEl.addEventListener('keyup',function(){
        updateCicValues( this.value );    
    });
    
    primaryDayInput.addEventListener('keyup',function(){
        ontoTheNext(this);
    });
    secondaryDayInput.addEventListener('keyup',function(){
        ontoTheNext(this);
    });
    primaryMonthInput.addEventListener('keyup',function(){
        ontoTheNext(this);
    });
    secondaryMonthInput.addEventListener('keyup',function(){
        ontoTheNext(this);
    });
    
    secondAppYes.addEventListener('click',function(){
        document.body.setAttribute('data-second-applicant',true);
    });
    secondAppNo.addEventListener('click',function(){
        document.body.setAttribute('data-second-applicant',false);
    });

    var ageCalculator = function(dateString){
        var ageNow;
        var birthday = new Date(dateString);
        function _calculateAge(birthday) { // birthday is a date
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        ageNow = _calculateAge(birthday);
        return ageNow;
    };

    primaryYearInput.addEventListener('blur',function(){
        var dateString = primaryYearInput.value + '-' + primaryMonthInput.value + '-' + primaryDayInput.value;
        primaryDob = primaryDayInput.value + '/' + primaryMonthInput.value + '/' + primaryYearInput.value;

        primaryAgeNow = ageCalculator(dateString);
        if( primaryAgeNow > 69 ){
            primaryAgeError.classList.remove('hide');
            primaryAgeError.querySelector('p').textContent = "Unfortunately we can only provide products to users between 17 and 70 years of age";
        } else {
            primaryAgeError.classList.add('hide');
        }
        termCalculator();
    });

    secondaryYearInput.addEventListener('blur',function(){
        var dateString = secondaryYearInput.value + '-' + secondaryMonthInput.value + '-' + secondaryDayInput.value;
        primaryDob = secondaryDayInput.value + '/' + secondaryMonthInput.value + '/' + secondaryYearInput.value;

        secondaryAgeNow = ageCalculator(dateString);
        if( secondaryAgeNow > 69 ){
            secondaryAgeError.classList.remove('hide');
            secondaryAgeError.querySelector('p').textContent = "TEST Unfortunately we can only provide products to users between 17 and 70 years of age";
        } else {
            secondaryAgeError.classList.add('hide');
        }
        termCalculator();
    });
    
    
    
    
    var getAddressFromPostcode = function(postcode){

        var handleResponse = function(obj){
            console.log(obj.items.length);
            if(obj.items.length > 0){
                console.log(obj.items);
                var userHouseNo = document.getElementById('Enquiry_HouseNum').value;
                var userHouseObj;
                obj.items.forEach(function(h){
                    if( h.buildingNumber == userHouseNo ){
                        console.log(h);
                        document.getElementById('Enquiry_FullAddressDisplay').textContent = h.buildingNumber + ' ' + h.thoroughfare + ', ' + h.postTown + ', ' + h.county + ',  ' + h.postcode;
                        document.getElementById('Enquiry_FindAddressWrap').classList.add('hide');
                        document.getElementById('Enquiry_FullAddressSummary').classList.remove('hide');
                    }
                });
                
            } else {
                console.warn('Address lookup has failed');
            }
        };
        var proxyRef = 'https://jamesnash-trial-prod.apigee.net/msmcreditcards/gb/reference-data/v0/addresses?postcode='+postcode;
        ajax('GET',proxyRef,null,handleResponse);
    };

    
    var userNameObj;
    
    document.getElementById('Enquiry_FindAddress').addEventListener('click',function(evt){
        evt.preventDefault();
        console.log('Address lookup');
        getAddressFromPostcode(document.getElementById('Enquiry_PostCode').value);
    });
    
    document.getElementById('Enquiry_EditAddress').addEventListener('click',function(evt){
        evt.preventDefault();
        document.getElementById('Enquiry_PostCode').value = '';
        document.getElementById('Enquiry_HouseNum').value = '';
        document.getElementById('Enquiry_FindAddressWrap').classList.remove('hide');
        document.getElementById('Enquiry_FullAddressSummary').classList.add('hide');
    });
    
    document.body.querySelectorAll('.question-text-help').forEach(function(el){
        el.addEventListener('click',function(){
            console.log('Help clicked');
            if( el.classList.contains('help-triggered') ){
                el.classList.remove('help-triggered');
                el.nextElementSibling.classList.add('hide');
            } else {
                el.classList.add('help-triggered');
                el.nextElementSibling.classList.remove('hide');
            }
        });
    });
    document.body.querySelectorAll('.question-text-help.button-link').forEach(function(el){
        el.addEventListener('click',function(evt){
            evt.preventDefault();
        });
    });
    
    
};
addValidation();

