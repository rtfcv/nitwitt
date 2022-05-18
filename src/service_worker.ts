import {
    configObj,
    readConfig,
    writeConfig,
} from './configs'

// chrome.action.onClicked.addListener((tab :chrome.tabs.Tab)=>{
//     console.info("tabs opening from: \n" + JSON.stringify(tab, null, 2));
//     chrome.tabs.create({
//         url: chrome.runtime.getURL('extensionPage/extensionPage.html'),
//         pinned: true
//     }, ()=>{});
// });
//
var nitterUrl = ()=>{return 'nitter.net';};


const tabHook=(tabId:number, changeInfo:any, tabInfo:any)=>{
    if (tabInfo.url.includes('twitter.com/')){
        readConfig((config:configObj)=>{
            if(!config.blockTwitter){return;};
        });

        let newUrl = tabInfo.url.replace(/http.?:\/\/.*\.?twitter.com\/?/,`https://${nitterUrl()}/`);
        newUrl = newUrl.replace(/\?.*$/, '');
        console.assert(tabInfo.url !== newUrl);

        chrome.tabs.update(tabId, {url: newUrl},).then(inp=>{
            console.debug('updated tab', inp);
        });
        console.info('a twitter tab', {tabId: tabId, changeInfo: changeInfo, tabInfo: tabInfo}, '\nopening:', newUrl);
    }else{
        console.debug('tabInfo', {tabId: tabId, changeInfo: changeInfo, tabInfo: tabInfo});
    };
};


function reloadConfigs(){readConfig((rcvd:any)=>{
    // nitterUrl = rcvd.nitterInstances[0];
    nitterUrl = ()=>{
      const nList = rcvd.nitterInstances as Array<string>;
      return nList[~~(Math.random()*nList.length)];
    };

    if (chrome.tabs.onUpdated.hasListener(tabHook)){
      chrome.tabs.onUpdated.removeListener(tabHook);
    };
    if(rcvd.blockTwitter){
        chrome.tabs.onUpdated.addListener(tabHook);
        chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["blockTwitter"],});
    }else{
        chrome.tabs.onUpdated.removeListener(tabHook);
        chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: ["blockTwitter"],});
    };

});return true;}
reloadConfigs();


chrome.runtime.onMessage.addListener(function (msgMap, sender, sendResponse) {
    switch (msgMap.msg){
        /**
         * see https://bugs.chromium.org/p/chromium/issues/detail?id=1304272
         */
        case 'reloadConfigs':  sendResponse(); return reloadConfigs();
    }

    console.assert(typeof sendResponse === 'function')
    console.debug({log:"sendResponce received", msg:msgMap, type: typeof sendResponse})

    switch (msgMap.msg){
        case 'writeConfig':  writeConfig(msgMap.config, sendResponse); return reloadConfigs();
        case 'readConfig':   readConfig(sendResponse); return true; // this should be implemented in in pages
        default:
            console.debug('msg: ' + msgMap.msg + ', is undefined')
            console.assert(msgMap.msg == 'anyOfTheDefinedMessage');
    }
    // we do not want code to reach here
    return false;
});
