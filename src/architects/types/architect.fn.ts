import { ObjectTreeNode } from 'treelike';
import { MutatingFn } from '../../types';

export interface ArchitectFn extends MutatingFn {
  (node: ObjectTreeNode): void;
}
