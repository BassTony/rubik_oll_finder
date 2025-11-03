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



function Rubik() {
  const [faces, setFaces] = useState(facesData);

  /*   // PLL toggles
    function ollToggleCoords(_fcs: Array<Array<boolean>>, row: number, column: number): Array<Array<number>> {
      if (row === 0 || column === 0 || row === 4 || column === 4 || row === 2 && column === 2) {
        return [];
      } else if (row === 2) {
        switch (column) {
          case 1:
            return [[2, 1], [2, 0]];
          case 3:
          default:
            return [[2, 3], [2, 4]];
        }
      } else if (column === 2) {
        switch (row) {
          case 1:
            return [[1, 2], [0, 2]];
          case 3:
          default:
            return [[3, 2], [4, 2]];
        }
      } else if (row === 1 && column === 1) {
        if (faces[1][0]) {
          return [[1, 0], [0, 1]];
        } else if (faces[0][1]) {
          return [[0, 1], [1, 1]];
        } else {
          return [[1, 1], [1, 0]];
        }
      } else if (row === 1 && column === 3) {
        if (faces[1][3]) {
          return [[1, 3], [0, 3]];
        } else if (faces[0][3]) {
          return [[0, 3], [1, 4]];
        } else {
          return [[1, 4], [1, 3]];
        }
      } else if (row === 3 && column === 1) {
        if (faces[3][0]) {
          return [[3, 1], [3, 0]];
        } else if (faces[4][1]) {
          return [[3, 0], [4, 1]];
        } else {
          return [[4, 1], [3, 1]];
        }
      } else if (row === 3 && column === 3) {
        if (faces[3][3]) {
          return [[3, 4], [3, 3]];
        } else if (faces[4][3]) {
          return [[3, 3], [4, 3]];
        } else {
          return [[4, 3], [3, 4]];
        }
      } else {
        return [[row, column]];
      }
    }
   */


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Rubik&apos;s cube OLL finder</h1>
      <h3>(for CFOP method)</h3>
      <SVGPoly polyId={"clickable"} faces={faces} clickFn={ollToggleFace} setFacesFn={setFaces} />
      <button style={{ width: "150px", fontSize: "20pt" }} onClick={() => setFaces(facesData)}>
        RESET
      </button>

      <Solution polyId={"solution"} solutions={OllSolutions} faces={faces} />
    </div>
  );
}



export default Rubik;
