import { AttachedFn } from '../attached-fns';
import { isAttachedFn } from '../attached-fns/util/is-attached.fn';
import { SortedArguments } from '../types';

type AttachableArgument<T> = { [P in keyof T]: T[P] | AttachedFn };

export function sortArgsByType<T>(args: AttachableArgument<T>): SortedArguments<Partial<T>> {
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
