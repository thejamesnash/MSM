---
layout: gxp/editor
title: Page editor
permalink: /gxp/editor
---
<section>
<fieldset>
<ol>
<li>
<label for="username"></label>
<input type="text" id="username" value="me@thejamesnash.com" />
</li>
<li>
<label for="password"></label>
<input type="password" id="password" value="JMNGitPa55!" />
</li>
<li>
<button id="login">Login</button>
</li>
</ol>
</fieldset>
</section>
<section>
<fieldset>
<ol>
<li>
<label for="code">Make your changes here</label>
<textarea id="code"></textarea>
</li>
<li>
<button id="submit">Submit</button>
</li>
</ol>
</fieldset>
</section>
<aside class="component-library">
<ul>
{% for component in site.components %}
<li data-tags="{{ component.tags }}">
<h2><a href="{{component.url}}">{{ component.title }}</a></h2>
</li>
{% endfor %}
</ul>
</aside>
<script>

var sha;
var creds;
var loginUserName = document.getElementById('login').value;
var loginPassword = document.getElementById('password').value;
var loginButton = document.getElementById('login');
var codeArea = document.getElementById('code');
var submitButton = document.getElementById('submit');
var encodeData = function(s){
    var e = window.btoa(s);
    return e;
};

var decodeData = function(s){
    var d = window.atob(s);
    return d;
};

// Define github request
var gitRequest = function(method,url,callback,data){
    var request = new XMLHttpRequest();
    request.open(method,url,true);
    request.setRequestHeader("Authorization", "Basic " + creds);
    request.onreadystatechange = function () {
        if ( this.readyState == 4 && this.status == 200) {
            if( callback ){
                var response = JSON.parse(this.responseText);
                callback(response);
            } else {
                console.log(this.responseText);
                gitRequest('GET',requestUrl,callback);
            }
        }
    };
    if(data){
        request.send(data);
    } else {
        request.send();
    }
};

var testConnection = function(obj){
    console.log('Connected to GitHub!');
    console.log(obj);
    var fileContent = decodeData(obj.content);
    sha = obj.sha;
    console.log(fileContent);
    codeArea.innerHTML = fileContent;
};
    
loginButton.addEventListener('click',function(evt){
    //creds = encodeData(loginUserName + ':' + loginPassword);
    creds = encodeData('me@thejamesnash.com:JMNGitPa55!');
    //gitRequest('GET','https://api.github.com/repos/msmux/gxp/Build/contents/_includes/components/msm',testConnection);
    
    // Get list of all repo contents
    //gitRequest('GET','https://api.github.com/repos/msmux/gxp/contents',testConnection);
    
    // Get pds.md
    gitRequest('GET','https://api.github.com/repos/msmux/gxp/contents/pds.md',testConnection); 
});

var returnMessage = function(obj){
    console.log(obj);
};

submitButton.addEventListener('click',function(evt){
    var changes = encodeData(codeArea.value);
    var changeObject = '{"message": "Auto commit","committer": {"name": "thejamesnash","email": "me@thejamesnash.com"},"content": "'+changes+'","sha": "'+sha+'"}';
    //console.log(changeObject);
    gitRequest('PUT','https://api.github.com/repos/msmux/gxp/contents/pds.md',returnMessage,changeObject);
})

</script>