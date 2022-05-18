let tweetList = document.getElementsByClassName("twitter-tweet")
var nitterUrl = 'nitter.fly.dev';  // I would rather not have this hardcoded here
let counter=0;

interface Loaded  {
    [id:string]: boolean
};
var resized:Loaded = {};

chrome.runtime.sendMessage({msg:'readConfig'}).then((rcvd)=>{
  console.debug('read configs:', rcvd);
  const nitterUrl = ()=>{
    const nList = rcvd.nitterInstances as Array<string>;
    return nList[~~(Math.random()*nList.length)];
    return rcvd.nitterInstances[0]
  };
  console.debug('now using: ', nitterUrl);


  window.addEventListener("message", (event)=>{
      console.debug(event.data);
  
      if (event.data.msg === 'loaded'){
          console.debug('firing loaded event');
      }
  
      if (event.data.msg === 'resizeMe'){
          console.info('firing resizeMe Event');
          const iframeElem = document.getElementById(event.data.id) as HTMLIFrameElement;
          iframeElem.height = (8 + Number(event.data.height)).toString() + 'px';
          iframeElem.style.display = '';
          iframeElem.style.visibility = '';

          if (event.data.height === undefined){
            iframeElem.height=''
          };

          // raise resized frag now
          resized[event.data.id] = true;
      }
  }, false);


  function resizeIframeCb(evt: Event){
    const iframeElem = evt.target as HTMLIFrameElement;
    const id = iframeElem.id;

    // iframeElem.style.display = '';
    // iframeElem.height = '600px';

    const tellResize = ()=>{
      if (resized[id] !== true) {
        iframeElem.contentWindow!.postMessage({msg:'giveMeSize', id:id}, '*');
        setTimeout(tellResize, 500);
      };
    };
    tellResize();
  }


  for(let tweetElem of tweetList){ 
    let oldSrc:string = '';  // temp variable
    const alist = tweetElem.getElementsByTagName('a');  // list of 'a' tags in <blockquote class="twitter-tweet" />
    // https://twitter.com/.*/status/.*
  
    console.debug('alist', alist);
  
    /*
     * Iterate through alist 
     * do we really need to iterate?
     */
    // const pattern = /\/\/twitter.com\/.*\/status\/.*/;
    // for (let atag of alist){
    //   const hrefStr = atag.getAttribute('href') as string;
    //   console.debug('atag: ', atag);
  
    //   if( hrefStr.match(pattern) != null){
    //     oldSrc = atag.getAttribute('href') as string;
    //     console.debug('oldSrcmatch: ', oldSrc);
    //   };
    // }

    /*
     * this ought to be enough
     */
    oldSrc = alist[alist.length - 1].getAttribute('href')!;
  
    /*
    replace this: 'https://twitter.com/hoge/status/12312318492873490?refaskdfja;lksdjf'
    into this: 'https://nitter.pussthecat.org/hoge/status/12312318492873490/embed'
     */
    const newSrc=oldSrc.replace('twitter.com', nitterUrl()).replace(/\?.*$/,'/embed');
    console.debug('replacing', oldSrc, 'with ', newSrc)

    // create and initialize Iframe of nitter embed
    let tiframe = document.createElement('iframe') as HTMLIFrameElement;
    let id:string = `mod-tweet-iframe-${counter++}`;

    resized[id] = false;  // set initial state
    tiframe.id = id;
    tiframe.setAttribute('class', 'twitter-tweet');
    tiframe.setAttribute('style', 'border-radius: 10px; border: 2px solid gray; width:100%;');
    tiframe.height='600px';
    tiframe.style.visibility='hidden !important';
    // tiframe.style.display='none';
    // tweetElem.replaceWith(tiframe);
    tiframe.onload = resizeIframeCb;  // this sometimes seem not to fire
    tiframe.src = newSrc;
    setTimeout(()=>{tweetElem.replaceWith(tiframe);}, 125*counter);
  }
});

