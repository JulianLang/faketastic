import { ArchitectFn } from '../../architects/types';
import { TreeReaderFn } from '../../tree-reader';
import { ProcessorFn } from './processor.fn';

export const BuildableSymbol = Symbol('Buildable');
export interface Buildable<T = any> {
  [BuildableSymbol]: boolean;
  value: T;
  processors: ProcessorFn[];
  architects: ArchitectFn[];
  treeReaders: TreeReaderFn[];
}
