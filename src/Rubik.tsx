import { useState } from 'react';
import './Rubik.css';
import { SolutionEntry, OLLsolutions } from './OllSolutions';
const facesData = [
  [false, false, false, false, false,],
  [false, true, true, true, false,],
  [false, true, true, true, false,],
  [false, true, true, true, false,],
  [false, false, false, false, false,]
];


// rotating an array 90 degrees clockwise
function rotateArray90(array: Array<Array<boolean>>): Array<Array<boolean>> {
  const n = array.length;
  const newArray = Array.from({ length: n }, () => Array.from({ length: n }, () => false));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      newArray[j][n - 1 - i] = array[i][j];
    }
  }
  return newArray;
}

function Rubik() {
  const [faces, setFaces] = useState(facesData);

  function toggleFace(rowIndex: number, cellIndex: number) {
    return () => {
      let newFaces = faces;

      function toggleOneFace(facesArray: Array<Array<boolean>>, rowIndex: number, cellIndex: number) {
        const tmpFaces = facesArray.map((row, i) => {
          if (i === rowIndex) {
            return row.map((cell, j) => {
              if (j === cellIndex) {
                console.log(`flipping cell at ${rowIndex}, ${cellIndex}`);
                return !cell;
              }
              return cell;
            });
          }
          return row;
        });
        // newFaces = tmpFaces;
        console.log("tmpFaces: ", tmpFaces);
        return tmpFaces;
      }

      const toggleCoords = pllToggleCoords(faces, rowIndex, cellIndex);
      console.log("toggleCoords: ", toggleCoords);

      toggleCoords.forEach(([row, column]) => {
        console.log(`in .forEach: ${row}, ${column}`);
        newFaces = toggleOneFace(newFaces, row, column);
      }
      );
      // console.log(newFaces);
      setFaces(newFaces);
    };
  }

  // PLL toggles
  function pllToggleCoords(_fcs: Array<Array<boolean>>, row: number, column: number): Array<Array<number>> {
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



  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Rubik's cube OLL finder</h1>
      <h3>(for CFOP method)</h3>
      <SVGPoly polyId={"clickable"} faces={faces} clickFn={toggleFace} />
      <button style={{ width: "150px", fontSize: "20pt" }} onClick={() => setFaces(facesData)}>
        RESET
      </button>

      <Solution polyId={"solution"} solutions={OLLsolutions} faces={faces} />
    </div>
  );
}

const Solution = ({ polyId, solutions, faces }: { polyId: string, solutions: SolutionEntry[], faces: boolean[][]; }) => {
  const f90 = rotateArray90(faces);
  const f180 = rotateArray90(f90);
  const f270 = rotateArray90(f180);
  const rotations = [faces, f90, f180, f270];

  // if any of the first elements in rotations has same content than i[0], make it the solution
  const solution = solutions.find((i) => {
    return rotations.some((r) => {
      return r.every((row, rowIndex) => {
        return row.every((cell, cellIndex) => {
          return cell === i[0][rowIndex][cellIndex];
        });
      });
    });
  });

  if (!solution) return null;

  return (
    <>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <h2>Solution for {solution[1]} ({solution[2]}):<br />
          {solution ? solution[3] : `no solutions!`}</h2>
      </div>
      <SVGPoly polyId={polyId} faces={solution[0]} clickFn={(_row: number, _col: number) => () => { }} />
    </>
  );
};


const SVGPoly = ({ polyId, faces, clickFn }: { polyId: string, faces: boolean[][]; clickFn: (row: number, col: number) => () => void; }) => {
  const polyStyle = {
    fill: "white",
    stroke: "black",
    strokeWidth: "6.25px"
  };
  const polyStyleActive = {
    fill: "yellow",
    stroke: "black",
    strokeWidth: "6.25px"
  };
  const polyStyleInactive = {
    fill: "grey",
    stroke: "black",
    strokeWidth: "6.25px"
  };


  const polyTransforms = [
    { coords: [0, 1], transform: "matrix(-3.18529e-17,0.520197,-1,-6.12323e-17,1483.03,66.0713)" },
    { coords: [0, 2], transform: "matrix(-3.18529e-17,0.520197,1,6.12323e-17,381.086,66.0713)" },
    { coords: [0, 3], transform: "matrix(-3.18529e-17,0.520197,1,6.12323e-17,520.047,66.0713)" },
    { coords: [1, 0], transform: "matrix(0.520197,0,0,-1,308.195,1240.91)" },
    { coords: [1, 1], transform: "matrix(1,0,0,1,0,0)" },
    { coords: [1, 2], transform: "matrix(1,0,0,1,138.962,0)" },
    { coords: [1, 3], transform: "matrix(1,0,0,1,277.923,0)" },
    { coords: [1, 4], transform: "matrix(-0.520197,0,0,-1,1694.69,1240.91)" },
    { coords: [2, 0], transform: "matrix(0.520197,0,0,1,308.195,138.962)" },
    { coords: [2, 1], transform: "matrix(1,0,0,1,0,138.962)" },
    { coords: [2, 2], transform: "matrix(1,0,0,1,138.962,138.962)" },
    { coords: [2, 3], transform: "matrix(1,0,0,1,277.923,138.962)" },
    { coords: [2, 4], transform: "matrix(-0.520197,0,0,1,1694.69,138.962)" },
    { coords: [3, 1], transform: "matrix(1,0,0,1,0,277.923)" },
    { coords: [3, 0], transform: "matrix(0.520197,0,0,1,308.195,277.923)" },
    { coords: [3, 2], transform: "matrix(1,0,0,1,138.962,277.923)" },
    { coords: [3, 3], transform: "matrix(1,0,0,1,277.923,277.923)" },
    { coords: [3, 4], transform: "matrix(-0.520197,0,0,1,1694.69,277.923)" },
    { coords: [4, 1], transform: "matrix(3.18529e-17,-0.520197,-1,-6.12323e-17,1483.03,1452.56)" },
    { coords: [4, 2], transform: "matrix(3.18529e-17,-0.520197,1,6.12323e-17,381.086,1452.56)" },
    { coords: [4, 3], transform: "matrix(3.18529e-17,-0.520197,1,6.12323e-17,520.047,1452.56)" },

  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width="200px" height="200px" viewBox="0 0 585 583" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" style={polyStyle}>
        <g transform="matrix(1,0,0,1,-707,-466)">
          {polyTransforms.map(({ coords: c, transform: t }) => {
            if (!c || !t) return null;
            const key_id = `${polyId}_${c[0]}${c[1]}`;
            return (
              <g key={key_id} transform={t}>
                <rect id={key_id} x="792.998" y="550.874" width="138.962" height="138.962" style={(faces[c[0]][c[1]] ? polyStyleActive : polyStyleInactive)} onClick={clickFn(c[0], c[1])} />
              </g>
            );
          })}
        </g>
      </svg>

    </div>
  );
  // }

  // export default SvgPolygonExample;

};

export default Rubik;
