import {
    readConfig,
    writeConfig,
} from './configs'
// chrome.action.onClicked.addListener((tab :chrome.tabs.Tab)=>{
//     console.log("tabs opening from: \n" + JSON.stringify(tab, null, 2));
//     chrome.tabs.create({
//         url: chrome.runtime.getURL('extensionPage/extensionPage.html'),
//         pinned: true
//     }, ()=>{});
// });
//
var nitterUrl = '';

readConfig((rcvd:any)=>{
    nitterUrl = rcvd.nitterInstances[0];
});

const tabHook=(tabId:number, changeInfo:any, tabInfo:any)=>{
    if (tabInfo.url.includes('twitter.com/')){
        let newUrl = tabInfo.url.replace(/http.?:\/\/.*\.?twitter.com\/?/,`https://${nitterUrl}/`);
        newUrl = newUrl.replace(/\?.*$/, '');
        console.assert(tabInfo.url != newUrl);

        chrome.tabs.update(tabId, {url: newUrl},).then(inp=>{
            console.log(inp);
        });

        console.log('a twitter tab', {tabId: tabId, changeInfo: changeInfo, tabInfo: tabInfo}, '\nopening:', newUrl);
    }else{
        console.info('tabInfo', {tabId: tabId, changeInfo: changeInfo, tabInfo: tabInfo});
    };
};

if (chrome.tabs.onUpdated.hasListener(tabHook)){
  chrome.tabs.onUpdated.removeListener(tabHook);
};
chrome.tabs.onUpdated.addListener(tabHook);

function reloadConfigs(){
    return true;
}


chrome.runtime.onMessage.addListener(function (msgMap, sender, sendResponse) {
    switch (msgMap.msg){
        /**
         * see https://bugs.chromium.org/p/chromium/issues/detail?id=1304272
         */
        case 'reloadConfigs':  sendResponse(); return reloadConfigs();
    }

    console.assert(typeof sendResponse === 'function')
    console.log({log:"sendResponce received", msg:msgMap, type: typeof sendResponse})

    switch (msgMap.msg){
        case 'writeConfig':  writeConfig(msgMap.config, sendResponse); return reloadConfigs();
        case 'readConfig':   readConfig(sendResponse); return true; // this should be implemented in in pages
        default:
            console.log('msg: ' + msgMap.msg + ', is undefined')
            console.assert(msgMap.msg == 'anyOfTheDefinedMessage');
    }
    // we do not want code to reach here
    return false;
});
