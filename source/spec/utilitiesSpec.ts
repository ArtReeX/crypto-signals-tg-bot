import "jasmine";
import { sma, ema, differenceInPercent } from "../utilities";

describe("utilities", () => {
  it("sma", () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = [2, 3, 4, 5, 6, 7, 8, 9];

    expect(sma(values, 3)).toEqual(result);
  });

  it("ema", () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = [2, 3, 4, 5, 6, 7, 8, 9];

    expect(ema(values, 3)).toEqual(result);
  });

  it("differenceInPercent", () => {
    expect(differenceInPercent(1, 2)).toBe(-100);
    expect(differenceInPercent(2, 1)).toBe(100);
    expect(differenceInPercent(1, 1)).toBe(0);
  });
});
