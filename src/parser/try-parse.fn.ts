import { Nullable } from '../types';
import { isDefined } from '../util';
import { ParserFn } from './types';

/**
 * Tries to parse the given input with specified, suitable parser functions. Returns the result of the
 * first parser function that did not return `null` (so parser function order might be important).
 * If none of the parser funciton were able to return a non-`null` result, `tryParse` will also return null.
 */
export function tryParse<T, K, R>(parserFns: ParserFn<T, K, R>[], input: T, opts?: K): Nullable<R> {
  for (const parser of parserFns) {
    const result = parser(input, opts);

    if (isDefined(result)) {
      return result;
    }
  }

  if (parserFns.length === 0) {
    console.warn(
      `faketastic: Called tryParse for input "${input}" without providing any parser functions. ` +
        `This might be done by mistake, since calling tryParse like that will always return null.`,
    );
  }

  return null;
}
