import { ObjectTreeNode, ObjectTreeNodeType } from 'treelike';
import { Buildable } from '../buildable';
import { Type, Types } from '../constants';

export interface FaketasticNode<T = any> extends ObjectTreeNode<T> {
  [Type]: typeof Types.FaketasticNode;

  /** Container nodes contain nested `Buildable`s within their value property. */
  isContainer: () => boolean;
  isBuildable: () => this is FaketasticNode<Buildable>;
  isRefDependent: () => boolean;
  setValue: (value: any) => void;
  getValue: () => T;
  currentType: () => ObjectTreeNodeType;
}
