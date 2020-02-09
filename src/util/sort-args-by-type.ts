import { isAttachedFn } from '../attached-fns/util/is-attached.fn';
import { SortedArguments } from '../types';

export function sortArgsByType<T>(args: T): SortedArguments<Partial<T>> {
  const result: SortedArguments = { args, attached: [] };

  for (const argKey of Object.keys(args)) {
    const arg = (args as any)[argKey];

    if (isAttachedFn(arg)) {
      result.attached.push(arg);
      delete result.args[argKey];
    }
  }

  return result;
}
