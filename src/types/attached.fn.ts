import { ObjectTreeNode } from 'treelike';
import { Type, Types } from '../constants';

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
  (value: any): any;
}

export type AttachedFn = ReaderFn | ArchitectFn | ProcessorFn;
