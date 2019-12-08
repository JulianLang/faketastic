import { randomInt } from '../../core';

/**
 * Recursion iterator terminating a recursion when it reached a random depth being in a specified range.
 * @param min The minimal depth level.
 * @param max The maximal depth level.
 */
export function RecursionDepth(min = 1, max = 10) {
  let currentDepth = 0;
  let targetDepth = randomInt(min, max);

  return () => {
    currentDepth += 1;
    const shouldBreakRecursion = currentDepth > targetDepth;

    return shouldBreakRecursion ? { endWithValue: [] } : { continue: true };
  };
}
