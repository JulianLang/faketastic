import { Buildable, ProcessorFn } from '../types';
import { asBuildable } from '../util';

export function use<T extends object = object>(
  value: T,
  ...processors: ProcessorFn[]
): Buildable<T> {
  const tmpl: Buildable<T> = asBuildable(value);
  tmpl.processors = processors;

  return tmpl;
}
