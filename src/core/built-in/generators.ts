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

// TODO: test this
export function randomItem(values: any[]): any {
  const index = randomIndex(values);

  return values[index];
}

// TODO: test this
export function randomIndex(values: any[]): number {
  return randomInt(0, values.length);
}

export function probability(n: number): boolean {
  if (n === 1) {
    return true;
  } else if (n === 0) {
    return false;
  }

  return !!n && Math.random() <= n;
}
