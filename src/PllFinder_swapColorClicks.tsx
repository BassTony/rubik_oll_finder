// PllFinder.tsx
import React, { useState } from 'react';
import { PllSolutions, SolutionEntry } from './OllSolutions';
import SVGPoly, { mapNumberToColor, pllToggleFace } from './SVGPoly';
import { Solution } from './Solution';
import { PrettyObject } from './PrettyObject';

const devmode: boolean = true;

// a type to represent an array that has items that have two fields: the color and the sticner numbers that have that color
type ColorStickerArray = { color: number; stickers: number[]; };

const addNumberToColorStickerArray = (shape: ColorStickerArray[], color: number, numberToAdd: number): ColorStickerArray[] => {
  // if the color doesn't exist in the shape, add a new subarray for it and then add the number to the matching subarray
  const colorIndex = shape.findIndex(item => item.color === color);

  // remove sticker number from any other color first
  const newShape: ColorStickerArray[] = shape.map(item => {
    return { color: item.color, stickers: item.stickers.filter(num => num !== numberToAdd) };
  })
    // remove all empty sticker arrays
    .filter(item => item.stickers.length > 0);

  // if color is 8 (gray), do not add the number anywhere, just return the shape without it
  if (color === 8) {
    return newShape;
  }

  if (colorIndex === -1) {
    // color not found, add new
    return [...newShape, { color: color, stickers: [numberToAdd] }];
  } else {
    // color found, add number to existing
    return newShape.map((item, index) => {
      if (index === colorIndex) {
        return { color: item.color, stickers: [...item.stickers, numberToAdd].sort((a, b) => a - b) };
      }
      return item;
    });
  }

  return newShape;
};

const makeRotations = (shape: ColorStickerArray[]): ColorStickerArray[][] => {
  let rotations = [];
  // generate 4 numerical rotations, 1-12 in groups of 3
  let stickersCurrent = shape;
  for (let i = 0; i < 4; i++) {
    const newStickers: ColorStickerArray[] =
      stickersCurrent.map(({ color, stickers }) => {
        return { color, stickers: stickers.map(num => (num + 3) > 12 ? (num + 3 - 12) : (num + 3)).sort((a, b) => a - b) };
      }
      );
    stickersCurrent = newStickers;
    rotations = rotations.concat(swapPairs(newStickers));
  };
  // console.log('Rotations:', rotations);
  return rotations;
  // return [];
};

const swapPairs = (shape: ColorStickerArray[]): ColorStickerArray[][] => {
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
  if (shape.length === 2) {
    return [
      shape,
      [shape[1], shape[0]]
    ];
  }
  return [shape];
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
/* const addNumberToLastLayerColors = (shape: number[][], numberToAdd: number, index: number): number[][] => {
  if (shape.length <= index) shape.push([]);
  const newShape = shape.map((pair, i) => {
    if (i === index) {
      return [...pair, numberToAdd].sort((a, b) => a - b);
    }
    console.log(pair);
    return pair;
  });
  return newShape;
}; */

// just init faces with this.
const facesData = [
  [0, 0, 0, 0, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 0, 0, 0, 0,]
];

// main component of the revamped PllFinder. Aim is to click on edge stickers to cycle colors, and build the pattern from that.
const PllFinderSwapClicks: React.FC = () => {
  // const [selectedPll, setSelectedPll] = useState<number | null>(null);
  const [faces, setFaces] = useState(facesData);

  // const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   setSelectedPll(value ? parseInt(value) : null);
  // };

  // useState for keeping track of clicked pll sides
  const [lastLayerColors, setLastLayerColors] = useState<ColorStickerArray[]>([]);
  const [addIndex, setAddIndex] = useState<number>(0);
  // const [faces, setFaces] = useState(facesData);


  const resetLastLayerColorsAndIndex = () => {
    setLastLayerColors([]);
    setAddIndex(0);
    setFaces(facesData);
  };

  const pllToggleFaceCurried = (faces: number[][], rowIndex: number, colIndex: number) => {
    console.log("in pllToggleFaceCurried");

    // get the color of the clicked tile from faces
    const colorNum = getColorNumberOfClickedSticker(faces, rowIndex, colIndex);
    console.log(`Color number of clicked sticker: ${colorNum}`);

    if (colorNum === addIndex) {
      console.log("Clicked color is same as current addIndex color, adding the next color instead");
      setAddIndex((prevIndex) => (prevIndex + 1) % 7);
      return pllToggleFace(faces, rowIndex, colIndex, (addIndex + 1) % 7 + 2);
    }

    setLastLayerColors(prev =>
      addNumberToColorStickerArray(
        prev,
        addIndex + 2,
        getNumFromRowAndCol(rowIndex, colIndex),
      )
    );

    return pllToggleFace(faces, rowIndex, colIndex, addIndex + 2);
  };

  /*   const findSolutionByShape = (shape: number[][]): SolutionEntry => {
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
    }; */

  const findSolutionByShapeColored = (shape: ColorStickerArray[]): SolutionEntry => {
    const rotations = makeRotations(shape);
    console.log("Rotations made from shape: ", rotations);
    let rotationResult = { pattern: [], id: "", name: "NOT FOUND", algorithm: "NOT FOUND", shape: [[1]] };

    // find the matching "shape" in "rotations" and tell which rotation it is
    for (let i = 0; i < rotations.length; i++) {
      const rotation = rotations[i];
      const found = PllSolutions.find(pll => {
        return JSON.stringify(pll.shape) === JSON.stringify(rotation.map(({ stickers }) => stickers));
      });
      if (found) {
        rotationResult = found; // 'Found matching PLL for rotation ' + JSON.stringify(found);
      }
    }

    return rotationResult;
  };

  /*   const foo = (stickers: ColorStickerArray): void => {
      console.log("foo called: ", stickers);
    }; */


  // const test = [{ color: 2, stickers: [1, 2] }, { color: 3, stickers: [4, 6] }];
  // const result = PllSolutions.find( pll => {
  //   return JSON.stringify(pll.shape) === JSON.stringify(test);
  // });

  const result = findSolutionByShapeColored(lastLayerColors);


  const getColorNumberOfClickedSticker = (faces: number[][], rowIndex: number, colIndex: number): number => {
    const stickerNum = getNumFromRowAndCol(rowIndex, colIndex);
    for (let i = 0; i < faces.length; i++) {
      if (faces[i].includes(stickerNum)) {
        return i + 2; // color numbers start from 2
      }
    }
    return 8; // gray for not found
  };

  const logClickedStickerColor = (faces: number[][], rowIndex: number, colIndex: number): number[][] => {
    const colorNum = getColorNumberOfClickedSticker(faces, rowIndex, colIndex);
    console.log(`Clicked sticker at ${rowIndex}, ${colIndex} has color number: ${colorNum}`);
    return faces;
  };

  return (
    <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
      <h2>PLL Solution Finder</h2>
      <h3>Click on edge stickers to rotate colors. The last used color will be the new starting color.</h3>

      {/* TODO: for real speed entry, make side stickers larger and make clicking on them cycle colors. Then reconstitute the building of the pattern detection needle array to hold data about the color in each sub-array. */}

      <SVGPoly
        polyId={"clickable"}
        faces={faces}
        // clickFn={logClickedStickerColor}
        clickFn={pllToggleFaceCurried}
        setFacesFn={setFaces}
      />

      <button style={{ borderColor: '#000000', backgroundColor: mapNumberToColor(addIndex + 2), fontSize: "2rem", padding: "30px", margin: "20px" }} onClick={() => setAddIndex((prevIndex) => (prevIndex + 1) % 7)}>Next color: (current: {addIndex})</button>

      {devmode && <h4>Result:<br />{JSON.stringify(lastLayerColors) || "NOT FOUND"}</h4>}

      <h4>pretty</h4>
      <PrettyObject data={lastLayerColors} />


      <button style={{ padding: "30px", borderColor: "gray", margin: "10px" }} onClick={resetLastLayerColorsAndIndex}>Reset</button>

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

export default PllFinderSwapClicks;
