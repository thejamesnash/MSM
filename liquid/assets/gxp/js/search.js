var feedXml;
document.getElementById("searchBox").value = "";

function splitWords(str) {
//    console.log(str)
    var items = [];
    str.split(/[ -]+/).forEach(function(o){
        if (o.length > 0) {
            items.push(o.toLowerCase());
        }
    });
    return items;
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

document.getElementById("searchBox").addEventListener("blur", function(){
//    document.getElementById("searchBox").value = "";
});

document.getElementById("searchBox").addEventListener("keyup", function(){
    var resultsWrap = document.getElementById("searchResults"),
        relatedWrap = document.getElementById("relatedResults"),
        val = this.value.toLowerCase(),
        opts = splitWords(val),
        components = feedXml.querySelectorAll('components > component'),
        results = {"title": [], "tag": []};

    if (val.length > 2) {
        components.forEach(function(c){
            var searchTitle = splitWords(c.querySelector('title').textContent),
                searchTag = [],
                tags = c.querySelectorAll('tag');

            tags.forEach(function(tag){
                searchTag.push(tag.textContent);
            })

            searchTitle = arrayUnique(searchTitle);
            searchTag = arrayUnique(searchTag);

            var getResults = function(array, key){
                for (var i = 0; i < array.length; i++) {
                    var findTitle = function(match) {
                       return match == array[i];
                    }
                    if (opts.some(findTitle)) {
                        results[key].push(c);
                        break;
                    }
                    if (array[i].search(val) >= 0) {
                        results[key].push(c);
                        break;
                    }
                }
            }

            getResults(searchTitle, "title");
            getResults(searchTag, "tag");
        })

//        console.log(results);

        resultsWrap.innerHTML = "";
        relatedWrap.innerHTML = "";

        var removeDups = function(arr1, arr2){
            for (var i = 0; i<arr1.length; i++) {
                var arrlen = arr2.length;
                for (var j = 0; j<arrlen; j++) {
                    if (arr1[i] == arr2[j]) {
                        arr2 = arr2.slice(0, j).concat(arr2.slice(j+1, arrlen));
                    }
                }
            }
            return [arr1, arr2];
        }
        var resultsArr = removeDups(results.title, results.tag);
//        console.log(resultsArr)

        for (var i = 0; i < resultsArr.length; i++) {
            if (resultsArr[i].length > 0) {
                resultsArr[i].forEach(function(r){
                    var item = document.createElement('li'),
                        link = document.createElement('a'),
                        sub = document.createElement('sub'),
                        str = r.querySelector('title').textContent;
                    link.href = r.querySelector('link').textContent;

                    if (i == 0) {
                        var int = str.search(val);
                        int == -1 ? int = 0 : int = int;

                        var strSplit = str.split(' ');
                        var valSplit = val.split(' ');

                        var highlightVal = "";
                        var matched = [];

                        strSplit.forEach(function(a) {
                            if (valSplit.indexOf(a.toLowerCase()) >= 0) {
                                matched.push(a);
                                highlightVal += "<span class='hg'> " + a + "</span>";
                            }
                            else {
                                highlightVal += ' ' + a + ' ';
                            }
                        })

                        matched = arrayUnique(matched);

                        if (matched.length == 0) {
                            highlightVal = str.substring(0, int) + "<span class='hg'>" + val + "</span>" + str.substring((int + val.length), str.length);
                        }

                        link.innerHTML = highlightVal;

                        resultsWrap.appendChild(item);
                    }
                    else {
                        item.className = "rel";
                        link.innerHTML = str;

                        relatedWrap.appendChild(item);
                    }

                    sub.textContent = r.querySelector('usage').textContent;
                    link.appendChild(sub);
                    item.appendChild(link);

                })
            }
            else if (i == 0) {
                resultsWrap.innerHTML += "<li>No results found</li>";
            }
        }

    }
    else {
        resultsWrap.innerHTML = "";
        relatedWrap.innerHTML = "";
    }

});

// Define AJAX
var ajax = function(method,url,callback,data){
    var request = new XMLHttpRequest();
    request.open(method,url,true);
    request.onreadystatechange = function () {
        if ( this.readyState == 4 && this.status == 200) {
            if( callback ){
                //var response = JSON.parse(this.responseText);
                callback(this.responseXML);
            } else {
                console.log(this.responseText);
            }
        }
    };

    if(data){
        request.send(data);
    } else {
        request.send();
    }
};
var logResponse = function(obj){
    feedXml = obj;
    console.log(obj);
};
var feedUrl = '/feed.xml';
ajax('GET',feedUrl,logResponse,null);
