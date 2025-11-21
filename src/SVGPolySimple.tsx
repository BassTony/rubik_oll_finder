import React from 'react';

const devmode = false;

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

/* const mapNumberToColorName = (n: number) => {
  switch (n) {
    case 1: return polyStyleYellow.fill;
    case 2: return polyStyleRed.fill;
    case 3: return polyStyleGreen.fill;
    case 4: return polyStyleOrange.fill;
    case 5: return polyStyleBlue.fill;
    case 6: return polyStyleWhite.fill;
  }
  return polyStyleInactive.fill;
}; */

const mkRubikPolyTransforms = () => {
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

const polyTransforms = mkRubikPolyTransforms();

export const SVGPolySimple = ({ polyId, faces, clickFn }: {
  polyId: string, 
  faces: number[][], 
  clickFn: (faces: number[][], row: number, col: number, color: number) => void;
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
                <rect id={key_id} x="0" y="0" width="150" height="150" style={(mapNumberToPolyStyleColored(faces[c[0]][c[1]]))} onClick={() => { if (devmode) console.log("in onClick"); (clickFn(faces, c[0], c[1], faces[c[0]][c[1]])); }} />
                {/* <rect id={key_id} x="792.998" y="550.874" width="138" height="138" style={(mapNumberToPolyStyle(faces[c[0]][c[1]]))} onClick={() => { console.log("in onClick"); setFacesFn(clickFn(faces, c[0], c[1])); }} /> */}
              </g>
            );
          })}
        </g>
      </svg>

    </div>
  );
};

export default SVGPolySimple;