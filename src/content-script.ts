let tweetList = document.getElementsByClassName("twitter-tweet")
const nitterUrl = 'nitter.fly.dev';  // I would rather not have this hardcoded here

let counter=0;

window.addEventListener("message", (event)=>{
    console.info(event.data);

    if (event.data.msg === 'loaded'){
        console.info('firing loaded event');
    }

    if (event.data.msg === 'resizeMe'){
        console.info('firing resizeMe Event');
        const iframeElem = document.getElementById(event.data.id) as HTMLIFrameElement;
        iframeElem.style.height = event.data.height.toString() + 'px';
    }
}, false);


function resizeIt(id:string){
    const iframeElem = document.getElementById(id) as HTMLIFrameElement;
    return ()=>{
        console.log(id, 'loaded');
        iframeElem.contentWindow!.postMessage({msg:'giveMeSize', id:id}, '*');// this message is really not being received what so ever
    }
}


for(let tweetElem of tweetList){ 
  let oldSrc:string = '';  // temp variable
  const alist = tweetElem.getElementsByTagName('a');  // list of 'a' tags in <blockquote class="twitter-tweet" />
  // https://twitter.com/.*/status/.*
  const pattern = /\/\/twitter.com\/.*\/status\/.*/;

  console.log('alist', alist);

  for (let atag of alist){
    const hrefStr = atag.getAttribute('href') as string;
    console.log('atag: ', atag);

    if( hrefStr.match(pattern) != null){
      oldSrc = atag.getAttribute('href') as string;
      console.log('oldSrcmatch: ', oldSrc);
    };
  }

  /*
  replace this: 'https://twitter.com/hoge/status/12312318492873490?refaskdfja;lksdjf'
  into this: 'https://nitter.pussthecat.org/hoge/status/12312318492873490/embed'
   */
  const newSrc=oldSrc.replace('twitter.com', nitterUrl).replace(/\?.*$/,'/embed');
  console.log('replacing', oldSrc, 'with ', newSrc)

  // create and initialize Iframe of nitter embed
  let tiframe = document.createElement('iframe');
  let id:string = `mod-tweet-iframe-${counter++}`;
  tiframe.setAttribute('id', id);
  tiframe.setAttribute('src', newSrc);
  tiframe.setAttribute('class', 'twitter-tweet');
  tiframe.setAttribute('style', 'width:100%;height:600px;');
  tweetElem.replaceWith(tiframe);
  tiframe.onload = resizeIt(id);

  // replace tweet BlockQuote with the above iframe
}
