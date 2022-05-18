
interface configObj {
        nitterInstances:Array<string>,
        blockTwitter:boolean
};


function sanitizeConfigMap(input:any) {
    if (typeof input === 'undefined'){
        input = {};
    }

    const tCheck = (targetVariable:any, defaultValue:any)=>{
        return (typeof targetVariable === typeof defaultValue) ? targetVariable : defaultValue;
    };

    let config:configObj = {
      nitterInstances: tCheck(input.nitterInstances, ['nitter.fly.dev']),
      blockTwitter: tCheck(input.blockTwitter, true),
    };
    return config;
}

function readConfig(callbackFunc: any) {
    chrome.storage.local.get('config', (result) => {
        // DO FORMAT CHECK HERE
        console.debug('Reading Config', result);
        const cleanConfig = sanitizeConfigMap(result.config);
        console.debug('sanitized config is', cleanConfig);
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
  configObj,
  readConfig,
  writeConfig,
};
