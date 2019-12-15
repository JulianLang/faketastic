import { ObjectTreeNode } from 'treelike';
import { AttachedFn } from '../../types';

export interface TreeReaderFn extends AttachedFn {
  (node: ObjectTreeNode): void;
}
