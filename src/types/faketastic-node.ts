import { ObjectTreeNode, ObjectTreeNodeType } from 'treelike';
import { Type, Types } from '../constants';

export interface FaketasticNode<T = any> extends ObjectTreeNode<T> {
  [Type]: typeof Types.FaketasticNode;

  /** Container nodes contain nested `Buildable`s within their value property. */
  isContainer: () => boolean;
  isBuildable: () => boolean;
  setValue: (value: any) => void;
  currentValue: () => T;
  currentType: () => ObjectTreeNodeType;
}
