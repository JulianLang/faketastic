import { ArchitectFn } from '../../architects/types/architect.fn';
import { ProcessorFn } from '../../processors/types/processor.fn';
import { TreeReaderFn } from '../../tree-reader/types/tree-reader.fn';
import { AttachedFn } from '../../types/attached.fn';
import { AttachedFnType } from '../../types/attached.fn.type';
import { extractFns } from '../../util/symbol-fns/extract.fns';
import { Buildable, BuildableSymbol } from '../types/buildable';
import { AttachedFnSymbol } from '../types/symbols';

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
