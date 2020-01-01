import { ArchitectFn } from '../architects';
import { ProcessorFn } from '../processors';
import { TreeReaderFn } from '../tree-reader';
import { AttachedFn, AttachedFnType } from '../types';
import { extractFns } from '../util';
import { model } from './model';
import { AttachedFnSymbol, Buildable } from './types';

export function use<T extends object = object>(
  value: T,
  ...attachedFns: AttachedFn[]
): Buildable<T> {
  const mdl: Buildable<T> = model(value);

  mdl.treeReaders = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'tree-reader',
  ) as TreeReaderFn[];
  mdl.architects = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'architect',
  ) as ArchitectFn[];
  mdl.processors = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'processor',
  ) as ProcessorFn[];

  return mdl;
}
