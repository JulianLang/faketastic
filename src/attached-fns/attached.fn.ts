import { ObjectTreeNode } from 'treelike';
import { MutationFnReadType, TimeOfExecution, Type, Types } from '../constants';
import { ExecutionTime } from './execution.time';
import { ReadType } from './read.type';

export interface ReaderFn {
  [Type]: typeof Types.ReaderFn;
  (node: ObjectTreeNode): void;
}

export interface ArchitectFn {
  [Type]: typeof Types.ArchitectFn;
  [MutationFnReadType]: ReadType;
  (value: any): any;
}

export interface ProcessorFn {
  [Type]: typeof Types.ProcessorFn;
  [TimeOfExecution]: ExecutionTime;
  [MutationFnReadType]: ReadType;
  (value: any): any;
}

export type AttachedFn = ReaderFn | ArchitectFn | ProcessorFn;
