import { ObjectTreeNode } from 'treelike';
import { TimeOfExecution, Type, Types } from '../constants';
import { ExecutionTime } from './execution.time';

export interface ReaderFn {
  [Type]: typeof Types.ReaderFn;
  (node: ObjectTreeNode): void;
}

export interface ArchitectFn {
  [Type]: typeof Types.ArchitectFn;
  (value: any): any;
}

export interface ProcessorFn {
  [Type]: typeof Types.ProcessorFn;
  [TimeOfExecution]: ExecutionTime;
  (value: any): any;
}

export type AttachedFn = ReaderFn | ArchitectFn | ProcessorFn;
