import { Type } from '../constants';
import { AttachedFn } from '../types';

/**
 * `Buildable`s are objects summarizing all important information for building data out of models.
 * `Buildable`s have a `value`-property that can either be a static value or a `Buildable` again.
 */
export interface Buildable<T = any> {
  [Type]: string;
  /** The current value of the `Buildable`. Can be either a static value, a `BuilderFn` or a `Buildable`. */
  value: T;
  /** The `AttachedFn`s associated with this `Buildable`. */
  attachedFns: AttachedFn[];
}
