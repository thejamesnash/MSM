var dataSrc = document.body.getAttribute('data-form-data-src');
document.body.classList.add(localStorage.getItem('resultsClass'));

function AJAX_JSON_Req(url,callback) {
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

var formAction;

var formBuilder = function(obj,formBuilder){
    if( obj[0].clearStorage == true ){
        localStorage.clear();   
    }
    
    formAction = obj[0].formAction;
    
    var form = document.forms[0];
    form.setAttribute('action',obj[0].formAction);
    
    // Hide content
    var hideElement = function(el){
//        console.log(el)
        el.classList.add('hidden');
        el.style.maxHeight = '0px';
    };
    
    // Show content
    var showElement = function(el){
//        console.log(el)
        el.classList.remove('hidden');
        el.style.maxHeight = el.scrollHeight + 200 + 'px';
    };
    
    // Build label
    var buildLabel = function(q,qId){
        var label = document.createElement('label');
        if (q.label) {
            label.innerHTML = q.label;
        }
        if (q.subText) {
            var sub = document.createElement('sub');
            sub.textContent = q.subText
            label.appendChild(sub)
        }
        label.setAttribute('for',qId);
        return label;
    }
    
    // Build pseudo label
    var buildPseudoLabel = function(q){
        var label = document.createElement('p');
        label.className = 'label';
        if (q.label) {
            label.innerHTML = q.label;
        }
        return label;
    }
    
    // Build input
    var buildInput = function(q,qId,qName,qType,qStore){
        var input = document.createElement('input');
        input.id = qId;
        input.name = qName;
        input.setAttribute('type',qType);
        if (q.id == 'autocomplete'){
            input.addEventListener('keyup', function(){
                initAutocomplete();
            });
        }
        if(q.placeholder){
            input.setAttribute('placeholder',q.placeholder);
        }
        if(q.value){
            input.setAttribute('value',q.value);
        }
        if(q.checked){
            input.checked = true
        }
        
        
        
        if( q.store | qStore ){

            if( qType === 'radio' ){
                
                if( input.value === localStorage.getItem(input.name) ){
                    input.checked = true;
                }
                input.addEventListener('click',function(){
                    localStorage.setItem(this.name,this.value);
                    console.log(localStorage);
                });                
            } else {
                if( localStorage.getItem(input.name) ){
                    input.value = localStorage.getItem(input.name);
                }
                input.addEventListener('blur',function(){
                    localStorage.setItem(this.id,this.value);
                    console.log(localStorage);
                });                
            }
        }
        return input;
    };
    
    // Build multiple input
    var buildMultipleInput = function(q,qId,qName,qType,qStore){
        var row = document.createElement('li');
        var label = buildLabel(q,qId);
        var input = buildInput(q,qId,qName,qType,qStore);
        row.appendChild(input);
        
        if(q.showDependant){
//            console.log(input);
            input.setAttribute('data-show',q.showDependant);
        }
        if(q.hideDependant){
//            console.log(input);
            input.setAttribute('data-hide',q.hideDependant);
        }
        if ( q.class ) {
            var cls = q.class;
            if (cls.includes('logo')) {
                var logo = document.createElement('sub');
                logo.className = q.class;
                label.appendChild(logo);
            }
            else {
                label.className = q.class;
            }
        }
        row.appendChild(label);
        
        return row;
    };    
    
    // Build select
    var buildSelect = function(q,inputId,inputName){
        var selectWrapper = document.createElement('div');
        selectWrapper.className = 'form-pseudo-select';
        var selectElement = document.createElement('select');
        selectElement.id = inputId;
        if(q.name){
            selectElement.name = q.name;
        }

        var optionDefault = document.createElement('option');
        optionDefault.textContent = '--Please select--'
        optionDefault.setAttribute('disabled', 'disabled');
        selectElement.appendChild(optionDefault);

        function compareStrings(a, b) {
            // Assuming you want case-insensitive comparison
            a = a.toLowerCase();
            b = b.toLowerCase();

            return (a < b) ? -1 : (a > b) ? 1 : 0;
        }

        q.answers.sort(function(a, b) {
            return compareStrings(a.label, b.label);
        })

        q.answers.forEach(function (option, i) {
            var optionElement = document.createElement('option');
            optionElement.text = option.label;
            optionElement.setAttribute('value', option.value);
            if( option.class ){
                optionElement.className = option.class
            }
            selectElement.appendChild(optionElement);
        });

        selectElement.selectedIndex = 0;

        selectWrapper.appendChild(selectElement);
        if(obj.required){
            selectElement.setAttribute('required','required');
        }
        if( q.store == true ){
            selectElement.addEventListener('change',function(){
                localStorage.setItem(this.name,this.value);
            });
        }
        return selectWrapper;
    }
    
    // Build DOB
    var buildDOB = function(q,inputId,inputName){
        var dobWrapper = document.createElement('div');
        dobWrapper.className = 'date-wrapper';
        var dayInput = document.createElement('input');
        dayInput.type = 'tel';
        dayInput.id = inputId + '-day';
        dayInput.setAttribute('placeholder','DD');
        dobWrapper.appendChild(dayInput);
        var daySlash = document.createElement('span');
        daySlash.textContent = '/';
        dobWrapper.appendChild(daySlash);
        var monthInput = document.createElement('input');
        monthInput.id = inputId + '-month';
        monthInput.type = 'tel';
        monthInput.setAttribute('placeholder','MM');
        dobWrapper.appendChild(monthInput);
        var monthSlash = document.createElement('span');
        monthSlash.textContent = '/';
        dobWrapper.appendChild(monthSlash);
        var yearInput = document.createElement('input');
        yearInput.id = inputId + '-year';
        yearInput.type = 'tel';
        yearInput.setAttribute('placeholder','YYYY');
        dobWrapper.appendChild(yearInput);
        
        return dobWrapper;
    };
    
    // Build hint
    var buildHint = function(t){
        var hint = document.createElement('small');
        hint.className = 'form-hint';
        hint.textContent = t;
        return hint;
    }
    
    var buildafterLink = function(t){
        var afterLink = document.createElement('span');
        afterLink.className = 'afterLink';
        afterLink.textContent = t;
        return afterLink;
    }
    
    var buildSubmit = function(q){
        var wrap = document.createElement('div'),
            submit = document.createElement('button');

        wrap.className = "submitWrap";
        wrap.appendChild(submit);

        submit.className = "btn btn__primary";
        submit.textContent = q.value;
        submit.type = "button";
        submit.addEventListener('click',function(){
            window.location = formAction;
        });

        if (q.label) {
            var text = document.createElement('p');
            text.innerHTML = q.label;
            wrap.appendChild(text);
        }

        return wrap;
    };

    var buildTariffSummary = function(q){
        var wrap = document.createElement('div'),
            tariffWrap = document.createElement('div'),
            summaryWrap = document.createElement('div'),
            img = document.createElement('img'),
            header = document.createElement('h1'),
            tariffExtra = document.createElement('div'),
            tariff = document.createElement('p'),
            link = document.createElement('a'),
            summText = document.createElement('p'),
            ppWrap = document.createElement('div'),
            summLink = document.createElement('a');

        wrap.className = "tariffSummary hidden";
        tariffWrap.className = "tariffWrap";
        summaryWrap.className = "summaryWrap";

        header.textContent = "Your current tariff";

        tariffExtra.className = "tariffExtra";
        tariffExtra.innerHTML = "<ul><li><p>Unit rate</p><p><span class='gasUnitRate'>2.953</span>p per kWh</p></li><li><p>Standing charge</p><p>£<span class='gasStdCharge'>54.75</span>/yr</p></li></ul><ul><li><p>Unit rate</p><p><span class='elecUnitRate'>12.760</span>p per kWh</p></li><li><p>Standing charge</p><p>£<span class='elecStdCharge'>65.70</span>/yr</p></li></ul><p>(all rates ex. VAT)</p>";

        link.addEventListener('click', function(){
            tariffExtra.classList.toggle('open');
        })

        tariffWrap.appendChild(img);
        tariffWrap.appendChild(header);
        tariffWrap.appendChild(tariff);
        tariffWrap.appendChild(tariffExtra);
        tariffWrap.appendChild(link);

        summText.innerHTML = "Based on what you told us you're spending <b>£</b><span class='annualSpend'>1,000</span> per year on your energy. Because your plan is ending soon we estimate that you will spend <b>£</b><span class='ppSpend'>1,200</span> over the next 12 months, unless you switch to a cheaper tariff.";
        ppWrap.innerHTML = "<p>Personal projection is a tool Ofgem has introduced to help simplify the energy market to benefit consumers. It is calculated by forecasting how much you will pay over the next 12 months if you don't switch. You can use personal projection to find cheaper deals on the market and figure out the best time to switch.</p>"

        summText.className = 'summText';
        ppWrap.className = 'ppWrap';

        summLink.addEventListener('click', function(){
            ppWrap.classList.toggle('open');
        })

        summaryWrap.appendChild(summText);
        summaryWrap.appendChild(ppWrap);
        summaryWrap.appendChild(summLink);

        wrap.appendChild(tariffWrap);
        wrap.appendChild(summaryWrap);

        return wrap;
    };
    
    var buildTextList = function(contentData){
        var contentWrapper = document.createElement('ul');
        contentWrapper.className = "assumptions-list";
        var listItems = contentData.split('*');
        //console.log(listItems);
        listItems.forEach(function(el,i){
            //console.log(el);
            var listItem = document.createElement('li');
            listItem.innerText = el;
            contentWrapper.appendChild(listItem);
        });
        return contentWrapper;
    };
    
    // Build help
    var buildHelp = function(row,questionWrap,helpText) {

        function buildHelpElement(e, c, t) {
            var element = document.createElement(e);
            element.className = c;
            if (t) {
                element.innerHTML = t;
            }
            return element;
        };

        var helpTrigger = buildHelpElement('a', 'form-help-trigger');
        var helpWrapper = buildHelpElement('div', 'form-help-wrap');
        var helpMessage = buildHelpElement('div', 'help-msg');

        if( helpText.indexOf('*') > 0 ){
            var helpTextEl = buildTextList(helpText);
        } else {
            var helpTextEl = buildHelpElement('p', 'help-text', helpText);
        }
        var dtText = document.createElement('span');
        dtText.textContent = 'Need help?';



        helpTrigger.addEventListener('click',function(){
            this.classList.toggle('open');
            if(this.classList.contains('open')){
                this.firstElementChild.textContent = 'Hide help';
            } else {
                this.firstElementChild.textContent = 'Need help?';
            }
        });
        helpMessage.appendChild(helpTextEl);
        helpWrapper.appendChild(helpMessage);
        questionWrap.appendChild(helpTrigger);
        helpTrigger.appendChild(dtText);
        questionWrap.appendChild(helpWrapper);
    };
    
    var buildAutoComplete = function(q){
        var initAutocomplete = function(d){
            var aInput = document.getElementById(q.name);
            var keyCount = 0;
            var autoList = document.createElement('ul');
            autoList.className = 'autocomplete-answers';
            aInput.parentElement.appendChild(autoList);
            
            var updateList = function(providerArray){
                autoList.innerHTML = '';
                autoList.style.display = 'block';
                providerArray.forEach(function(a){
                    var li = document.createElement('li');
                    li.textContent = a;
                    autoList.appendChild(li);
                    li.addEventListener('click',function(){
                        autoList.style.display = 'none';
                        autoList.innerHTML = '';
                        aInput.value = li.textContent;
                        localStorage.setItem(q.name,li.textContent);
                    });
                });
            };
            
            aInput.addEventListener('keyup',function(evt){
                keyCount = aInput.value.length;    
                if(keyCount >= 3){
                    var providerArray = [];
                    var str = aInput.value.toLowerCase();
                    d.providers.forEach(function(p){
                        if( p.label.toLowerCase().indexOf(str) > -1 ){
                            providerArray.push(p.label);
                        }
                    });
                    if( providerArray.length < 1 ){
                        updateList(['No providers found. Please try again.']);
                    } else {
                        updateList(providerArray);
                    }
                } else {
                    autoList.innerHTML = '';
                    autoList.style.display = 'none';
                }
            });
        };
        AJAX_JSON_Req('providers.json',initAutocomplete);
    };
    
    
    obj.forEach(function(formSectionData,formSectionIndex){
        
        var formSection = document.createElement('fieldset');
        if( formSectionData.class ){
            formSection.classList.add(formSectionData.class);
        }
        if( formSectionData.sectionTitle ){
            var legend = document.createElement('legend');
            legend.textContent = formSectionData.sectionTitle;
            formSection.appendChild(legend);
        }
        if( formSectionData.subTitle ){
            var subTitle = document.createElement('h2');
            subTitle.className = "form-subtitle";
            subTitle.textContent = formSectionData.subTitle;
            formSection.appendChild(subTitle);
        }
        
        if( formSectionData.id ){
            formSection.id = formSectionData.id;
        }
        
        
        
        var questionsWrapper = document.createElement('ol');
        formSection.appendChild(questionsWrapper);
        
        formSectionData.questions.forEach(function(q,inputIndex){
            if( q.name ){
                var inputName = q.name;
            }
            else {
                var inputName = 'q-' + formSectionIndex + '-' + inputIndex;    
            }
            var row = document.createElement('li');
            var questionWrapper = document.createElement('div');
            var answerWrapper = document.createElement('div');

//            console.log(row);
            if( q.id ){
                row.id = q.id;
            }

            row.appendChild(questionWrapper);
            row.appendChild(answerWrapper);
            var  qStore = false;
            if( q.store ){
                qStore = true;
            }
            
            if(q.type === 'radio' || q.type === 'checkbox'){
                var  qStore = false;
                if( q.store ){
                    qStore = true;
                }
                questionWrapper.appendChild(buildPseudoLabel(q));
                var multipleQuestionWrapper = document.createElement('ul');
                if( q.inline ){
                    multipleQuestionWrapper.classList.add('form-inline-radios');
                }
                q.answers.forEach(function(m,mIndex){
                    var inputId = inputName + '-' + mIndex;
                    multipleQuestionWrapper.appendChild(buildMultipleInput(m,inputId,inputName,q.type,qStore));
                });
                answerWrapper.appendChild(multipleQuestionWrapper);
                if( q.displaySwitch ){
                    answerWrapper.querySelectorAll('input').forEach(function(el){
                        el.addEventListener('click',function(){
                            
                            if( el.getAttribute('data-hide') ){
                                var hideEl = el.getAttribute('data-hide').split(' ');
                                hideEl.forEach(function(h){
//                                    console.log(h)
                                    hideElement(document.querySelector('#'+h));
                                })
                            }
                            if( el.getAttribute('data-show') ){
                                showElement(document.querySelector('#'+el.getAttribute('data-show')));
                            }
                        });
                    });
                }
            } else if( q.type === 'submit' ){
                var inputId = inputName;
                //bText,bClass,bId
                answerWrapper.appendChild(buildSubmit(q));
            } else if( q.type === 'tariff' ){
                var inputId = inputName;
                //bText,bClass,bId
                answerWrapper.appendChild(buildTariffSummary(q));
            } else if( q.type === 'dob' ){
                var inputId = inputName;
                questionWrapper.appendChild(buildPseudoLabel(q));
                answerWrapper.appendChild(buildDOB(q,inputId,inputName));
            } else if( q.type === 'autocomplete' ){
                var inputId = inputName;
                questionWrapper.appendChild(buildLabel(q,inputId));
                answerWrapper.appendChild(buildInput(q,inputId,inputName,'text',qStore));
                answerWrapper.classList.add('autocomplete');
                buildAutoComplete(q);
            } else {
                if (q.id) {
                    var inputId = q.id + '-0';
                }
                else {
                    var inputId = inputName + '-0';
                }
                questionWrapper.appendChild(buildLabel(q,inputId));
                if( q.type === 'select'){
                    answerWrapper.appendChild(buildSelect(q,inputId,inputName));
                } else {
                    answerWrapper.appendChild(buildInput(q,inputId,inputName,q.type,qStore));
                }
            }
            
            if(q.subtype){
                console.log(q.subtype);
                answerWrapper.classList.add('icon-'+q.subtype);
            }
            
            if(q.class){
                row.classList.add(q.class);
            }

            if(q.helpText){
                buildHelp (row,questionWrapper,q.helpText);
            }
            
            if(q.hint){
                questionWrapper.appendChild(buildHint(q.hint));
            }
            if(q.afterLink){
                answerWrapper.appendChild(buildafterLink(q.afterLink));
            }

            questionsWrapper.appendChild(row);
            if(q.hidden){
                row.id = q.name;
                hideElement(row);
            }
        });
        form.appendChild(formSection);
        
        if( formSectionData.hidden ){
            hideElement(formSection);
        }
    });

  

};


AJAX_JSON_Req(dataSrc,formBuilder);