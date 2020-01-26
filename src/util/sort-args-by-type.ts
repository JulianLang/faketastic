import { isAttachedFn } from '../attached-fns/util/is-attached.fn';
import { SortedArguments } from '../types';

export function sortArgsByType(args: any): SortedArguments {
  const result: SortedArguments = { args, attached: [] };

  for (const argKey of Object.keys(args)) {
    const arg = args[argKey];

    if (isAttachedFn(arg)) {
      result.attached.push(arg);
      delete result.args[argKey];
    }
  }

  return result;
}
