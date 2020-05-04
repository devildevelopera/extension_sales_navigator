chrome.runtime.onMessage.addListener(function(msg, sender ){
    if(msg == "toggle"){
        toggle();
    }
    if(msg == "close"){
        close();
    }
    if(msg == "get_data"){
        get_data();
    }
    if(msg == "next_page"){
        next_page();
    }
})

var iframe = document.createElement('iframe'); 
iframe.style.background = "white";
iframe.style.border = "1px solid #E6E9ED";
iframe.style.height = "0";
iframe.style.width = "0";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.frameBorder = "none"; 
iframe.src = chrome.extension.getURL("popup.html")

document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="100%";
        iframe.style.height="100%";
    }
    else {
        iframe.style.width="0";
        iframe.style.height="0";
    }
}

function close() {
    iframe.style.width="0";
    iframe.style.height="0";
}

function indexesOf(str, word) {
    const split = str.split(word)
    let pointer = 0
    let indexes = []
 
    for(let part of split) {
       pointer += part.length
       indexes.push(pointer)
       pointer += word.length
    }
 
    indexes.pop()
 
    return indexes
 }

function get_data () {
    var realPeople = [];
    fetch(document.location.href)
    .then(response => response.text())
    .then(pageSource => {
            var indexArray = indexesOf(pageSource, "],&quot;entityUrn&quot;:&quot;urn:li:fs_salesProfile:(");
            var count = 0;
            for(var i=0; i<indexArray.length; i++){
                var m = pageSource.indexOf(")&quot;", indexArray[i]+54);
                var id = pageSource.substring(indexArray[i]+54, m);
                var contact_url = "https://www.linkedin.com/sales/people/"+id;
                // var contact_url = "https://www.linkedin.com/sales/people/ACwAAAXK9W4Brtx0fUy1TfY5ai2BCOYpPQt36Xo,NAME_SEARCH,TR8V?_ntb=91HUT6hxS%2BeKti0IEh8vdg%3D%3D";
                $.ajax({
                    type: "GET",
                    url: contact_url,
                    success: function(res){
                        // console.log(res);
                        count++;
                        var name = "";
                        var position = "";
                        var company = "";
                        var location = "";
                        var email = "";
                        var phone = "";
                        var url = "";
                        var social ="";
                        var n = res.indexOf("fullName&quot;:&quot;");
                        if(n != -1){
                            var k = res.indexOf("fullName&quot;:&quot;", n+21);
                            if(k != -1) {
                                var m = res.indexOf("&quot", k+21);
                                name = res.substring(k+21, m);
                            }
                        }
                        var n = res.indexOf("headline&quot;:&quot;");
                        if(n != -1){
                            var k = res.indexOf("headline&quot;:&quot;", n+21);
                            if(k != -1) {
                                var m = res.indexOf("&quot", k+21);
                                position = res.substring(k+21, m);
                            }
                        }
                        var n = res.indexOf("companyName&quot;:&quot;");
                        if(n != -1){
                            var m = res.indexOf("&quot", n+24);
                            company = res.substring(n+24, m);
                        }
                        var n = res.indexOf("location&quot;:&quot;");
                        if(n != -1){
                            var m = res.indexOf("&quot", n+21);
                            location = res.substring(n+21, m);
                        }
                        var n = res.indexOf("emailAddress&quot;:&quot;");
                        if(n != -1){
                            var m = res.indexOf("&quot", n+25);
                            email = res.substring(n+25, m);
                        }
                        var n = res.indexOf("number&quot;:&quot;");
                        if(n != -1){
                            var m = res.indexOf("&quot", n+19);
                            phone = res.substring(n+19, m);
                        }
                        var n = res.indexOf("url&quot;:&quot;");
                        if(n != -1){
                            var m = res.indexOf("&quot", n+16);
                            url = res.substring(n+16, m);
                        }
                        var n = res.indexOf("&quot;name&quot;:&quot;");
                        if(n != -1){
                            var m = res.indexOf("&quot;", n+23);
                            social = res.substring(n+23, m);
                            var o = res.indexOf("&quot;", m+30);
                            social += "("+res.substring(m+30, o)+")";
                        }
                        realPeople.push({
                            name,
                            position,
                            company,
                            location,
                            contact_url,
                            phone,
                            email,
                            url,
                            social
                        });
                        if(count === indexArray.length) {
                            count = 0;
                            chrome.runtime.sendMessage({ type: "set_data", data: realPeople});
                        }
                    },
                    error: function(){
                        count++;
                        //
                    }
                });
            }
        });
}

function next_page() {
    var nextButtonGroup = document.getElementsByClassName("search-results__pagination-next-button");
    nextButtonGroup[0].click();
    chrome.runtime.sendMessage({ type: "next_page_ready"});
}