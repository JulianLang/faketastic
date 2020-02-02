import { Type, Types } from '../constants';
import { FaketasticNode } from '../types';
import { isDefined } from './is-defined';
import { getSymbol } from './symbols';

/**
 * Deteremines whether a given value is a `FaketasticNode`.
 * @param value The value to check if it is a `FaketasticNode`.
 * @returns `true` if the value is a `FaketasticNode`, `false` otherwise.
 */
export function isFaketasticNode(value: any): value is FaketasticNode {
  return isDefined(value) && getSymbol(Type, value) === Types.FaketasticNode;
}
