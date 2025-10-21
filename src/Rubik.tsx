import { useState } from 'react';
import './Rubik.css';

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

  const OLLsolutions = [
    [
      [
        [false, true, false, false, false],
        [false, false, true, true, false],
        [false, true, true, false, true],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "29",
      "Awkward Shape",
      "R U R' U' R U' R' F' U' F R U R'",
    ],
    [
      [
        [false, false, false, false, false],
        [true, false, true, false, true],
        [false, true, true, false, true],
        [false, true, false, true, false],
        [false, false, true, false, false],
      ],
      "30",
      "Awkward Shape",
      "F R' F R2 U' R' U' R U R' F2",
    ],
    [
      [
        [false, true, false, true, false],
        [false, false, true, false, false],
        [false, true, true, false, true],
        [false, true, false, true, false],
        [false, false, true, false, false],
      ],
      "41",
      "Awkward Shape",
      "R U R' U R U2 R' F R U R' U' F'",
    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, true, false],
        [false, true, true, false, true],
        [false, false, true, false, false],
        [false, true, false, true, false],
      ],
      "42",
      "Awkward Shape",
      "R' U' R U' R' U2 R F R U R' U' F'",
    ],
    [
      [
        [false, true, true, false, false],
        [false, false, false, true, false],
        [false, true, true, true, false],
        [false, true, false, false, true],
        [false, false, true, false, false],
      ],
      "39",
      "Big Lightning Bolt",
      "L F' L' U' L U F U' L'",
    ],
    [
      [
        [false, false, true, true, false],
        [false, true, false, false, false],
        [false, true, true, true, false],
        [true, false, false, true, false],
        [false, false, true, false, false],
      ],
      "40",
      "Big Lightning Bolt",
      "R' F R U R' U' F' U R",
    ],
    [
      [
        [false, false, true, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, false, true, false, false],
      ],
      "34",
      "C Shape",
      "R U R2 U' R' F R U R U' F'",
    ],
    [
      [
        [false, false, false, false, false],
        [false, true, true, false, true],
        [true, false, true, false, true],
        [false, true, true, false, true],
        [false, false, false, false, false],
      ],
      "46",
      "C Shape",
      "R' U' R' F R F' U R",
    ],
    [
      [
        [false, false, false, false, false],
        [false, true, true, true, false],
        [false, true, true, false, true],
        [false, true, false, true, false],
        [false, false, true, false, false],
      ],
      "28",
      "Corners Oriented",
      "r U R' U' r' R U R U' R'",

    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, false, true, false, false],
      ],
      "57",
      "Corners Oriented",
      "R U R' U' M' U R U' r'"
    ],
    [
      [
        [false, true, false, true, false],
        [false, false, true, false, false],
        [false, true, true, true, false],
        [false, false, true, false, false],
        [false, true, false, true, false],
      ],
      "21",
      "Cross",
      "R U2 R' U' R U R' U' R U' R'",

    ],
    [
      [
        [false, false, false, true, false],
        [true, false, true, false, false],
        [false, true, true, true, false],
        [true, false, true, false, false],
        [false, false, false, true, false],
      ],
      "22",
      "Cross",
      "R U2 R2 U' R2 U' R2 U2 R",
    ],
    [
      [
        [false, true, false, true, false],
        [false, false, true, false, false],
        [false, true, true, true, false],
        [false, true, true, true, false],
        [false, false, false, false, false],
      ],
      "23",
      "Cross",
      "R2 D' R U2 R' D R U2 R",

    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, true, false],
        [false, true, true, true, false],
        [false, false, true, true, false],
        [false, true, false, false, false],
      ],
      "24",
      "Cross",
      "r U R' U' r' F R F'",
    ],
    [
      [
        [false, false, false, false, false],
        [true, false, true, true, false],
        [false, true, true, true, false],
        [false, true, true, false, false],
        [false, false, false, true, false],
      ],
      "25",
      "Cross",
      "F' r U R' U' r' F R",

    ],
    [
      [
        [false, false, false, false, false],
        [true, false, true, true, false],
        [false, true, true, true, false],
        [false, false, true, false, true],
        [false, true, false, false, false],
      ],
      "26",
      "Cross",
      "R U2 R' U' R U' R'",
    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, false, true],
        [false, true, true, true, false],
        [false, true, true, false, false],
        [false, false, false, true, false],
      ],
      "27",
      "Cross",
      "R U R' U R U2 R'",
    ],
    [
      [
        [false, false, true, false, false],
        [true, false, false, false, true],
        [true, false, true, false, true],
        [true, false, false, false, true],
        [false, false, true, false, false],
      ],
      "1",
      "Dot",
      "R U2 R2 F R F' U2 R' F R F'",
    ],
    [
      [
        [false, true, true, true, false],
        [false, false, false, false, false],
        [true, false, true, false, true],
        [true, false, false, false, true],
        [false, false, true, false, false],
      ],
      "2",
      "Dot",
      "r U r' U2 r U2 R' U2 R U' r'",
    ],
    [
      [
        [false, true, true, false, false],
        [false, false, false, false, true],
        [true, false, true, false, true],
        [false, true, false, false, false],
        [false, false, true, true, false],
      ],
      "3",
      "Dot",
      "r' R2 U R' U r U2 r' U M'",
    ],
    [
      [
        [false, false, true, true, false],
        [true, false, false, false, false],
        [true, false, true, false, true],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "4",
      "Dot",
      "M U' r U2 r' U' R U' R' M'",
    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, false, true],
        [true, false, true, false, true],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "17",
      "Dot",
      "F R' F' R2 r' U R U' R' U' M'",
    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, true, false],
        [true, false, true, false, true],
        [false, false, false, false, false],
        [false, true, true, true, false],
      ],
      "18",
      "Dot",
      "r U R' U R U2 r2 U' R U' R' U2 r",
    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, true, false],
        [true, false, true, false, true],
        [true, false, false, false, true],
        [false, false, true, false, false],
      ],
      "19",
      "Dot",
      "r' R U R U R' U' M' R' F R F'",
    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, true, false],
        [true, false, true, false, true],
        [false, true, false, true, false],
        [false, false, true, false, false],
      ],
      "20",
      "Dot",
      "r U R' U' M2 U R U' R' U' M'",
    ],
    [
      [
        [false, false, false, true, false],
        [true, false, true, false, false],
        [false, true, true, false, true],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "9",
      "Fish Shape",
      "R U R' U' R' F R2 U R' U' F'",
    ],
    [
      [
        [false, true, true, false, false],
        [false, false, false, true, false],
        [false, true, true, false, true],
        [true, false, true, false, false],
        [false, false, false, true, false],
      ],
      "10",
      "Fish Shape",
      "R U R' U R' F R F' R U2 R'",
    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, false, true],
        [true, false, true, true, false],
        [false, false, true, true, false],
        [false, true, false, false, false],
      ],
      "35",
      "Fish Shape",
      "R U2 R2 F R F' R U2 R'",
    ],
    [
      [
        [false, false, false, false, false],
        [false, true, true, false, true],
        [false, true, true, false, true],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "37",
      "Fish Shape",
      "F R' F' R U R U' R'",
    ],
    [
      [
        [false, true, true, false, false],
        [false, false, false, false, true],
        [false, true, true, true, false],
        [false, false, false, false, true],
        [false, true, true, false, false],
      ],
      "51",
      "I Shape",
      "F U R U' R' U R U' R' F'",
    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, false, true],
        [true, false, true, false, true],
        [false, false, true, false, true],
        [false, true, false, false, false],
      ],
      "52",
      "I Shape",
      "R U R' U R U' B U' B' R'",
    ],
    [
      [
        [false, true, true, true, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
      ],
      "55",
      "I Shape",
      "R' F R U R U' R2 F' R2 U' R' U R U R'",
    ],
    [
      [
        [false, false, true, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
        [true, false, false, false, true],
        [false, false, true, false, false],
      ],
      "56",
      "I Shape",
      "r' U' r U' R' U R U' R' U R r' U r",
    ],
    [
      [
        [false, true, true, true, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
        [false, true, false, false, false],
        [false, false, true, true, false],
      ],
      "13",
      "Knight Move Shape",
      "F U R U' R2 F' R U R U' R'",
    ],
    [
      [
        [false, false, true, true, false],
        [true, false, false, false, false],
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "14",
      "Knight Move Shape",
      "R' F R U R' F' R F U' F'",
    ],
    [
      [
        [false, false, true, false, false],
        [false, true, false, false, true],
        [false, true, true, true, false],
        [true, false, false, false, false],
        [false, false, true, true, false],
      ],
      "15",
      "Knight Move Shape",
      "l' U' l L' U' L U l' U l",
    ],
    [
      [
        [false, false, true, false, false],
        [true, false, false, true, false],
        [false, true, true, true, false],
        [false, false, false, false, true],
        [false, true, true, false, false],
      ],
      "16",
      "Knight Move Shape",
      "r U r' R U R' U' r U' r'",
    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, true, false],
        [true, false, true, true, false],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "31",
      "P Shape",
      "R' U' F U R U' R' F' R",
    ],
    [
      [
        [false, false, false, true, false],
        [false, true, true, false, false],
        [false, true, true, false, true],
        [false, true, false, false, false],
        [false, false, true, true, false],
      ],
      "32",
      "P Shape",
      "L U F' U' L' U L F L'",
    ],
    [
      [
        [false, false, false, false, false],
        [true, false, true, true, false],
        [true, false, true, true, false],
        [true, false, false, true, false],
        [false, false, true, false, false],
      ],
      "43",
      "P Shape",
      "F' U' L' U L F",
    ],
    [
      [
        [false, false, false, false, false],
        [false, true, true, false, true],
        [false, true, true, false, true],
        [false, true, false, false, true],
        [false, false, true, false, false],
      ],
      "44",
      "P Shape",
      "F U R U' R' F'",
    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, false, true],
        [true, false, true, true, false],
        [false, false, false, false, true],
        [false, true, true, false, false],
      ],
      "47",
      "Small L Shape",
      "R' U' R' F R F' R' F R F' U R",
    ],
    [
      [
        [false, false, false, true, false],
        [true, false, true, false, false],
        [false, true, true, false, true],
        [true, false, false, false, false],
        [false, false, true, true, false],
      ],
      "48",
      "Small L Shape",
      "F R U R' U' R U R' U' F'",
    ],
    [
      [
        [false, false, false, true, false],
        [true, false, true, false, false],
        [true, false, true, true, false],
        [true, false, false, false, false],
        [false, false, true, true, false],
      ],
      "49",
      "Small L Shape",
      "r U' r2 U r2 U r2 U' r",
    ],
    [
      [
        [false, false, true, true, false],
        [true, false, false, false, false],
        [true, false, true, true, false],
        [true, false, true, false, false],
        [false, false, false, true, false],
      ],
      "50",
      "Small L Shape",
      "r' U r2 U' r2 U' r2 U r'",
    ],
    [
      [
        [false, true, false, true, false],
        [false, false, true, false, false],
        [true, false, true, true, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
      ],
      "53",
      "Small L Shape",
      "l' U2 L U L' U' L U L' U l",
    ],
    [
      [
        [false, true, false, true, false],
        [false, false, true, false, false],
        [false, true, true, false, true],
        [false, false, false, false, false],
        [false, true, true, true, false],
      ],
      "54",
      "Small L Shape",
      "r U2 R' U' R U R' U' R U' r'",
    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, false, true],
        [false, true, true, false, true],
        [false, true, false, false, false],
        [false, false, true, true, false],
      ],
      "7",
      "Small Lightning Bolt",
      "r U R' U R U2 r'",
    ],
    [
      [
        [false, false, false, true, false],
        [true, false, true, false, false],
        [true, false, true, true, false],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "8",
      "Small Lightning Bolt",
      "l' U' L U' L' U2 l",
    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, true, false],
        [false, true, true, false, true],
        [true, false, false, false, false],
        [false, false, true, true, false],
      ],
      "11",
      "Small Lightning Bolt",
      "r U R' U R' F R F' R U2 r'",
    ],
    [
      [
        [false, false, false, true, false],
        [false, true, true, false, false],
        [true, false, true, true, false],
        [false, false, false, false, true],
        [false, true, true, false, false],
      ],
      "12",
      "Small Lightning Bolt",
      "M' R' U' R U' R' U2 R U' R r'",
    ],
    [
      [
        [false, false, false, false, false],
        [false, true, true, false, true],
        [false, true, true, false, true],
        [true, false, false, false, false],
        [false, false, true, true, false],
      ],
      "5",
      "Square Shape",
      "l' U2 L U L' U l",
    ],
    [
      [
        [false, false, false, false, false],
        [true, false, true, true, false],
        [true, false, true, true, false],
        [false, false, false, false, true],
        [false, true, true, false, false],
      ],
      "6",
      "Square Shape",
      "r U2 R' U' R U' r'",
    ],
    [
      [
        [false, true, true, false, false],
        [false, false, false, true, false],
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, true, true, false, false],
      ],
      "33",
      "T Shape",
      "R U R' U' R' F R F'",
    ],
    [
      [
        [false, false, true, false, false],
        [true, false, false, true, false],
        [false, true, true, true, false],
        [true, false, false, true, false],
        [false, false, true, false, false],
      ],
      "45",
      "T Shape",
      "F R U R' U' F'",
    ],
    [
      [
        [false, false, false, true, false],
        [false, true, true, false, false],
        [true, false, true, true, false],
        [true, false, false, true, false],
        [false, false, true, false, false],
      ],
      "36",
      "W Shape",
      "L' U' L U' L' U L U L F' L' F",
    ],
    [
      [
        [false, true, false, false, false],
        [false, false, true, true, false],
        [false, true, true, false, true],
        [false, true, false, false, true],
        [false, false, true, false, false],
      ],
      "38",
      "W Shape",
      "R U R' U R U' R' U' R' F R F'",
    ],
  ];

  const n = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _PLLsolutions = [
    [
      [
        [n, 1, 1, 1, n],
        [4, 0, 0, 0, 2],
        [4, 0, 0, 0, 2],
        [4, 0, 0, 0, 2],
        [n, 3, 3, 3, n],
      ],
      "finished",
      "GROUP: Finished",
      "R U U' R'",
    ],
    [
      [
        [n, 1, 1, 1, n],
        [4, 0, 0, 0, 2],
        [4, 0, 0, 0, 2],
        [4, 0, 0, 0, 2],
        [n, 3, 3, 3, n],
      ],
      "finished",
      "GROUP: Finished",
      "R U U' R'",
    ]
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Rubik's cube OLL finder (for CFOP method)</h1>
      <SVGPoly polyId={"clickable"} faces={faces} clickFn={toggleFace} />
      <button style={{ width: "300px", fontSize: "20pt" }} onClick={() => setFaces(facesData)}>
        RESET
      </button>

      <Solution polyId={"solution"} solutions={OLLsolutions} faces={faces} />
    </div>
  );
}

const Solution = ({ polyId, solutions, faces }: { id: string, solutions: Array<Array<boolean>>, faces: Array<Array<boolean>>; }) => {
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
      <SVGPoly id={polyId} faces={solution[0]} clickFn={(_row: number, _col: number) => { }} />
      {/*  <div>
        // map over faces
        {solution?.at(0).map((row, rowIndex) => (
          <div className="row rubik" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className={`cell_${cell ? 'active' : 'passive'}`} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
            ))}
          </div>
        ))}
      </div> */}
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


  function changeColor(color: string) {
    console.log(color);
    // setFaces(faces.map((row, rowIndex) => row.map((cell, cellIndex) => cell ? color : cell)));
    const r = Math.floor(Math.random() * 5);
    const c = Math.floor(Math.random() * 5);
    const elem = document.getElementById(`${polyId}_${r}${c}`);
    console.log("elem:", elem);
    elem?.setAttribute("style", `fill: ${color}; stroke: black; strokeWidth: 6.25px`);
  }

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


      Buttons to change the color
      <button onClick={() => changeColor('red')}>Red</button>
      <button onClick={() => changeColor('green')}>Green</button>
      <button onClick={() => changeColor('blue')}>Blue</button>

    </div>
  );
  // }

  // export default SvgPolygonExample;

};

export default Rubik;
