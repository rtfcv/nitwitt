function sanitizeConfigMap(input:any) {
    if (typeof input === 'undefined'){
        input = {};
    }

    const tCheck = (targetVariable:any, defaultValue:any)=>{
        return (typeof targetVariable === typeof defaultValue) ? targetVariable : defaultValue;
    };

    var config = {
        nitterInstances:[]
    };

    /** theme: str
     * accepts: dark, light, business, luxury, black, ... and much more
     */
    config.nitterInstances = tCheck(input.nitterInstances, ['nitter.fly.dev']);
    return config;
}

function readConfig(callbackFunc: any) {
    chrome.storage.local.get('config', (result) => {
        // DO FORMAT CHECK HERE
        console.log('Reading Config', result);
        const cleanConfig = sanitizeConfigMap(result.config);
        console.log(cleanConfig);
        callbackFunc(sanitizeConfigMap(result.config));
    });
    return true;
}


function writeConfig(config: object, callbackFunc: any) {
    /**
     * WARNING:
     * this function overrides everything belonging to config
     * */
    // DO FORMAT CHECK HERE
    const cfgData = (sanitizeConfigMap(config));

    // save config to storage
    chrome.storage.local.set({config: cfgData}).then(()=>{
        // chrome.runtime.sendMessage({msg:'cfgUpdated'});  // use reloadConfigs from outside instead
        chrome.storage.local.get('config', (config) => {
            callbackFunc(config);
        });
    });

    return true;
}


export {
  readConfig,
  writeConfig,
};
