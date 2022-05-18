var id:string|undefined = undefined;

chrome.runtime.sendMessage({msg:'readConfig'}).then((rcvd)=>{
    // return if this is toplevel window
    if (window.parent === window){return;};

    // return if this is not somewhere in nitterinstance list
    const docLoc = document.location.toString();
    if (!rcvd.nitterInstances.some((e:any)=>docLoc.includes(e))){return;}

    const giveEmSize = ()=>{
        // // change min-height of media element
        // var body_ = document.body;
        // var html_ = document.documentElement;
        // var height = Math.max(body_.scrollHeight,body_.offsetHeight,html_.clientHeight,html_.scrollHeight,html_.offsetHeight);
        let height:number|undefined = undefined; // initialize
        try{
            // the item should have this id
            const tlItem = document.getElementsByClassName('timeline-item');

            // this can error out too
            height = tlItem[0].scrollHeight
        }catch(e){
            height = undefined;
            console.log('something went wrong when getting height of timeline-item', e);
        }

        window.parent.postMessage({msg:'resizeMe', id:id, height:height}, '*');
    };

    // const clean = (hoge:any)=>{return JSON.parse(JSON.stringify(hoge))}
    const msgHandler=(event:any)=>{
        const payload = event.data;
        console.info(payload);

        if(payload.msg === 'askForResize'){
            console.assert(id !== undefined);
            id = payload.id;
            giveEmSize();
            // window.onresize=giveEmSize;
        }
    }
    window.addEventListener("message", msgHandler);
    // window.dispatchEvent(new Event('load'));
})
