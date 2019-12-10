import { ArchitectFn } from '../../architects';
import { ProcessorFn, ProcessorFnSymbol } from '../../processors';
import { TreeReaderFn, TreeReaderFnSymbol } from '../../tree-reader';
import { AttachedFn } from '../../types';
import { extractFns } from '../../util';
import { ArchitectFnSymbol, Buildable, BuildableSymbol } from '../types';

export function createBuildable<T>(tmpl: T, attachedFns: AttachedFn[] = []): Buildable<T> {
  const buildable: Buildable<any> = {
    [BuildableSymbol]: true,
    processors: extractFns(ProcessorFnSymbol, attachedFns) as ProcessorFn[],
    architects: extractFns(ArchitectFnSymbol, attachedFns) as ArchitectFn[],
    treeReaders: extractFns(TreeReaderFnSymbol, attachedFns) as TreeReaderFn[],
    value: tmpl,
  };

  return buildable;
}
