import { randomInt } from './random-int-value.fn';
import { randomItem } from './random-item-value.fn';

export function randomItems(
  values: any[],
  min = 2,
  max = values.length,
  allowDuplicates = true,
): any[] {
  checkArguments(values, min, max, allowDuplicates);

  const result: any[] = [];
  const targetItemCount = randomInt(min, max);

  for (let i = 0; i < targetItemCount; i++) {
    const item = randomItem(values)!;

    if (allowDuplicates || !result.includes(item)) {
      result.push(item);
    } else {
      // try again:
      i -= 1;
    }
  }

  return result;
}

function checkArguments(values: any[], min: number, max: number, allowDuplicates: boolean) {
  if (values.length === 0) {
    throw new Error(`faketastic: "randomItems" can only operate on non-empty arrays.`);
  }

  if (min < 0 || max < 0) {
    throw new Error(
      `faketastic: the min-argument ("${min}") and max-argument ("${max}") must be a non-negative number.`,
    );
  }

  if (min > values.length && !allowDuplicates) {
    throw new Error(
      `faketastic: Options for "randomItems" are impossible to meet as "minItems" > "values.length" and` +
        `duplicates are not allowed in results.`,
    );
  }

  if (min > max) {
    throw new Error(
      `faketastic: Options for "randomItems" are impossible to meet as "minItems" (${min})` +
        `is greater than "maxItems" (${max}).`,
    );
  }
}
