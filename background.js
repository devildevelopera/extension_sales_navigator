chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,"toggle");
    });
});

chrome.runtime.onMessage.addListener(function(message) {
    if(message.type === "close") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,"close");
        });
    }
    if(message.type === "get_data") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,"get_data");
        });
    }
    if(message.type === "next_page") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,"next_page");
        });
    }
    if(message.type === "set_data") {
        chrome.runtime.sendMessage({type: "set_data_popup", data: message.data});
    }
    if(message.type === "next_page_ready") {
        chrome.runtime.sendMessage({type: "next_page_ready_popup"});
    }
})