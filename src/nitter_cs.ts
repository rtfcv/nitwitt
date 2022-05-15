var id = '';

chrome.runtime.sendMessage({msg:'readConfig'}).then((rcvd)=>{
    // return if this is toplevel window
    if (window.parent === window){return;};

    // return if this is not somewhere in nitterinstance list
    const docLoc = document.location.toString();
    if (!rcvd.nitterInstances.some((e:any)=>docLoc.includes(e))){return;}

    // const clean = (hoge:any)=>{return JSON.parse(JSON.stringify(hoge))}

    const eventHandler=(event:any)=>{
        console.info(event.data);

        if(event.data.msg === 'giveMeSize'){
            // change min-height of media element
            // var body_ = document.body;
            // var html_ = document.documentElement;
            // var height = Math.max(body_.scrollHeight,body_.offsetHeight,html_.clientHeight,html_.scrollHeight,html_.offsetHeight);

            try{
              const tlItem = document.getElementsByClassName('timeline-item');
              tlItem[0].scrollHeight
              id = event.data.msg.id;
              window.parent.postMessage({msg:'resizeMe', id:event.data.id, height:tlItem[0].scrollHeight}, '*');
            }catch(e){
              console.warn('something went wrong when getting height of timeline-item', e);
              window.parent.postMessage({msg:'resizeMe', id:event.data.id, height:undefined}, '*');
            }
        }
    }


    window.addEventListener("message", eventHandler);

    // this crosses origin and errors out
    // window.parent.addEventListener("message", (event)=>{
    //     console.info('parent received: ', event.data);
    // });

    // const loaded = ()=>{
    //     var body_ = document.body;
    //     var html_ = document.documentElement;
    //     var height = Math.max( body_.scrollHeight, body_.offsetHeight, html_.clientHeight, html_.scrollHeight, html_.offsetHeight );

    //     // do something with target origin
    //     window.parent.postMessage(clean({
    //         msg: "loaded",
    //         url:window.location.toString(),
    //         height:height,
    //         doc:document,
    //         id:id
    //     }), '*');
    //     window.removeEventListener('load', loaded);
    // }

    // window.addEventListener('load', loaded);
})
