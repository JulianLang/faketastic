/**
 * Returns true with a given probability.
 * @param n A bias / probability that the value is `true`.
 */
export function probability(n: number): boolean {
  if (n === 1) {
    return true;
  } else if (n === 0) {
    return false;
  }

  return !!n && Math.random() <= n;
}
