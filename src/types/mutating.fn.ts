import { FnOrderSymbol } from '../core';
import { AttachedFn } from './attached.fn';

export interface MutatingFn extends AttachedFn {
  [FnOrderSymbol]: number;
}
