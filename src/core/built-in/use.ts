import { ProcessorFn } from '../types';
import { build } from './build';
import { template } from './template';

export function use<T extends object = object>(value: T, ...processors: ProcessorFn[]): T {
  const tmpl = template(value);
  tmpl.processors = processors;

  return build(tmpl);
}
