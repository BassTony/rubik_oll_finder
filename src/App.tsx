import React from 'react';
import './App.css';
import Rubik from './Rubik.tsx';
import PllFinder from './PllFinder.tsx';
import PllFinderSwapClicks from './PllFinder_swapColorClicks.tsx';

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div style={{ flex: "center flexDirection column" }}>
      <h1>Rubik&apos;s cube solution finder (for CFOP method)</h1>
      <Rubik />
      <PllFinderSwapClicks />
      {/* <PllFinder /> */}
    </div>
  );
}

export default App;
