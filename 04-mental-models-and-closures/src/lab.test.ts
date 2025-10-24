import { mostTrue, approxE } from "./lab.js";

describe("approxE", () => {
  it("should return correct results", () => {
    const e = approxE();
    let factorial = 1,
      approx = 1;
    for (let i = 1; i < 20; i++) {
      factorial *= i;
      approx += 1 / factorial;
      expect(e()).toBe(approx);
    }
  });

  it("should be able to create multiple distinct closures", () => {
    const a1 = approxE();
    const a2 = approxE();
    a2();
    expect(a1()).toBe(2);
    expect(a2()).toBe(2.5);
  });
});

describe("mostTrue", () => {
  it("every function in the input is called once when the returned closure is called", () => {
    const input = [
      jest.fn((_x: number) => true),
      jest.fn((_x: number) => true),
      jest.fn((_x: number) => true),
      jest.fn((_x: number) => true),
      jest.fn((_x: number) => true),
    ];
    const output = mostTrue(input);
    output(0);
    input.forEach(fn => {
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  it("empty array as input returns a closure that always returns false", () => {
    const input: ((x: number) => boolean)[] = [];
    const output = mostTrue(input);
    const result = output(1);
    expect(result).toBe(false);
  });

  it("if all functions in input return false, closure returns false", () => {
    const input = [
      (x: boolean) => typeof x === "number",
      (x: boolean) => typeof x === "number",
      (x: boolean) => typeof x === "number",
    ];
    const output = mostTrue(input);
    const result = output(true);
    expect(result).toBe(false);
  });

  it("if all functions in input return true, closure returns true", () => {
    const input = [
      (x: boolean) => typeof x === "boolean",
      (x: boolean) => typeof x === "boolean",
      (x: boolean) => typeof x === "boolean",
    ];
    const output = mostTrue(input);
    const result = output(true);
    expect(result).toBe(true);
  });

  it("possible to create multiple closures and call them multiple times", () => {
    const input_1 = [(x: string) => x.length > 4];
    const input_2 = [(x: number) => x % 2 === 0];
    const output_1 = mostTrue(input_1);
    const output_2 = mostTrue(input_2);
    const result_1_a = output_1("abc");
    const result_2_a = output_2(2);
    const result_1_b = output_1("abcdef");
    const result_2_b = output_2(0.5);
    expect(result_1_a).toBe(false);
    expect(result_1_b).toBe(true);
    expect(result_2_a).toBe(true);
    expect(result_2_b).toBe(false);
  });
});
