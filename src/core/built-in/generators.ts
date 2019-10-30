export function random(min = 1, max = 10): number {
  const result = Math.random() * max + min;

  if (result <= min) {
    return min;
  } else if (result >= max) {
    return max;
  } else {
    return result;
  }
}

export function randomInt(min = 1, max = 10): number {
  // https://stackoverflow.com/a/1527820/3063191
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function probability(n: number): boolean {
  if (n === 1) {
    return true;
  } else if (n === 0) {
    return false;
  }

  return !!n && Math.random() <= n;
}
