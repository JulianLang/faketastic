import { ArchitectFn } from '../../architects';
import { AttachedFn } from '../../types';
import { extractFns } from '../../util';
import { ArchitectFnSymbol, Buildable, ProcessorFn, ProcessorSymbol } from '../types';
import { template } from './template';

export function use<T extends object = object>(
  value: T,
  ...attachedFns: AttachedFn[]
): Buildable<T> {
  const tmpl: Buildable<T> = template(value);

  tmpl.processors = extractFns(ProcessorSymbol, attachedFns) as ProcessorFn[];
  tmpl.architects = extractFns(ArchitectFnSymbol, attachedFns) as ArchitectFn[];

  return tmpl;
}
