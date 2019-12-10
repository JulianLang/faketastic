import { ArchitectFn } from '../../architects/types';
import { ProcessorFn } from '../../processors/types';
import { TreeReaderFn } from '../../tree-reader';

export const BuildableSymbol = Symbol('Buildable');
export interface Buildable<T = any> {
  [BuildableSymbol]: boolean;
  value: T;
  processors: ProcessorFn[];
  architects: ArchitectFn[];
  treeReaders: TreeReaderFn[];
}
