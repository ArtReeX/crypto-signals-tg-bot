const normalize1d = (array: number[], scale: [number, number]): number[] =>
  array.map(value => (value - scale[0]) / (scale[1] - scale[0]));

const normalize2d = (array: number[][], scale: [number, number]): number[][] =>
  array.map(depthOne =>
    depthOne.map(value => (value - scale[0]) / (scale[1] - scale[0]))
  );

const normalize3d = (
  array: number[][][],
  scale: [number, number]
): number[][][] =>
  array.map(depthOne =>
    depthOne.map(depthTwo =>
      depthTwo.map(value => (value - scale[0]) / (scale[1] - scale[0]))
    )
  );

const denormalize1d = (array: number[], scale: [number, number]): number[] =>
  array.map(value => value * (scale[1] - scale[0]) + scale[0]);

const denormalize2d = (
  array: number[][],
  scale: [number, number]
): number[][] =>
  array.map(depthOne =>
    depthOne.map(value => value * (scale[1] - scale[0]) + scale[0])
  );

const denormalize3d = (
  array: number[][][],
  scale: [number, number]
): number[][][] =>
  array.map(depthOne =>
    depthOne.map(depthTwo =>
      depthTwo.map(value => value * (scale[1] - scale[0]) + scale[0])
    )
  );

const scale1d = (array: number[]): [number, number] => [
  Math.min(...array),
  Math.max(...array)
];

const scale2d = (array: number[][]): [number, number] => {
  let minGlobal = 0;
  let maxGlobal = 0;

  for (let depthOne of array) {
    const minLocal = Math.min(...depthOne);
    const maxLocal = Math.max(...depthOne);

    if (minLocal < minGlobal) {
      minGlobal = minLocal;
    }
    if (maxLocal > maxGlobal) {
      maxGlobal = maxLocal;
    }
  }

  return [minGlobal, maxGlobal];
};

const scale3d = (array: number[][][]): [number, number] => {
  let minGlobal = 0;
  let maxGlobal = 0;

  for (let depthOne of array) {
    for (let depthTwo of depthOne) {
      const minLocal = Math.min(...depthTwo);
      const maxLocal = Math.max(...depthTwo);

      if (minLocal < minGlobal) {
        minGlobal = minLocal;
      }
      if (maxLocal > maxGlobal) {
        maxGlobal = maxLocal;
      }
    }
  }

  return [minGlobal, maxGlobal];
};

export default {
  normalize1d,
  normalize2d,
  normalize3d,
  denormalize1d,
  denormalize2d,
  denormalize3d,
  scale1d,
  scale2d,
  scale3d
};
