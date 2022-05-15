// chrome.action.onClicked.addListener((tab :chrome.tabs.Tab)=>{
//     console.log("tabs opening from: \n" + JSON.stringify(tab, null, 2));
//     chrome.tabs.create({
//         url: chrome.runtime.getURL('extensionPage/extensionPage.html'),
//         pinned: true
//     }, ()=>{});
// });

const tabHook=(tabId:number, changeInfo:any, tabInfo:any)=>{
    if (tabInfo.url.includes('twitter.com/')){
        chrome.tabs.update(tabId, {url:tabInfo.url.replace(/http.?:\/\/.*.twitter.com\//,'https://nitter.net/')},).then(inp=>{
            console.log(inp);
        });
        console.log('a twitter tab', {tabId: tabId, changeInfo: changeInfo, tabInfo: tabInfo});
    }else{
        console.info('tabInfo', {tabId: tabId, changeInfo: changeInfo, tabInfo: tabInfo});
    };
};

if (chrome.tabs.onUpdated.hasListener(tabHook)){}else{
    chrome.tabs.onUpdated.addListener(tabHook);
};

