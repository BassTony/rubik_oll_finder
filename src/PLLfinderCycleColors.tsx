import React, { useState } from 'react';
import SVGPolySimple from './SVGPolySimple';
// import PrettyObject from './PrettyObject';
import { Solution } from './Solution';
import { PllSolutions, SolutionEntry } from './OllSolutions';

const devmode: boolean = false;

const facesInit = [
  [0, 0, 0, 0, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 1, 1, 1, 0,],
  [0, 0, 0, 0, 0,]
];

type ColorStickerArray = { color: number; stickers: number[]; };

const addNumberToColorStickerArray = (shape: ColorStickerArray[], color: number, numberToAdd: number): ColorStickerArray[] => {
  // if the color doesn't exist in the shape, add a new subarray for it and then add the number to the matching subarray

  // remove sticker number from any other color first
  const newShape: ColorStickerArray[] = shape.map(item => {
    return { color: item.color, stickers: item.stickers.filter(num => num !== numberToAdd) };
  })
    // remove all empty sticker arrays
    .filter(item => item.stickers.length > 0);

  // if color is 0 (gray), do not add the number anywhere, just return the shape without it
  if (color === 0) {
    return newShape;
  }

  const colorIndex = newShape.findIndex(item => item.color === color);
  if (colorIndex === -1) { // color not found, add new
    return [...newShape, { color: color, stickers: [numberToAdd] }];
  } else { // color found, add number to existing
    return newShape.map((item, index) => {
      if (index === colorIndex) {
        return { color: item.color, stickers: [...item.stickers, numberToAdd].sort((a, b) => a - b) };
      }
      return item;
    });
  }

  return newShape;
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
  if (devmode) console.log(res);
  return res;
}

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

// the cube is just drawn here. when it is clicked, the clickFn retrieves information about the click, then the facesChanger function is called to make changes to the faces array and also to the lastLayerColors array
const PLLfinderCycleColors = () => {
  // Your component logic here
  if (devmode) console.log("CubeClickLogic component rendered");
  const [faces, setFaces] = React.useState(facesInit);
  const [lastLayerColors, setLastLayerColors] = useState<ColorStickerArray[]>([]);
  const [lastClickedColor, setLastClickedColor] = useState<number>(2);

  const getNextColorNum = (currentColorNum: number, lastClickedColor: number): number => {
    if (currentColorNum === 0) {
      return lastClickedColor; // if current is 0 (no color), set to 2 (first color)
    }

    const maxColorNum = 6; // assuming colors are numbered from 0 to 6
    // forbidden colors: white, yellow
    // set newColorNum to next color, omitting 1 and 6
    let newColorNum = currentColorNum;
    do {
      newColorNum = (newColorNum + 1) % (maxColorNum + 1);
    } while (newColorNum === 1 || newColorNum === 6);

    // const newColorNum = (currentColorNum + 1) % (maxColorNum + 1);
    setLastClickedColor(newColorNum === 0 ? 2 : newColorNum);
    return newColorNum;
  };

  // function to increment color number in a cycle when a face is clicked
  const incrementColorNumCycle = (facesArray: number[][], rowIndex: number, colIndex: number, currentColorNum: number, lastClickedColor: number): number[][] => {
    const newColorNum = getNextColorNum(currentColorNum, lastClickedColor);
    if (devmode) console.log(`incrementColorNumCycle: Changing color at (${rowIndex}, ${colIndex}) from ${currentColorNum} to ${newColorNum}`);
    const newFaces = facesArray.map((row, i) => {
      if (i === rowIndex) {
        return row.map((cell, j) => {
          if (j === colIndex) {
            return newColorNum;
          }
          return cell;
        });
      }
      return row;
    });

    setLastLayerColors(prev =>
      addNumberToColorStickerArray(
        prev,
        newColorNum,
        getNumFromRowAndCol(rowIndex, colIndex),
      )
    );

    setFaces(newFaces);
    return newFaces;
  };

  const clickSticker = (faces: number[][], row: number, col: number, color: number) => {
    if (devmode) console.log(`CubeClickLogic clickFn called with row: ${row}, col: ${col}, color was: ${color}`);

    // ignore clicks to the center 3x3 area
    if (row > 0 && row < 4 && col > 0 && col < 4) {
      if (devmode) console.log("Click ignored, center area");
      return faces;
    }

    const newFaces = incrementColorNumCycle(faces, row, col, color, lastClickedColor);
    return newFaces; // Return the updated faces array here

  };

  const findSolutionByShapeColored = (shape: ColorStickerArray[]): SolutionEntry => {
    const rotations = makeRotations(shape);

    // if devmode is true, log rotations
    if (devmode) console.log("Rotations made from shape: ", JSON.stringify(rotations));

    // devmode ? console.log("Rotations made from shape: ", rotations) : null;
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

  const result = findSolutionByShapeColored(lastLayerColors);


  return (
    <>
      <h2>PLL finder (click side stickers to color, click again to cycle color)</h2>
      <SVGPolySimple
        polyId="rubik_cube"
        faces={faces}
        clickFn={clickSticker}
      />
      {/* button to reset faces to initial state */}
      <button style={{ width: "150px", fontSize: "20pt", borderColor: "gray" }} onClick={() => { setFaces(facesInit); setLastLayerColors([]); setLastClickedColor(2); if (devmode) console.log("Faces reset to initial state"); }}>Reset</button>
      <Solution polyId={"solution"} solutions={[result]} faces={faces} />

      {/* <PrettyObject data={lastLayerColors} /> */}
    </>
  );
};

export default PLLfinderCycleColors;