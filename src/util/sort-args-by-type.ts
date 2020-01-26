import { isAttachedFn } from '../attached-fns/util/is-attached.fn';
import { SortedArguments } from '../types';

export function sortArgsByType(args: any): SortedArguments {
  const result: SortedArguments = { args, attachedFns: [] };

  for (const argKey of Object.keys(args)) {
    const arg = args[argKey];

    if (isAttachedFn(arg)) {
      result.attachedFns.push(arg);
      delete result.args[argKey];
    }
  }

  return result;
}
