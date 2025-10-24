// Reduce Review

type Color = [number, number, number];

// Sample Reduce Implementation
function reduce<T, U>(a: T[], f: (acc: U, e: T) => U, init: U): U {
  let result = init;
  for (let i = 0; i < a.length; ++i) {
    result = f(result, a[i]);
  }
  return result;
}

// Example:

const arr = [3, 2, 6, 2, 2, 0];

const result = reduce(arr, (prod, e) => prod * e, 1);
// Alternatively: arr.reduce((prod, e) => prod * e, 1);

console.log(result);

// In class exercises

// Exercise 1
export function sumSquaresPositive(nums: number[]): number {
  // TODO: Implement this function
  const sum = reduce<number, number>(
    nums.filter(n => n > 0),
    (prev, cur) => prev + Math.sqrt(cur),
    0
  );
  return sum;
}

// Exercise 2
export function mainlyBlue(arr: Color[]): number {
  // TODO: Implement this function
  const isBlue = (c: Color) => (c[2] >= 2 * c[0] && c[2] >= 2 * c[1] ? 1 : 0);
  return arr.reduce((acc, c) => acc + isBlue(c), 0);
}

export function mainlyBlue2D(arr: Color[][]): number {
  // TODO: Implement this function
  return arr.reduce((acc, r) => acc + mainlyBlue(r), 0);
}
