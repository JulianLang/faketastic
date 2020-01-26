import { ObjectTreeNode } from 'treelike';
import { Type, Types } from '../../constants';
import { Func } from '../../types';
import { setSymbol } from '../../util';
import { ReaderFn } from '../attached.fn';

/**
 * Marks a given function as faketastic-`ReaderFn`.
 * @param fn The function to mark as `ReaderFn`.
 */
export function createReaderFn(fn: Func<[ObjectTreeNode], void>): ReaderFn {
  return setSymbol(Type, fn, Types.ReaderFn);
}
