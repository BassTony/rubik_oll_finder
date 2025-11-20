// PllFinder.tsx
import React, { useState } from 'react';
import { PllSolutions, SolutionEntry } from './OllSolutions';
import SVGPoly, { mapNumberToColor, pllToggleFace } from './SVGPoly';
import { Solution } from './Solution';

const devmode: boolean = true;

const makeRotations = (shape: number[][]): number[][][] => {
  let rotations: number[][][] = [];
  let currentShape = shape;
  // generate 4 numerical rotations, 1-12 in groups of 3
  for (let i = 0; i < 4; i++) {
    currentShape = currentShape.map(pair => pair.map(num => (num + 3) > 12 ? (num + 3 - 12) : (num + 3)).sort((a, b) => a - b));
    rotations = rotations.concat(swapPairs(currentShape));
  }
  // console.log('Rotations:', rotations);
  return rotations;
};



// const swapPairs = (shape: number[][]): number[][] => {
//   return shape.map(pair => [pair[1], pair[0]]);
// }
// swap the order of each pair in the shape e.g. [[1,2],[3,4]] => [[3,4],[1,2]], do all six permutations if there are three pairs: [[a,b],[c,d],[e,f]] => [[c,d],[e,f],[a,b]], [[e,f],[a,b],[c,d]]
const swapPairs = (shape: number[][]): number[][][] => {
  if (shape.length === 3) {
    return [
      [shape[1], shape[2], shape[0]],
      [shape[2], shape[0], shape[1]],
      [shape[0], shape[1], shape[2]],
      [shape[1], shape[0], shape[2]],
      [shape[2], shape[1], shape[0]],
      [shape[0], shape[2], shape[1]],
    ];
  }
  if (shape.length !== 2) return [shape]; // only swap if there are exactly 2 pairs
  return [shape, [shape[1], shape[0]]];
};

/* const testPatterns = [
  [[1, 3], [10, 11]],
  [[1, 3], [4, 5], [11, 12]],
  [[4, 5], [1, 3], [11, 12]],
  [[7, 8], [4, 6], [2, 3]],
  [[7, 8], [2, 3], [4, 6]],
  [[4, 6], [1, 2]]
]; */

// function to add one number as input to nested arrays in ascending order, parameter for the index of the nested array to add to
const addNumberToLastLayerColors = (shape: number[][], numberToAdd: number, index: number): number[][] => {
  if (shape.length <= index) shape.push([]);
  const newShape = shape.map((pair, i) => {
    if (i === index) {
      return [...pair, numberToAdd].sort((a, b) => a - b);
    }
    console.log(pair);
    return pair;
  });
  return newShape;
};

// just init faces with this.
const facesData = [
  [0, 0, 0, 0, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 0, 0, 0, 0,]
];



const PllFinder: React.FC = () => {
  // const [selectedPll, setSelectedPll] = useState<number | null>(null);
  const [faces, setFaces] = useState(facesData);

  // const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   setSelectedPll(value ? parseInt(value) : null);
  // };

  // useState for keeping track of clicked pll sides
  const [lastLayerColors, setLastLayerColors] = useState<number[][]>([]);
  const [addIndex, setAddIndex] = useState<number>(0);
  // const [faces, setFaces] = useState(facesData);


  const resetLastLayerColorsAndIndex = () => {
    setLastLayerColors([]);
    setAddIndex(0);
    setFaces(facesData);
  };

  const pllToggleFaceCurried = (faces: number[][], rowIndex: number, colIndex: number) => {
    console.log("in pllToggleFaceCurried");
    setLastLayerColors(addNumberToLastLayerColors(lastLayerColors, getNumFromRowAndCol(rowIndex, colIndex), addIndex));
    return pllToggleFace(faces, rowIndex, colIndex, addIndex + 2);
  };


  const findSolutionByShape = (shape: number[][]): SolutionEntry => {
    const rotations = makeRotations(shape);
    console.log("Rotations made from shape: " + JSON.stringify(rotations));
    let rotationResult = { pattern: [], id: "", name: "NOT FOUND", algorithm: "NOT FOUND", shape: [[1]] };
    
    // find the matching "shape" in "rotations" and tell which rotation it is
    for (let i = 0; i < rotations.length; i++) {
      const rotation = rotations[i];
      const found = PllSolutions.find(pll => {
        return JSON.stringify(pll.shape) === JSON.stringify(rotation);
      });
      if (found) {
        rotationResult = found; // 'Found matching PLL for rotation ' + JSON.stringify(found);
      }
    }

    return rotationResult;
  };


  const test = [[1, 2], [4, 6]];
  // const result = PllSolutions.find( pll => {
  //   return JSON.stringify(pll.shape) === JSON.stringify(test);
  // });

  const result = findSolutionByShape(lastLayerColors);

  return (
    <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
      <h2>PLL Solution Finder</h2>
      <h3>Click on the edge stickers to color them. First, color the 3-in-line edge if available. Then, color &apos;headlights&apos;. Then, color adjacent stickers. The order of colors doesn&apos;t change the outcome. This is built for speed entry.</h3>

      {/* TODO: for real speed entry, make side stickers larger and make clicking on them cycle colors. Then reconstitute the building of the pattern detection needle array to hold data about the color in each sub-array. */}
      {/* // Dropdown to select from testPatterns to testShape */}
{/*       <select onChange={(e) => {
        const value = e.target.value;
        if (value) {
          const shape = JSON.parse(value) as number[][];
          setLastLayerColors(shape);
        }
      }}>
        <option value="">Select a PLL Shape</option>
        {testPatterns.map((shapeTest, index) => (
          <option key={index} value={JSON.stringify(shapeTest)}>
            {shapeTest} - {JSON.stringify(shapeTest)}
          </option>
        ))}
      </select> */}

      {/* TODO: curry pllToggleFace to have a means to return the clicked segment OR the numeric value of */}
      <SVGPoly polyId={"clickable"} faces={faces} clickFn={pllToggleFaceCurried} setFacesFn={setFaces} />
      <button style={{ borderColor: '#000000', backgroundColor: mapNumberToColor(addIndex+2), fontSize: "2rem", padding: "30px", margin: "20px"}} onClick={() => setAddIndex((prevIndex) => (prevIndex + 1) % 7)}>Next color: (current: {addIndex})</button>

      {/* <p>{JSON.stringify(PllSolutions)}</p> */}
{/*       <p>faces:</p>
      <p>{JSON.stringify(faces)}</p> */}
      {devmode && <p>makeRotations(test): <br/>{JSON.stringify(makeRotations(test))}</p>}
      {/* <p>swapPairs(test): <br/>{JSON.stringify(swapPairs(test))}</p> */}
      {/* <h4>Name:<br />{JSON.stringify(result?.name || "Result name NOT FOUND")}</h4> */}
      {/* <h4>{JSON.stringify(result?.algorithm || "Algorithm NOT FOUND")}</h4> */}
      {/* <h4>RotationResult:<br/>{result || "NOT FOUND"}</h4> */}
      
      {/* ternary jsx expression */}


      {devmode && <h4>RotationResult:<br />{JSON.stringify(result) || "NOT FOUND"}</h4>}
      
      
      {/* <button onClick={() => setLastLayerColors((prevValue) => addNumberToLastLayerColors(prevValue, 1, addIndex))}>Add 1 to first pair</button>
      <button onClick={() => setLastLayerColors(addNumberToLastLayerColors(lastLayerColors, 3, addIndex))}>Add 3 to first pair</button>
      <button onClick={() => setLastLayerColors(addNumberToLastLayerColors(lastLayerColors, 3, addIndex))}>Add 3 to first pair</button> */}
      {/* increment addIndex button in a functional component way */}
      {/* <button onClick={() => setLastLayerColors(addNumberToLastLayerColors(lastLayerColors, 10, addIndex))}>Add 10 to second pair</button>
      <button onClick={() => setLastLayerColors(addNumberToLastLayerColors(lastLayerColors, 11, addIndex))}>Add 11 to second pair</button>
      <button onClick={() => console.log(addNumberToTestShape([], 7, 0))}>Add 7 to first pair</button> */}

      {/* resetbutton */}
      <button style={{padding: "30px", borderColor: "gray", margin: "10px"}} onClick={resetLastLayerColorsAndIndex}>Reset</button>

      {/* <h4>lastLayerColors: <br />{JSON.stringify(lastLayerColors)}</h4> */}

      {/* <p>Solution:</p> */}
      <Solution polyId={"solution"} solutions={[result]} faces={faces} />
      

    </div>
  );
};

function getNumFromRowAndCol(rowIndex: number, colIndex: number): number {
  // mapping of rowIndex and colIndex to PLL sticker numbers clockface numbers, starting from top left corner, going clockwise
  const mapping: { [key: string]: number; } = {
    "0,1": 1,
    "0,2": 2,
    "0,3": 3,
    "1,4": 4,
    "2,4": 5,
    "3,4": 6,
    "4,3": 7,
    "4,2": 8,
    "4,1": 9,
    "3,0": 10,
    "2,0": 11,
    "1,0": 12
  };
  const res = mapping[`${rowIndex},${colIndex}`] || (-1);
  console.log(res);
  return res;
}

export default PllFinder;
