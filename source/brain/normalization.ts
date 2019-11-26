export default class Scaler {
  public array: number[] | number[][] | number[][][];

  private min: number;
  private max: number;

  constructor(array: number[] | number[][] | number[][][]) {
    this.array = array;

    this.min = Math.min(...this.array.flat(Infinity));
    this.max = Math.max(...this.array.flat(Infinity));
  }

  public normalize1d(array = this.array as number[]): number[] {
    return array.map(
      (value: number) => (value - this.min) / (this.max - this.min)
    );
  }

  public normalize2d(array = this.array as number[][]): number[][] {
    return array.map((depthOne: number[]) =>
      depthOne.map(
        (value: number) => (value - this.min) / (this.max - this.min)
      )
    );
  }

  public normalize3d(array = this.array as number[][][]): number[][][] {
    return array.map((depthOne: number[][]) =>
      depthOne.map((depthTwo: number[]) =>
        depthTwo.map(
          (value: number) => (value - this.min) / (this.max - this.min)
        )
      )
    );
  }

  public denormalize1d(array: number[]): number[] {
    return array.map(
      (value: number) => value * (this.max - this.min) + this.min
    );
  }

  public denormalize2d(array: number[][]): number[][] {
    return array.map((depthOne: number[]) =>
      depthOne.map((value: number) => value * (this.max - this.min) + this.min)
    );
  }

  public denormalize3d(array: number[][][]): number[][][] {
    return array.map((depthOne: number[][]) =>
      depthOne.map((depthTwo: number[]) =>
        depthTwo.map(
          (value: number) => value * (this.max - this.min) + this.min
        )
      )
    );
  }
}
