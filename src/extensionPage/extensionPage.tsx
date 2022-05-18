import React from "react";
import {useState, useEffect, useRef} from "react";
import { createRoot } from 'react-dom/client';

function App(props:any){  
  const [nitterInstances, setNitterInstances] = useState('');

  const doneFunc = ()=>{
    const inputForm = document.getElementById('nitter-instance-form') as HTMLInputElement;
    const blockTwitter = document.getElementById('block-twitter-form') as HTMLInputElement;
    const stats = document.getElementById('nitter-instance-status') as HTMLSpanElement;
    var instanceList = [''];
    try{
      instanceList = JSON.parse(inputForm.value!);
      stats.textContent = '';
    }catch(e){
      stats.textContent = e as string;
      alert(e);
      console.warn(e);
      return;
    };
    console.log(instanceList)

    chrome.runtime.sendMessage({msg:'readConfig'}).then((rcvd)=>{
      console.log(rcvd);
      rcvd.nitterInstances = instanceList;
      rcvd.blockTwitter = blockTwitter.checked;
      return chrome.runtime.sendMessage({msg:'writeConfig', config:rcvd});
    }).then(()=>{
      console.debug('config written');
    });
  };

  useEffect(()=>{
    const inputForm = document.getElementById('nitter-instance-form') as HTMLInputElement;
    const blockTwitter = document.getElementById('block-twitter-form') as HTMLInputElement;
    const doneButton = document.getElementById('done-button') as HTMLButtonElement;
    doneButton.addEventListener('click', doneFunc);
    doneButton.addEventListener('submit', console.info);

    // read config
    // chrome.runtime.sendMessage({msg:'readConfig'}).then((rcvd)=>{
    //   console.log(rcvd);
    //   inputForm.textContent = JSON.stringify(rcvd.nitterInstances);
    // });
    chrome.runtime.sendMessage({msg:'readConfig'}).then((rcvd)=>{
      console.log('reading Config on first load', rcvd);
      inputForm.value = JSON.stringify(rcvd.nitterInstances, null, 2);
      blockTwitter.checked = rcvd.blockTwitter;
    });

  }, []);

  return (
    <div className="grid grid-cols-1 justify-center gap-4 max-w-full p-4">
      <div className="prose">
        <h1>settings</h1>
      </div>
      <div className="w-full h-fit-content">
        <div className="prose">
          <h2>nitterInstances</h2>
          <div id="nitter-instance-status" className="text-lg text-red-500"></div>
        </div>
        <textarea id="nitter-instance-form" className="w-full max-w-xs rounded border-double border-2 border-orange-500 text-base h-48"></textarea>
      </div>

      <div className="w-full h-fit-content">
        <div className="prose">
          <h2>blockTwitter
            <input id="block-twitter-form" type="checkbox" className="w-fit mx-4 text-base" />
          </h2>
        </div>
      </div>

      <div className="flex">
        <button id="done-button" type="submit" className="rounded border-double border-2 border-orange-500 text-lg">apply</button>
      </div>
    </div>
  );
};


const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// putting this in callback renders the page invisible
root.render(<App />);



