import { arrayToList, listToArray } from "../include/lists.js";
import * as lab from "./lab.js";

describe("merge", () => {
  it("merges two lists of equal length correctly [UNCREDITED]", () => {
    const input_list_1 = arrayToList([-5, -3, 0, 2, 4]);
    const input_list_2 = arrayToList([-4, -2, 1, 3, 5]);
    const expected_output = [-5, -4, -3, -2, 0, 1, 2, 3, 4, 5];
    const output = listToArray(lab.merge(input_list_1, input_list_2));
    expect(output).toStrictEqual(expected_output);
  });

  it("merges two lists of different length correctly [UNCREDITED]", () => {
    const input_list_1 = arrayToList([-5, -3, 0, 2, 4, 6, 7]);
    const input_list_2 = arrayToList([-4, -2, 1, 3, 5]);
    const expected_output = [-5, -4, -3, -2, 0, 1, 2, 3, 4, 5, 6, 7];
    const output = listToArray(lab.merge(input_list_1, input_list_2));
    expect(output).toStrictEqual(expected_output);
  });

  it("merges two identical lists correctly [UNCREDITED]", () => {
    const input_list_1 = arrayToList([-5, -3, 0, 2, 4, 6, 7]);
    const input_list_2 = arrayToList([-5, -3, 0, 2, 4, 6, 7]);
    const expected_output = [-5, -5, -3, -3, 0, 0, 2, 2, 4, 4, 6, 6, 7, 7];
    const output = listToArray(lab.merge(input_list_1, input_list_2));
    expect(output).toStrictEqual(expected_output);
  });
});

describe("sumPositivesAndNegatives", () => {
  it("Works corredctly [UNCREDITED]", () => {
    const input = [-5, 0, 2, 100, 20, -43, 12, -10, 0];
    const expected_output = [134, -58];
    const output = lab.sumPositivesAndNegatives(input);
    expect(output).toStrictEqual(expected_output);
  });
});

describe("reverseFilter", () => {
  it("Works correctly [UNCREDITED]", () => {
    const input = arrayToList([-2, -1, 0, 1, 2]);
    const expected_output = [2, 1, 0];
    const output = listToArray(lab.reverseFilter(input, e => e >= 0));
    expect(output).toStrictEqual(expected_output);
  });
});
