let tweetList = document.getElementsByClassName("twitter-tweet")

const nitterUrl = 'nitter.pussthecat.org';  // I would rather not have this hardcoded here

for(let tweetElem of tweetList){ 
  let oldSrc:string = '';  // temp variable
  const alist = tweetElem.getElementsByTagName('a');  // list of 'a' tags in <blockquote class="twitter-tweet" />
  // https://twitter.com/.*/status/.*
  const pattern = /https:\/\/twitter.com\/.*\/status\/.*/;

  for (let atag of alist){
    const hrefStr = atag.getAttribute('href') as string;

    if( hrefStr.match(pattern) != null){
      oldSrc = atag.getAttribute('href') as string;
    };
  }

  /*
  replace this: 'https://twitter.com/hoge/status/12312318492873490?refaskdfja;lksdjf'
  into this: 'https://nitter.pussthecat.org/hoge/status/12312318492873490/embed'
   */
  const newSrc=oldSrc.replace('twitter.com', nitterUrl).replace(/\?.*$/,'/embed');

  // create and initialize Iframe of nitter embed
  let tiframe = document.createElement('iframe');
  tiframe.setAttribute('src', newSrc);
  tiframe.setAttribute('class', 'twitter-tweet');
  tiframe.setAttribute('style', 'width:100%;height:fit-content;')

  // replace tweet BlockQuote with the above iframe
  tweetElem.replaceWith(tiframe);
}

