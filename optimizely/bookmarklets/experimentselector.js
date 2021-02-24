function initialise() {

  addDialog();
  
  var optimizely = window["optimizely"] && typeof window["optimizely"].get === "function";
  var experiments = optimizely ? window["optimizely"].get("data").experiments : null;
  var experimentSelector = document.getElementById("experimentId");
  var variationSelector = document.getElementById("variationId");
  var includeDrafts = document.getElementById("include-drafts");
  var viewVariationButton = document.getElementById("view-variation");
  var closeButton = document.getElementById("close-button");

  addEventListeners();
  checkForOptimizely();

  function addDialog() {
    
    var modalDialog = document.createElement("div");
    modalDialog.id = "modal-experiment-dialog";
    modalDialog.className = "modal-experiment-dialog";
    document.body.appendChild(modalDialog);

    document.getElementById("modal-experiment-dialog").innerHTML = '          \
      <div id="modal-experiment-dialog-content">                              \
        <div id="close-button">&times;</div>                                  \
        <div id="modal-experiment-dialog-form-wrapper">                       \
          <form>                                                              \
            <label for="experimentId">Experiment</label>                      \
            <select id="experimentId"></select>                               \
            <div id="variation-selection">                                    \
              <label for="variationId">Variation</label>                      \
              <select id="variationId"></select>                              \
            </div>                                                            \
            <div id="include-drafts-container">                               \
              <input id="include-drafts" type="checkbox">                     \
              <label for="include-drafts">Include drafts</label>              \
            </div>                                                            \
            <button id="view-variation" type="button">View variation</button> \
          </form>                                                             \
        </div>                                                                \
      </div>                                                                  \
    ';

    addStyleString(styles);
  }

  function checkForOptimizely() {
    if (!optimizely) {
      document.getElementById("modal-experiment-dialog-form-wrapper").innerHTML = "<p>Optimizely X not found</p>";
    } else {
      checkDraftExperimentsCookie();
      populateExperimentList();
      setIncludeDraftsToggle();
    }
  }
  
  function checkDraftExperimentsCookie() {
    if (window["optimizely"].get("data").groups && getCookie("show-optly-draft-experiments")) {
      toggleDraftExperiments(true);
    }
  }
  
  function populateExperimentList() {
    if (experiments) {
      for (var experiment in experiments) {
        var option = document.createElement('option');
        option.value = experiment;
        option.text = experiments[experiment].name.length > 100 ? experiments[experiment].name.substring(0,50) + "..." : experiments[experiment].name;
        experimentSelector.add(option);
      }
      setCurrentExperiment();
      populateVariationList(experimentSelector.options[experimentSelector.selectedIndex].value);
    } else {
      document.getElementById("modal-experiment-dialog-form-wrapper").innerHTML = "<p>No experiments found</p>";
    }
  }
	
  function setCurrentExperiment() {
    var variationId = getQueryStringValue("optimizely_x");
    if (variationId) {
      var experimentId;
      for (var experiment in experiments) {
        var variations = experiments[experiment].variations;
        for (var i = 0; i < variations.length; i++) { 
          if (variations[i].id === variationId) { 
            experimentId = experiment;
            break;
          } 
        }
      } 
      setSelectedIndex(experimentSelector,experimentId);
    }
  }
  
  function populateVariationList(variationId) {
    variationSelector.options.length = 0;
    var variations = experiments[variationId].variations;
    for (var variation in variations) {
      var option = document.createElement('option');
      option.value = variations[variation].id;
      option.text = variations[variation].name.length > 100 ? variations[variation].name.substring(0,50) + "..." : variations[variation].name;
      variationSelector.add(option);
    }
    document.getElementById("variation-selection").style.display = "block";
    setSelectedIndex(variationSelector,getQueryStringValue("optimizely_x"));
  }

  function addEventListeners() {
    experimentSelector.addEventListener("change", function() {
      populateVariationList(experimentSelector.options[experimentSelector.selectedIndex].value);
    });

    includeDrafts.addEventListener("click", function() {
      toggleDraftExperiments(includeDrafts.checked);
    });

    viewVariationButton.addEventListener("click", function() {
      showVariation(variationSelector.options[variationSelector.selectedIndex].value);
    });

    closeButton.addEventListener("click", function() {
      document.getElementById('modal-experiment-dialog').style.display = "none";
    });

    window.onclick = function(event) {
      if (event.target == document.getElementById('modal-experiment-dialog')) {
        document.getElementById('modal-experiment-dialog').style.display = "none";
      }
    }
  }

  function getQueryStringValue(key) {  
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
  } 
  
  function setIncludeDraftsToggle() { 
    includeDrafts.checked = getQueryStringValue("optimizely_token") || !window["optimizely"].get("data").groups;
  }

}

function showVariationSelector() {
  document.getElementById('modal-experiment-dialog').style.display = "block";
}

function showVariation(variationId) {
  var redirectUrl = window.location.href;
  
  if (redirectUrl.indexOf("?") === -1) {
    redirectUrl = redirectUrl + "?" + "optimizely_x=" + variationId;
  } else if (redirectUrl.indexOf("optimizely_x=") === -1) {
    redirectUrl = redirectUrl.replace(/([^?]+\?)/gi, "$1optimizely_x=" + variationId + "&");
  } else {	
    redirectUrl = redirectUrl.replace(/optimizely_x=\d+/gi, "optimizely_x=" + variationId);
  }	

  window.location.replace(redirectUrl);
}

function toggleDraftExperiments(includeDrafts) {
  var redirectUrl = window.location.href;

  document.getElementById("modal-experiment-dialog-form-wrapper").innerHTML = "<p>Please wait, reloading...</p>";
  
  if (includeDrafts) {  
    setCookie("show-optly-draft-experiments", true, 10)
    if (redirectUrl.indexOf("?") === -1) {
      redirectUrl = redirectUrl + "?" + "optimizely_token=public";
    } else if (redirectUrl.indexOf("optimizely_token=") === -1) {
      redirectUrl = redirectUrl.replace(/([^?]+\?)/i, "$1optimizely_token=public&");
    } 	  
  } else {
    deleteCookie("show-optly-draft-experiments")
    redirectUrl = redirectUrl.replace(/optimizely_token=public&?/i, "").replace(/\?$/,"");
  }

  window.location.replace(redirectUrl);
}

function setSelectedIndex(s, valsearch) {
  for (i = 0; i < s.options.length; i++) { 
    if (s.options[i].value == valsearch) {
      s.options[i].selected = true;
      break;
    }
  }
  return;
}

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) { setCookie(name, '', -1); }

var styles = " \
  #modal-experiment-dialog { \
    position: fixed; \
    z-index: 10000000000; \
    padding-top: 100px; \
    margin: 0; \
    left: 0; \
    top: 0; \
    width: 100%; \
    height: 100%; \
    overflow: auto; \
    background-color: rgba(0,0,0,0.6); \
  } \
  #modal-experiment-dialog #modal-experiment-dialog-content { \
    background-color: #EEE; \
    margin: auto; \
    padding: 20px; \
    border: 1px solid #888; \
    border-radius: 10px; \
    width: 80%; \
    font-family: Open Sans,Arial,sans-serif; \
    font-weight: 700; \
    font-size: 15px; \
    line-height: 1.42857; \
    color: #4e585c; \
  } \
  #modal-experiment-dialog select { \
    width: 100% !important; \
    font-size: 13px !important; \
    padding: 9px !important; \
    margin-bottom: 20px !important; \
    font-family: Open Sans,Arial,sans-serif !important; \
    font-weight: normal; \
  } \
  #modal-experiment-dialog label { \
    display: inline-block; \
    font-family: Open Sans,Arial,sans-serif; \
    font-weight: 700; \
    font-size: 15px; \
    line-height: 1.42857; \
    color: #4e585c; \
    margin-bottom: 5px; \
  } \
  #modal-experiment-dialog button { \
    margin: 10px 0 !important; \
    background-color: #00aeef !important; \
    color: #FFF !important; \
    border: none !important; \
    padding: 8px 28px !important; \
    border-radius: 25px !important; \
    font-weight: bold !important; \
    margin: 10px auto 10px !important; \
    display: block !important; \
    font-family: Open Sans,Arial,sans-serif !important; \
    font-size: 15px !important; \
  } \
  #modal-experiment-dialog #close-button { \
    color: #aaaaaa; \
    font-size: 28px; \
    font-weight: bold; \
    width: 100%; \
    text-align: right; \
    margin-bottom: 10px; \
    line-height: 20px; \
  } \
  #modal-experiment-dialog #close-button:hover, \
  #modal-experiment-dialog #close-button:focus { \
    color: #000; \
    text-decoration: none; \
    cursor: pointer; \
  } \
  #modal-experiment-dialog #variation-selection { \
    display: none; \
  } \
  #modal-experiment-dialog #include-drafts-container { \
    padding: 8px 0 10px 0; \
  } \
  #modal-experiment-dialog [type=\"checkbox\"]:not(:checked), #modal-experiment-dialog [type=\"checkbox\"]:checked { \
    position: absolute !important; \
    left: -9999px !important; \
  } \
  #modal-experiment-dialog [type=\"checkbox\"]:not(:checked) + label, #modal-experiment-dialog [type=\"checkbox\"]:checked + label { \
    position: relative !important; \
    padding-left: 3.9em !important; \
    padding-top: .25em !important; \
    cursor: pointer !important; \
  } \
  #modal-experiment-dialog [type=\"checkbox\"]:not(:checked) + label:before, #modal-experiment-dialog [type=\"checkbox\"]:checked + label:before, #modal-experiment-dialog [type=\"checkbox\"]:not(:checked) +  label:after, #modal-experiment-dialog [type=\"checkbox\"]:checked + label:after { \
    content: ''; \
    position: absolute !important; \
    height: 1.5em !important; \
    transition: all .5s ease !important; \
  } \
  #modal-experiment-dialog [type=\"checkbox\"]:not(:checked) + label:before, #modal-experiment-dialog [type=\"checkbox\"]:checked + label:before { \
    left: 0 !important; \
    top: 0 !important; \
    width: 3em !important; \
    border: 2px solid #dddddd !important; \
    background: #dddddd !important; \
    border-radius: 1.1em !important; \
    box-sizing: initial !important; \
  } \
  #modal-experiment-dialog [type=\"checkbox\"]:not(:checked) + label:after, #modal-experiment-dialog [type=\"checkbox\"]:checked + label:after { \
    left: 0.13em !important; \
    top: 0.16em !important; \
    background-color: #fff !important; \
    border-radius: 50% !important; \
    width: 1.5em !important; \
  } \
  #modal-experiment-dialog [type=\"checkbox\"]:checked + label:after { left: 1.6em !important; } \
  #modal-experiment-dialog [type=\"checkbox\"]:checked + label:before { \
    background-color: #72da67 !important; \
    border-color: #72da67 !important;\
  } \
";

initialise();
