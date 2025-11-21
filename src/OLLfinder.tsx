import React, { useState } from 'react';
import './Rubik.css';
import SVGPoly, { ollToggleFace } from './SVGPoly';
import { OllSolutions } from './OllSolutions';
import { Solution } from './Solution';

const facesData = [
  [0, 0, 0, 0, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 0, 0, 0, 0,]
];

const OLLfinder = () => {
  const [faces, setFaces] = useState(facesData);

  return (
    <>
      <h2>OLL finder (click on yellow stickers to rotate piece)</h2>
      <SVGPoly polyId={"clickable"} faces={faces} clickFn={ollToggleFace} setFacesFn={setFaces} />
      <button style={{ width: "150px", fontSize: "20pt", borderColor: "gray" }} onClick={() => setFaces(facesData)}>RESET</button>

      <Solution polyId={"solution"} solutions={OllSolutions} faces={faces} />
    </>
  );
};



export default OLLfinder;
