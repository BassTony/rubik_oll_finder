import React from 'react'
import './App.css'
import Rubik from './Rubik.tsx'
import PllFinder from './PllFinder.tsx'

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Rubik />
      <div style={{ visibility: 'visible' }}> {/* hide the PllFinder component but keep it mounted */}
        <PllFinder />
      </div>
    </>
  )
}

export default App
