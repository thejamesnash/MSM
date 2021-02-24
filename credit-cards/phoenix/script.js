var b = document.body;
var fromReplay = false;
var yearsAtAddress = 0;
var validationOn = false;

var getClosest = function (elem, selector) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }

    return null;

};

// easing functions http://goo.gl/5HLl8
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) {
    return c/2*t*t + b
  }
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
};


// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

function scrollTo(to, callback, duration) {
  // because it's so difficult to detect the scrolling element, just move them all
  function move(amount) {
    document.documentElement.scrollTop = amount;
    document.body.parentNode.scrollTop = amount;
    document.body.scrollTop = amount;
  }
  function position() {
    return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
  }
  var start = position(),
    change = to - start,
    currentTime = 0,
    increment = 20;
  duration = (typeof(duration) === 'undefined') ? 500 : duration;
  var animateScroll = function() {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    // move the document.body
    move(val);
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof(callback) === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };
  animateScroll();
}



var checkValidity = function(panel){
    console.log(panel);
    var panelInputs = panel.querySelectorAll('input');
    console.log(panelInputs);
    var panelNextBtn = panel.querySelectorAll('button.next');
    var panelCreateBtn = panel.querySelector('button#createAccount');
    console.log(panelNextBtn);
    var valid = true;
    panelInputs.forEach(function(el){
        if( el.type == 'radio' ){
            var parentWrap = getClosest(el,'ol');
            if( parentWrap.getAttribute('data-valid') == 'true' ){
                valid = true;
            } else {
                valid = false;
            }    
        } else if( el.type == 'checkbox' ){
            console.log(el);
            if( panel.getAttribute('data-panel') == '2' ){
                var parentWrap = getClosest(el,'ol');
                if( parentWrap.getAttribute('data-valid') == 'true' ){
                    valid = true;
                } else {
                    valid = false;
                }  
            }
        } else {
            if( el.getAttribute('data-valid') == 'true' ){
                valid = true;
            } else {
                valid = false;
            }    
        }
        
    });
    console.log('Is panel complete? ' + valid);
    if( valid ){
        panelNextBtn.forEach(function(btn){
            btn.removeAttribute('disabled');
        });
        if( panelCreateBtn ){
           panelCreateBtn.removeAttribute('disabled');
        }
    }
    
};

var addressDuration = document.getElementsByName('years');
//console.log(addressDuration);
addressDuration.forEach(function (el) {
    el.addEventListener('click', function () {
        if (el.value < 5) {
            console.log('Must add another address');
            yearsAtAddress = yearsAtAddress + parseInt(el.value);
            console.log('Years at address: ' + yearsAtAddress);
            b.classList.remove('address-accepted');
        } else {
            console.log('Address duration accepted - hide more addresses');
            b.classList.add('address-accepted');
        }
    });
});



// Update progress bar
var progressEl = document.getElementById('progress');
var updateProgress = function(sectionProgress,activeSection){
    console.log('Updating progress bar');
    console.log('Section:' + activeSection);
    console.log('Progress %: ' + sectionProgress);
    var progressLis = document.body.querySelectorAll('.progress > ol > li');
    progressLis.forEach(function(li){
        li.classList.remove('active');
    });
    progressLis[activeSection].classList.add('active');
    progressEl.value = sectionProgress;
};


var goToPanel = function(ref){
    var getElementIndex = function(element,elementArray) {
        return Array.from(elementArray).indexOf(element);
    }
    var resetAllSiblings = function(siblings,activeIndex){
        siblings.forEach(function(s){
            var sIndex = getElementIndex(s,siblings);
            //console.log(sIndex);
            s.classList.remove('unanswered');
            s.classList.remove('active');
            s.classList.remove('answered');
            
            if( sIndex < activeIndex ){
                s.classList.add('answered');
            } else if( sIndex === activeIndex ){
                s.classList.add('active');
            } else if( sIndex > activeIndex ){
                s.classList.add('unanswered');
            }
//            s.style.transition = 'all 0.2s ease-in-out';
        })
    };
    var sections = b.querySelectorAll('section');
    var targetPanel = b.querySelector('div[data-panel="'+ref+'"]');
    var targetSection = getClosest(targetPanel,'section');
    var targetSectionIndex = getElementIndex(targetSection,sections);
    var targetSectionPanels = targetSection.querySelectorAll('.panel');
    var targetPanelIndex = getElementIndex(targetPanel,targetSectionPanels);
    
    resetAllSiblings(sections,targetSectionIndex);
    resetAllSiblings(targetSectionPanels,targetPanelIndex); 
};

var previousPanel = function (p) {
    var targetRef = p.getAttribute('data-previous-panel');
    var targetPanel = b.querySelector('div[data-panel="' + targetRef + '"]');
    p.classList.remove('active');
    p.classList.add('unanswered');
    targetPanel.classList.remove('answered');
    targetPanel.classList.add('active');
    updateProgress(targetPanel.getAttribute('data-section-progress'),targetPanel.getAttribute('data-section'));
};

var nextPanel = function (p, btn) {
    if( fromReplay ){
        goToPanel(12);
        fromReplay = false;        
    } else {
        var parentPanelRef = p.getAttribute('data-panel');
        var targetRef = btn.getAttribute('data-target');
        var targetPanelRef = '[data-panel="' + targetRef + '"]';
        var targetPanel = b.querySelector(targetPanelRef);
        p.classList.remove('active');
        p.classList.add('answered');
        targetPanel.setAttribute('data-previous-panel', parentPanelRef);
        targetPanel.classList.remove('unanswered');
        targetPanel.classList.add('active');
        updateProgress(targetPanel.getAttribute('data-section-progress'),targetPanel.getAttribute('data-section'));
    }
    
    
    
};

var nextSection = function (p, btn) {
    if( fromReplay ){
        goToPanel(12);
        fromReplay = false; 
    } else {
        var parentSection = getClosest(p, 'section');
        parentSection.classList.remove('active');
        parentSection.classList.add('answered');
        var nextSection = parentSection.nextElementSibling;
        nextSection.classList.remove('unanswered');
        nextSection.classList.add('active');
        b.setAttribute('data-active-section',btn.getAttribute('data-target'))
        var targetPanel = nextSection.querySelector('.panel');
        updateProgress(targetPanel.getAttribute('data-section-progress'),targetPanel.getAttribute('data-section'));
    
    }
    
};
var previousSection = function(p,btn){
    //console.log('Previous section');
    var parentSection = getClosest(p, 'section');
    parentSection.classList.remove('active');
    parentSection.classList.add('unanswered');
    var nextSection = parentSection.previousElementSibling;
    nextSection.classList.remove('unanswered');
    nextSection.classList.add('active');
    b.setAttribute('data-active-section',btn.getAttribute('data-target'))
    var targetPanel = nextSection.querySelector('.panel:last-of-type');
    updateProgress(targetPanel.getAttribute('data-section-progress'),targetPanel.getAttribute('data-section'));
};

var resetAddress = function(btn){
    console.log(getClosest(btn,'ol.address-wrap'));
    var parentEl = getClosest(btn,'ol.address-wrap');
    parentEl.setAttribute('data-addresses-found',false);
    parentEl.setAttribute('data-address-selected',false);
    var addressControls = parentEl.querySelectorAll('.address-control input');
    addressControls.forEach(function(el){
        el.value = '';
    });
    var addressReplay = parentEl.querySelector('.addressReplay');
    addressReplay.innerHTML = '';
};

var btns = b.querySelectorAll('button');
btns.forEach(function (el) {
    el.addEventListener('click', function (evt) {
        
        evt.preventDefault();
        var btnAction = function(){
            var parentPanel = getClosest(el, '.panel');
            if (el.classList.contains('section')) {
                if (el.classList.contains('prev')) {
                    previousSection(parentPanel,el);
                } else {
                    nextSection(parentPanel, el);
                }
            } else {
                if (el.classList.contains('prev')) {
                    previousPanel(parentPanel);
                } else {
                    nextPanel(parentPanel, el);
                }
            }
        };
        if( el.id == 'goToSecurity' ){
            b.setAttribute('data-show-tracking',true);
            btnAction();
            setTimeout(function(){
                b.setAttribute('data-show-tracking',false);
                b.setAttribute('data-show-found',true);
                setTimeout(function(){
                    b.setAttribute('data-show-found',false);
                },3000);
            },2500);
        } 
        else if( el.id == 'createAccount' ){
            b.setAttribute('data-show-pin',true);
        } 
        else if( el.id == 'taskComplete' ){
            b.setAttribute('data-show-complete',true);
        } 
        else if( el.id == 'explanationBtn' ){
            b.setAttribute('data-show-explanation',false);
            btnAction();
        } 
        else if( el.id == "googleSignIn"){
            if( confirm('"Phoenix" wants to use Google to sign in.') ){
                btnAction();
                b.setAttribute('data-show-explanation',true);
            } else {
                console.log('No to Google');
            }
        } 
        else if( el.classList.contains("resetAddress") ){
            console.log('Reset address');
            resetAddress(el);
        } 
        else {
            btnAction();    
        }
        
        

    });
});

var ajax = function(method, url, callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var response = JSON.parse(request.responseText);
            callback(response);
        }
    }
    request.send();
};

var logResponse = function (obj) {
    console.log(obj);
};

var populateAddress = function (obj) {
    //console.log(obj);
    var currentPanel = b.querySelector('section.active div.panel.active');
    console.log(currentPanel);
    var addressList = currentPanel.querySelector('.addressReplay');
    var addressWrap = currentPanel.querySelector('.address-wrap');
    addressList.innerHTML = '';
    obj.items.forEach(function (el) {
        var li = document.createElement('li');
        var addressString;
        if( el.subBuildingName ){
            addressString = el.subBuildingName + ', ' + el.buildingNumber + ' ' + el.thoroughfare + ', ' + el.postTown;
        } else {
            addressString = el.buildingNumber + ' ' + el.thoroughfare + ', ' + el.postTown;    
        }
        
        li.textContent = addressString;
        addressList.appendChild(li);
        li.addEventListener('click',function(){
            li.classList.add('selected');
            document.getElementById('addressReplay').textContent = li.textContent;
            setTimeout(function(){
                addressWrap.setAttribute('data-address-selected',true);
            },400);
        });
    });
    addressWrap.setAttribute('data-addresses-found',true);
};


var testVals = {
    "items": [{
        "addressSourceId": 3,
        "countryCode": "GB",
        "postcode": "CH62 0BE",
        "county": "Merseyside",
        "postTown": "Wirral",
        "thoroughfare": "Lock Road",
        "buildingNumber": "7"
    }, {
        "addressSourceId": 3,
        "countryCode": "GB",
        "postcode": "CH62 0BE",
        "county": "Merseyside",
        "postTown": "Wirral",
        "thoroughfare": "Lock Road",
        "buildingNumber": "8"
    }, {
        "addressSourceId": 3,
        "countryCode": "GB",
        "postcode": "CH62 0BE",
        "county": "Merseyside",
        "postTown": "Wirral",
        "thoroughfare": "Lock Road",
        "buildingNumber": "9"
    }, {
        "addressSourceId": 3,
        "countryCode": "GB",
        "postcode": "CH62 0BE",
        "county": "Merseyside",
        "postTown": "Wirral",
        "thoroughfare": "Lock Road",
        "buildingNumber": "10"
    }, {
        "addressSourceId": 3,
        "countryCode": "GB",
        "postcode": "CH62 0BE",
        "county": "Merseyside",
        "postTown": "Wirral",
        "thoroughfare": "Lock Road",
        "buildingNumber": "11"
    }, {
        "addressSourceId": 3,
        "countryCode": "GB",
        "postcode": "CH62 0BE",
        "county": "Merseyside",
        "postTown": "Wirral",
        "thoroughfare": "Lock Road",
        "buildingNumber": "12"
    }]
};

var getAddressFromPostcode = function (postcode) {
    var proxyRef = 'https://jamesnash-trial-prod.apigee.net/msmcreditcards/gb/reference-data/v0/addresses?postcode=' + postcode;
    
    ajax('GET',proxyRef,populateAddress);
    //populateAddress(testVals);
};

//var postCodes = b.querySelectorAll('input[data-id="postcode"]');
//postCodes.forEach(function(el){
    document.getElementById('postcode1').addEventListener('keyup', function () {
        //getAddressFromPostcode(document.getElementById('postcode').value);
        var characterLength = this.value.length;
        //console.log(characterLength);
        if (characterLength > 5) {
            //console.log('Minimum character length reached.');
            //console.log('Check if third character from the end is an integer');
            var refCharacter = this.value[characterLength - 2];
            if (!isNaN(parseInt(refCharacter, 10))) {
                console.log('IS A NUMBER - incomplete postcode');
            } else {
                console.log('NOT A NUMBER - run postcode lookup');
                getAddressFromPostcode(this.value);
            }

        }
    });
    document.getElementById('additionalPostcode').addEventListener('keyup', function () {
        //getAddressFromPostcode(document.getElementById('postcode').value);
        var characterLength = this.value.length;
        //console.log(characterLength);
        if (characterLength > 5) {
            //console.log('Minimum character length reached.');
            //console.log('Check if third character from the end is an integer');
            var refCharacter = this.value[characterLength - 2];
            if (!isNaN(parseInt(refCharacter, 10))) {
                console.log('IS A NUMBER - incomplete postcode');
            } else {
                console.log('NOT A NUMBER - run postcode lookup');
                getAddressFromPostcode(this.value);
            }

        }
    });



document.getElementById('userName').addEventListener('change', function () {
    b.querySelectorAll('.userName').forEach(function (el) {
        el.textContent = document.getElementById('userName').value;
    });

});

b.querySelectorAll('.placeholder input').forEach(function(el){
    //console.log(el);
    el.addEventListener('focus',function(){
        el.previousElementSibling.classList.add('focus');
    });
    el.addEventListener('blur',function(){
        if( el.value == '' ){
            el.previousElementSibling.classList.remove('focus');    
        }

    });
});

var userData = {};

var updateUser = function(ref,val){
    console.log('Updating ' + ref + ': ' + val);
    userData[ref] = val;
    //console.log(userData);
    var replayEl = document.getElementById(ref+'Replay');
    if( replayEl ){
        replayEl.textContent = val;    
    }
    
};

b.querySelectorAll('input').forEach(function(el){
    if( el.type == 'text' | el.type == 'email' | el.type == "tel" | el.type == 'password' ){
        el.addEventListener('focus',function(){
            scrollTo(el.offsetTop,null,300);
            console.log(el.offsetTop);
        });
        el.addEventListener('keyup',function(){
            if( el.hasAttribute('data-min') ){
                if( el.value.length >= el.getAttribute('data-min') ){
                    //console.log('SERVICE: input complete');
                    el.setAttribute('data-valid',true);
                    //console.log(getClosest(el,'div'));
                }    
            } else {
                //console.log('SERVICE: input complete');
                el.setAttribute('data-valid',true);
                //console.log(getClosest(el,'div'));
            }
            checkValidity(getClosest(el,'div.panel'));
            updateUser(el.id,el.value);
        });
    } else if( el.type == 'checkbox' ){
        //console.log('It is a checkbox');
        el.addEventListener('click',function(evt){
            var parentWrap = getClosest(el,'ol');
            parentWrap.setAttribute('data-valid',true);
            updateUser(el.name,el.value);
            checkValidity(getClosest(el,'div.panel'));
        });
    } else if( el.type == 'radio' ){
        //console.log('It is a radio');
        el.addEventListener('click',function(evt){
            var parentWrap = getClosest(el,'ol');
            parentWrap.setAttribute('data-valid',true);
            updateUser(el.name,el.value);
            console.log(getClosest(el,'div.panel'));
            checkValidity(getClosest(el,'div.panel'));
            if( el.name == 'residential' ){
                var lbtn = document.getElementById('livingBtn');
                if( el.id == 'living1' ){
                    lbtn.setAttribute('data-target',20);
                    b.setAttribute('data-owner',true);
                } else {
                    lbtn.setAttribute('data-target',9);
                    b.setAttribute('data-owner',false);
                }
            }
        });
        
    }
});

b.querySelectorAll('select').forEach(function(el){
    el.addEventListener('change',function(){
        updateUser(el.id,el.options[el.selectedIndex].value);    
    });
    
});

var getIOSWindowHeight = function() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    return window.innerHeight * zoomLevel;
};

// You can also get height of the toolbars that are currently displayed
var getHeightOfIOSToolbars = function() {
    var tH = (window.orientation === 0 ? screen.height : screen.width) -  getIOSWindowHeight();
    return tH > 1 ? tH : 0;
};
var windowHeight = parseInt(getIOSWindowHeight());

b.querySelectorAll('section').forEach(function(el){
    if( el.getAttribute('data-section') == '0' ){
        var calcHeight = windowHeight;
    } else {
        var calcHeight = windowHeight - 60;    
    }
    
    el.style.height = calcHeight + 'px';
});

b.querySelectorAll('.panel').forEach(function(el){
    var progressHeight = 60;
    var elParent = el.parentElement;
    var parentHeight = parseInt(elParent.clientHeight);
    console.log('----------');
    console.log(el);
    console.log('Parent height is: ' + parentHeight);
    console.log(parentHeight);
    var elHeader = elParent.querySelector('header');
    var calcHeight;
    if( elHeader ){
        console.log('has header');
        var headerHeight = parseInt(elHeader.clientHeight);
        console.log('Header height is: ' + headerHeight);
        console.log(headerHeight);
        calcHeight = parentHeight - headerHeight;
        console.log('Calculated height is: ' + calcHeight);
        var topVal = headerHeight + progressHeight;
        console.log('Position top value: ' + topVal);
        el.style.top = headerHeight + 'px';
    } else {
        //console.log('doesnt have header');
        calcHeight = parentHeight;
        el.style.top = '0';
    }
    console.log('Setting height to:' + calcHeight);
    el.style.height = calcHeight + 'px';
    //console.log(el.style.height);
});





b.querySelectorAll('dd').forEach(function(el){
    el.addEventListener('click',function(){
        fromReplay = true;
        var targetPanelRef = el.getAttribute('data-panel');
        goToPanel(targetPanelRef);
    });
});

var pinStatus = 0;
var pinReplayWrap = document.getElementById('pinReplay');

b.querySelectorAll('#pin ol li').forEach(function(el){
    el.addEventListener('click',function(){
        if( el.id == 'delete' ){
            console.log('Deleting pin');
            if( pinStatus > 0 ){
                var liRef = pinStatus;
                var li = b.querySelector('#pinReplay li:nth-of-type('+ liRef +')');
                li.textContent = '';
                pinStatus = pinStatus - 1;
            } else {
                console.log('Pin empty');
            }
        } else {
            el.classList.add('active');
            setTimeout(function(){
                el.classList.remove('active');
            },100);
            if( pinStatus < 4 ){
                var liRef = pinStatus + 1;
                var li = b.querySelector('#pinReplay li:nth-of-type('+ liRef +')');
                li.textContent = el.textContent;
                pinStatus ++;
            } 
            if( pinStatus == 4){
                console.log('Pin complete');
                setTimeout(function(){
                    console.log('Go to next step');
                    b.setAttribute('data-show-pin',false);
                    b.setAttribute('data-show-thumb',true);
                },1000);
            }    
        }
        
    });
});

var thumbBtns = function(el){
    console.log(el);
    var targetPanel;
    var delay;
    var goToExp = false;
    if( el.id == 'no' ){
        //targetPanel = 2;
        //delay = 100;
        targetPanel = 3;
        delay = 1500;
        document.getElementById('thumb').classList.add('active');
        goToExp = true;
    } else if( el.id == 'allow' ) {
        targetPanel = 3;
        delay = 1500;
        document.getElementById('thumb').classList.add('active');
        goToExp = true;
    }
    pinStatus = 0;
    b.querySelectorAll('#pinReplay li').forEach(function(li){
        li.textContent = '';
    });
    el.classList.add('active');
    goToPanel(targetPanel);
    setTimeout(function(){
        b.setAttribute('data-show-thumb',false);
        el.classList.remove('active');
        if( goToExp ){
           b.setAttribute('data-show-explanation',true);
        }
    },delay);
};

var noBtn = document.getElementById('no');
noBtn.addEventListener('click',function(evt){
    thumbBtns(this);
});

var yesBtn = document.getElementById('allow');
yesBtn.addEventListener('click',function(evt){
    thumbBtns(this);
});


setTimeout(function () {
    document.body.classList.remove('loading');
}, 2000);


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

if( getUrlParameter('ref') ){
   goToPanel(getUrlParameter('ref'));
}