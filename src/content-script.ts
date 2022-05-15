let tweetList = document.getElementsByClassName("twitter-tweet")
var nitterUrl = 'nitter.fly.dev';  // I would rather not have this hardcoded here
let counter=0;

chrome.runtime.sendMessage({msg:'readConfig'}).then((rcvd)=>{
  console.debug('read configs:', rcvd);
  nitterUrl = rcvd.nitterInstances[0];
  console.debug('now using: ', nitterUrl);


  window.addEventListener("message", (event)=>{
      console.debug(event.data);
  
      if (event.data.msg === 'loaded'){
          console.debug('firing loaded event');
      }
  
      if (event.data.msg === 'resizeMe'){
          console.info('firing resizeMe Event');
          const iframeElem = document.getElementById(event.data.id) as HTMLIFrameElement;
          iframeElem.style.height = (8 + Number(event.data.height)).toString() + 'px';
          if (event.data.height === undefined){iframeElem.style.height=''};
      }
  }, false);
  
  
  function resizeIt(id:string){
      const iframeElem = document.getElementById(id) as HTMLIFrameElement;
      return ()=>{
          console.info(id, 'loaded');
          // iframeElem.style.height = '600px';
          iframeElem.contentWindow!.postMessage({msg:'giveMeSize', id:id}, '*');
      }
  }
  
  
  for(let tweetElem of tweetList){ 
    let oldSrc:string = '';  // temp variable
    const alist = tweetElem.getElementsByTagName('a');  // list of 'a' tags in <blockquote class="twitter-tweet" />
    // https://twitter.com/.*/status/.*
    const pattern = /\/\/twitter.com\/.*\/status\/.*/;
  
    console.debug('alist', alist);
  
    for (let atag of alist){
      const hrefStr = atag.getAttribute('href') as string;
      console.debug('atag: ', atag);
  
      if( hrefStr.match(pattern) != null){
        oldSrc = atag.getAttribute('href') as string;
        console.debug('oldSrcmatch: ', oldSrc);
      };
    }
  
    /*
    replace this: 'https://twitter.com/hoge/status/12312318492873490?refaskdfja;lksdjf'
    into this: 'https://nitter.pussthecat.org/hoge/status/12312318492873490/embed'
     */
    const newSrc=oldSrc.replace('twitter.com', nitterUrl).replace(/\?.*$/,'/embed');
    console.debug('replacing', oldSrc, 'with ', newSrc)
  
    // create and initialize Iframe of nitter embed
    let tiframe = document.createElement('iframe');
    let id:string = `mod-tweet-iframe-${counter++}`;
    tiframe.setAttribute('id', id);
    tiframe.setAttribute('src', newSrc);
    tiframe.setAttribute('class', 'twitter-tweet');
    // tiframe.setAttribute('style', 'width:100%;');
    tiframe.setAttribute('style', 'border-radius: 10px; border: 2px solid gray; width:100%; height:600px');
    tweetElem.replaceWith(tiframe);
    // tiframe.onload = resizeIt(id);
    tiframe.onload = resizeIt(id);
  
    // replace tweet BlockQuote with the above iframe
  }
});

