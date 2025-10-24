import assert from "assert";
import { makeRepeat, makeChain } from "./lab.js";

function arrayFromIterator<T>(it: Iterator<T>): T[] {
  const values = [];
  let result = it.next();
  while (!result.done) {
    values.push(result.value);
    result = it.next();
  }
  return values;
}

function makeIterable<T>(vals: T[]): Iterable<T> {
  return {
    [Symbol.iterator]: () => {
      let idx = 0;
      return {
        next: () => {
          if (idx < vals.length) {
            return { done: false, value: vals[idx++] };
          }
          return { done: true, value: undefined };
        },
      };
    },
  };
}

describe("makeRepeat", () => {
  it("returns the correct sequence for positive N", () => {
    expect(arrayFromIterator(makeRepeat(3, 5))).toEqual([3, 3, 3, 3, 3]);
  });

  it("returns the correct sequence when N = 1", () => {
    expect(arrayFromIterator(makeRepeat(-3, 1))).toEqual([-3]);
  });

  it("returns an empty sequence for N = 0", () => {
    expect(arrayFromIterator(makeRepeat(1, 0))).toEqual([]);
  });

  it("iterator correctly terminates", () => {
    const iterator = makeRepeat(1, 2);
    expect(iterator.next().value === 1);
    expect(iterator.next().value === 1);
    for (let i = 6; i > 0; i--) {
      expect(iterator.next().done);
    }
  });

  it("iterator is iterable", () => {
    const iterator = makeRepeat("a", 2);
    for (const item of iterator) {
      expect(item === "a");
    }
  });
});

describe("makeChain", () => {
  it("returns the correct sequence for array of one iterable", () => {
    expect(arrayFromIterator(makeChain([[1, 2, 3]]))).toEqual([1, 2, 3]);
  });

  it("returns the correct sequence for array of more than one iterable", () => {
    expect(
      arrayFromIterator(
        makeChain([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ])
      )
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("returns the correct sequence for array with empty iterables at the start", () => {
    expect(arrayFromIterator(makeChain([[], ["a", "b", "c"]]))).toEqual(["a", "b", "c"]);
  });

  it("returns the correct sequence for array with empty iterables in the middle", () => {
    expect(arrayFromIterator(makeChain([["a", "b", "c"], [], ["d", "e"]]))).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("returns the correct sequence for array with empty iterables at the end", () => {
    expect(arrayFromIterator(makeChain([["a", "b"], [], ["c", "d"], []]))).toEqual(["a", "b", "c", "d"]);
  });

  it("returns the correct sequence for array with all empty iterables", () => {
    expect(arrayFromIterator(makeChain([[], [], []]))).toEqual([]);
  });

  it("returns the correct sequence for array with non-array iterables", () => {
    const iterables = [[1, 2], [], [3, 4, 5], [6], []].map(makeIterable);
    expect(arrayFromIterator(makeChain(iterables))).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("iterator terminates correctly", () => {
    const iterator = makeChain([[1, 2], [3]]);
    expect(iterator.next().value === 1);
    expect(iterator.next().value === 2);
    expect(iterator.next().value === 3);
    for (let i = 6; i > 0; i--) {
      expect(iterator.next().done);
    }
  });

  it("iterator is iterable", () => {
    const iterator = makeChain(["abc", "de", "fg"]);
    let i = 0;
    for (const item of iterator) {
      expect(item === "abcdefg"[i]);
    }
  });
});
