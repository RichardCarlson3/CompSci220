// Exercise 1: Closures
export function mostTrue<T>(funarr: ((arg: T) => boolean)[]): (arg: T) => boolean {
  // TODO: Implement this function
  return (x: T) => funarr.reduce((acc, e) => (e(x) ? acc + 1 : acc - 1), 0) > 0;
}

// Exercise 2: Mental Models (see slides)

// Exercise 3: More Closures
export function approxE(): () => number {
  // TODO: Implement this function
  let n = 1;
  let factorial = 1;
  let res = 1;
  return () => {
    factorial *= n++;
    return (res += 1 / factorial);
  };
}
