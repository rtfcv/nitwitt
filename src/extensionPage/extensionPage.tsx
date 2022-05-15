import React from "react";
import { createRoot } from 'react-dom/client';

function App(props:any){  
  return (
    <div>
    </div>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
