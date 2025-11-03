import React from 'react';
import { SolutionEntry } from './OllSolutions';
import SVGPoly from './SVGPoly';

export const Solution = ({ polyId, solutions, faces }: { polyId: string, solutions: SolutionEntry[], faces: number[][]; }) => {
  // rotating an array 90 degrees clockwise
  function rotateArray90(array: Array<Array<number>>): Array<Array<number>> {
    const n = array.length;
    const newArray = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newArray[j][n - 1 - i] = array[i][j];
      }
    }
    return newArray;
  }
  
  const f90 = rotateArray90(faces);
  const f180 = rotateArray90(f90);
  const f270 = rotateArray90(f180);
  const rotations = [faces, f90, f180, f270];

  // if any of the first elements in rotations has same content than i[0], make it the solution
  const solution = solutions.find((i) => {
    return rotations.some((r) => {
      return r.every((row, rowIndex) => {
        return row.every((cell, cellIndex) => {
          return cell === i?.pattern?.[rowIndex]?.[cellIndex];
        });
      });
    });
  });

  console.log("Found solution: ", solution?.name);

  const solution_ = solutions.length === 1 ? solutions[0] : solution;
  console.log("Rendering solution: ", solution_?.name);

  if (!solution_) return null;


  return (
    <>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <h2>Solution for {solution_?.name} ({solution_?.id}):<br />
          {solution_ ? solution_.algorithm : `no solutions!`}</h2>
      </div>
      <SVGPoly polyId={polyId} faces={solution_?.pattern} clickFn={(/* _faces: number[][], _row: number, _col: number */) => []} setFacesFn={() => []} />
    </>
  );
};
