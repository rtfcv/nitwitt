function clean(hoge:any){return JSON.parse(JSON.stringify(hoge))}

var id = -1;

window.addEventListener("message", (event)=>{
    console.info(event.data);

    if(event.data.msg === 'giveMeSize'){
        // change min-height of media element
        var body_ = document.body;
        var html_ = document.documentElement;

        var height = Math.max(
            body_.scrollHeight,
            body_.offsetHeight,
            html_.clientHeight,
            html_.scrollHeight,
            html_.offsetHeight
        );

        const tlItem = document.getElementsByClassName('timeline-item');

        id = event.data.msg.id;
        window.parent.postMessage({msg:'resizeMe', id:event.data.id, height:tlItem[0].scrollHeight}, '*');
    }
});

// this crosses origin and errors out
// window.parent.addEventListener("message", (event)=>{
//     console.info('parent received: ', event.data);
// });

function loaded(){
    var body_ = document.body;
    var html_ = document.documentElement;
    var height = Math.max( body_.scrollHeight, body_.offsetHeight, html_.clientHeight, html_.scrollHeight, html_.offsetHeight );

    // do something with target origin
    window.parent.postMessage(clean({
        msg: "loaded",
        url:window.location.toString(),
        height:height,
        doc:document,
        id:id
    }), '*');
}

window.addEventListener('load', loaded);

