import React from 'react';

export const SVGPoly = ({ polyId, faces, clickFn, setFacesFn }: {
  polyId: string, faces: number[][], clickFn: (faces: number[][], row: number, col: number) => number[][]; setFacesFn: React.Dispatch<React.SetStateAction<number[][]>>
  ;
}) => {
  const polyStyle = {
    fill: "white",
    stroke: "black",
    strokeWidth: "10px"
  };
  const polyStyleRed = { ...polyStyle, fill: "red" };
  const polyStyleGreen = { ...polyStyle, fill: "green" };
  const polyStyleBlue = { ...polyStyle, fill: "blue" };
  const polyStyleOrange = { ...polyStyle, fill: "orange" };
  const polyStyleYellow = { ...polyStyle, fill: "yellow" };
  const polyStyleWhite = { ...polyStyle, fill: "white" };
  const polyStyleInactive = { ...polyStyle, fill: "grey" };
  // const polyStyleActive = polyStyleYellow;


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

  const mapNumberToPolyStyle = (n: number) => {
    switch (n) {
      case 1: return polyStyleYellow;
      case 2: return polyStyleRed;
      case 3: return polyStyleGreen;
      case 4: return polyStyleOrange;
      case 5: return polyStyleBlue;
      case 6: return polyStyleWhite;
    }
    return polyStyleInactive;
  };

  if (!faces) return null;
  if (faces.length === 0) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width="50vmin" height="50vmin" viewBox="0 0 585 583" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" style={polyStyle}>
        <g transform="matrix(1,0,0,1,-707,-466)">
          {polyTransforms.map(({ coords: c, transform: t }) => {
            if (!c || !t) return null;
            const key_id = `${polyId}_${c[0]}${c[1]}`;
            return (
              <g key={key_id} transform={t}>
                <rect id={key_id} x="792.998" y="550.874" width="138.962" height="138.962" style={(mapNumberToPolyStyle(faces[c[0]][c[1]]))} onClick={() => { console.log("in onClick"); setFacesFn(clickFn(faces, c[0], c[1])); }} />
              </g>
            );
          })}
        </g>
      </svg>

    </div>
  );
};

// OLL toggles
export const ollToggleCoords = (faces: Array<Array<number>>, row: number, column: number): Array<Array<number>> => {
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
};

function ollToggleOneFace(facesArray: Array<Array<number>>, rowIndex: number, cellIndex: number) {
  const tmpFaces = facesArray.map((row, i) => {
    if (i === rowIndex) {
      return row.map((cell, j) => {
        if (j === cellIndex) {
          console.log(`flipping cell at ${rowIndex}, ${cellIndex}`);
          return cell ? 0 : 1;
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

function pllColorOneFace(facesArray: Array<Array<number>>, rowIndex: number, cellIndex: number, newColorNum: number) {
  const tmpFaces = facesArray.map((row, i) => {
    if (i === rowIndex) {
      return row.map((cell, j) => {
        if (j === cellIndex) {
          console.log(`coloring cell at ${rowIndex}, ${cellIndex}`);
          return newColorNum;
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

export const ollToggleFace = (faces: number[][], rowIndex: number, cellIndex: number) => {
  let newFaces = faces;

  const toggleCoords = ollToggleCoords(faces, rowIndex, cellIndex);
  console.log("toggleCoords: ", toggleCoords);

  toggleCoords.forEach(([row, column]) => {
    console.log(`in .forEach: ${row}, ${column}`);
    newFaces = ollToggleOneFace(newFaces, row, column);
  }
  );
  // console.log(newFaces);
  // setFaces(newFaces);
  return newFaces;
};

// this fn receives a click on a face. It needs to know the index to choose the right color for the face. It also needs to know the array that has the id of the LL stickers grouped by color e.g. [[1,3],[2,6]]
export const pllToggleFace = (faces: number[][], rowIndex: number, colIndex: number, colorNum: number = 1) => {
  let newFaces = faces;

  // newFaces = [
  //   [1, 2, 3, 4, 5],
  //   [2, 3, 4, 5, 1],
  //   [3, 4, 0, 1, 2],
  //   [1, 2, 3, 4, 5],
  //   [4, 5, 1, 2, 3]
  // ];
  newFaces = pllColorOneFace(newFaces, rowIndex, colIndex, colorNum);
  
  return newFaces;
};



export default SVGPoly;