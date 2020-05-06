var currentTab = undefined;
chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        currentTab = tabs[0].id;
        chrome.tabs.sendMessage(currentTab,"toggle");
    });
});

chrome.runtime.onMessage.addListener(function(message) {
    if(message.type === "close") {
            chrome.tabs.sendMessage(currentTab,"close");
    }
    if(message.type === "get_data") {
            chrome.tabs.sendMessage(currentTab,"get_data");
    }
    if(message.type === "next_page") {
            chrome.tabs.sendMessage(currentTab,"next_page");
    }
    if(message.type === "set_data") {
        chrome.runtime.sendMessage({type: "set_data_popup", data: message.data});
    }
    if(message.type === "next_page_ready") {
        chrome.runtime.sendMessage({type: "next_page_ready_popup"});
    }
})