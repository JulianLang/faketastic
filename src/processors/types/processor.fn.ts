import { ObjectTreeNode } from 'treelike';
import { FnIsStickySymbol } from '../../core/types';
import { MutatingFn } from '../../types';

export interface ProcessorFn extends MutatingFn {
  [FnIsStickySymbol]: boolean;
  (node: ObjectTreeNode): void;
}
