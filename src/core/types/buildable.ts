import { ArchitectFn } from '../../architects/types';
import { ReadonlyFn } from '../../readonly';
import { ProcessorFn } from './processor.fn';

export const BuildableSymbol = Symbol('Buildable');
export interface Buildable<T = any> {
  [BuildableSymbol]: boolean;
  value: T;
  processors: ProcessorFn[];
  architects: ArchitectFn[];
  readonlys: ReadonlyFn[];
}
