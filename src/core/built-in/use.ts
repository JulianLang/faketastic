import { Buildable, ProcessorFn } from '../types';
import { template } from './template';

export function use<T extends object = object>(
  value: T,
  ...processors: ProcessorFn[]
): Buildable<T> {
  const tmpl: Buildable<T> = template(value);
  tmpl.processors = processors;

  return tmpl;
}
