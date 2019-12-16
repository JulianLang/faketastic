import { ArchitectFn } from '../architects';
import { ProcessorFn } from '../processors';
import { TreeReaderFn } from '../tree-reader';
import { AttachedFn, AttachedFnType } from '../types';
import { extractFns } from '../util';
import { template } from './template';
import { AttachedFnSymbol, Buildable } from './types';

export function use<T extends object = object>(
  value: T,
  ...attachedFns: AttachedFn[]
): Buildable<T> {
  const tmpl: Buildable<T> = template(value);

  tmpl.treeReaders = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'tree-reader',
  ) as TreeReaderFn[];
  tmpl.architects = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'architect',
  ) as ArchitectFn[];
  tmpl.processors = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'processor',
  ) as ProcessorFn[];

  return tmpl;
}
