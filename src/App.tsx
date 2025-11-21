import React from 'react';
import './App.css';
import OLLfinder from './OLLfinder.tsx';
import PLLfinderCycleColors from './PLLfinderCycleColors.tsx';

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div style={{ flex: "center flexDirection column" }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <h1>Rubik&apos;s cube solution finder (for CFOP method)</h1>
        <OLLfinder />
        <br /><br />
        <PLLfinderCycleColors />
      </div>
    </div>
  );
}

export default App;
