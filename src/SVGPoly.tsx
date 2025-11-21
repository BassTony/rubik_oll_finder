import React from 'react';

const devmode: boolean = false;

const polyStyle = {
  fill: "white",
  stroke: "black",
  strokeWidth: "10px",
  // width: "50vmin",
  // height: "50vmin",
  maxHeight: "500px",
};
const polyStyleRed = { ...polyStyle, fill: "red" };
const polyStyleGreen = { ...polyStyle, fill: "#05d905" };
const polyStyleBlue = { ...polyStyle, fill: "#0051ff" };
const polyStyleOrange = { ...polyStyle, fill: "orange" };
const polyStyleYellow = { ...polyStyle, fill: "yellow" };
const polyStyleWhite = { ...polyStyle, fill: "white" };
const polyStyleInactive = { ...polyStyle, fill: "grey" };
// const polyStyleActive = polyStyleYellow;


const mapNumberToPolyStyleColored = (n: number) => {
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

export const mapNumberToColorName = (n: number) => {
  switch (n) {
    case 1: return polyStyleYellow.fill;
    case 2: return polyStyleRed.fill;
    case 3: return polyStyleGreen.fill;
    case 4: return polyStyleOrange.fill;
    case 5: return polyStyleBlue.fill;
    case 6: return polyStyleWhite.fill;
  }
  return polyStyleInactive.fill;
};

/* const polyTransforms_Old = [
  { coords: [0, 1], transform: "matrix( 0,     0.52,  -1, 0,  1483, 66)" },
  { coords: [0, 2], transform: "matrix( 0,     0.52,  1,  0,  381,  66)" },
  { coords: [0, 3], transform: "matrix( 0,     0.52,  1,  0,  520,  66)" },
  { coords: [1, 0], transform: "matrix( 0.52,  0,     0,  -1, 308,  1240)" },
  { coords: [1, 1], transform: "matrix( 1,     0,     0,  1,  0,    0)" },
  { coords: [1, 2], transform: "matrix( 1,     0,     0,  1,  138,  0)" },
  { coords: [1, 3], transform: "matrix( 1,     0,     0,  1,  277,  0)" },
  { coords: [1, 4], transform: "matrix( -0.52, 0,     0,  -1, 1694, 1240)" },
  { coords: [2, 0], transform: "matrix( 0.52,  0,     0,  1,  308,  138)" },
  { coords: [2, 1], transform: "matrix( 1,     0,     0,  1,  0,    138)" },
  { coords: [2, 2], transform: "matrix( 1,     0,     0,  1,  138,  138)" },
  { coords: [2, 3], transform: "matrix( 1,     0,     0,  1,  277,  138)" },
  { coords: [2, 4], transform: "matrix( -0.52, 0,     0,  1,  1694, 138)" },
  { coords: [3, 1], transform: "matrix( 1,     0,     0,  1,  0,    277)" },
  { coords: [3, 0], transform: "matrix( 0.52,  0,     0,  1,  308,  277)" },
  { coords: [3, 2], transform: "matrix( 1,     0,     0,  1,  138,  277)" },
  { coords: [3, 3], transform: "matrix( 1,     0,     0,  1,  277,  277)" },
  { coords: [3, 4], transform: "matrix( -0.52, 0,     0,  1,  1694, 277)" },
  { coords: [4, 1], transform: "matrix( 0,     -0.52, -1, 0,  1483, 1452)" },
  { coords: [4, 2], transform: "matrix( 0,     -0.52, 1,  0,  381,  1452)" },
  { coords: [4, 3], transform: "matrix( 0,     -0.52, 1,  0,  520,  1452)" },

]; */

const mkRubikPolyTransform = () => {
  const transforms = [];
  const edgeFactor = 0.75;
  const edgeLength = 150;
  const viewBoxSize = 750;
  const skewX = 0;
  const skewY = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      let found = '';
      if (row === 0) {
        found = `matrix( 1, ${skewX}, ${skewY}, ${edgeFactor}, ${col * edgeLength}, ${edgeLength * (1 - edgeFactor)})`;
        // found = `matrix( 1, ${skewX}, ${skewY}, 1, ${col * edgeLength}, ${row * edgeLength})`;
      } else if (row === 4) {
        found = `matrix( 1, ${skewX}, ${skewY}, ${edgeFactor}, ${col * edgeLength}, ${viewBoxSize - edgeLength})`;
      } else if (col === 0) {
        found = `matrix( ${edgeFactor}, ${skewX}, ${skewY}, 1, ${edgeLength * (1 - edgeFactor)}, ${row * edgeLength})`;
      } else if (col === 4) {
        found = `matrix( ${edgeFactor}, ${skewX}, ${skewY}, 1, ${viewBoxSize - edgeLength}, ${row * edgeLength})`;
      } else {
        found = `matrix( 1, ${skewX}, ${skewY}, 1, ${col * edgeLength}, ${row * edgeLength})`;
      }
      // console.log("found:", found);
      if (
        found &&
        // if not a corner piece
        !((row === 0 && col === 0) ||
          (row === 0 && col === 4) ||
          (row === 4 && col === 0) ||
          (row === 4 && col === 4)
        )
      ) {
        transforms.push({ coords: [row, col], transform: found });
      }
    }
  }
  return transforms;
};

// console.log('polyTransforms:', (mkRubikPolyTransform()));

const polyTransforms = mkRubikPolyTransform();
// const polyTransforms = polyTransforms_Old;

export const SVGPoly = ({ polyId, faces, clickFn, setFacesFn }: {
  polyId: string, faces: number[][], clickFn: (faces: number[][], row: number, col: number) => number[][]; setFacesFn: React.Dispatch<React.SetStateAction<number[][]>>
  ;
}) => {
  if (!faces) return null;
  if (faces.length === 0) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width="80vmin" height="80vmin" viewBox="0 0 750 750" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" style={polyStyle}>
        <g transform="matrix(1,0,0,1,0,0)">
          {/* <g key="background" transform="matrix(2,0,0,2,-100,-100)"><rect x="0" y="0" width="750" height="750" style={{ fill: "#cccccc", stroke: "black", strokeWidth: "10px" }} /></g> */}
          {polyTransforms.map(({ coords: c, transform: t }) => {
            if (!c || !t) return null;
            const key_id = `${polyId}_${c[0]}${c[1]}`;
            return (
              <g key={key_id} transform={t}>
                <rect id={key_id} x="0" y="0" width="150" height="150" style={(mapNumberToPolyStyleColored(faces[c[0]][c[1]]))} onClick={() => { if (devmode) console.log("in onClick"); setFacesFn(clickFn(faces, c[0], c[1])); }} />
                {/* <rect id={key_id} x="792.998" y="550.874" width="138" height="138" style={(mapNumberToPolyStyle(faces[c[0]][c[1]]))} onClick={() => { console.log("in onClick"); setFacesFn(clickFn(faces, c[0], c[1])); }} /> */}
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
          if (devmode) console.log(`flipping cell at ${rowIndex}, ${cellIndex}`);
          return cell ? 0 : 1;
        }
        return cell;
      });
    }
    return row;
  });
  // newFaces = tmpFaces;
  if (devmode) console.log("tmpFaces: ", tmpFaces);
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
  if (devmode) console.log("toggleCoords: ", toggleCoords);

  toggleCoords.forEach(([row, column]) => {
    if (devmode) console.log(`in .forEach: ${row}, ${column}`);
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