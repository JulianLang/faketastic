import { ArchitectFn } from '../../architects';
import { ProcessorFn } from '../../processors';
import { TreeReaderFn } from '../../tree-reader';
import { AttachedFn, AttachedFnType } from '../../types';
import { extractFns } from '../../util';
import { AttachedFnSymbol, Buildable, BuildableSymbol } from '../types';

export function createBuildable<T>(tmpl: T, attachedFns: AttachedFn[] = []): Buildable<T> {
  const buildable: Buildable<any> = {
    [BuildableSymbol]: true,
    treeReaders: extractFns<symbol, AttachedFnType>(
      AttachedFnSymbol,
      attachedFns,
      'tree-reader',
    ) as TreeReaderFn[],
    architects: extractFns<symbol, AttachedFnType>(
      AttachedFnSymbol,
      attachedFns,
      'architect',
    ) as ArchitectFn[],
    processors: extractFns<symbol, AttachedFnType>(
      AttachedFnSymbol,
      attachedFns,
      'processor',
    ) as ProcessorFn[],
    value: tmpl,
  };

  return buildable;
}
