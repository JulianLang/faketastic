import { AttachedFn } from '../attached-fns';
import { Type } from '../constants';
import { AnyObject } from '../types';

/**
 * `Buildable`s are objects summarizing all important information for building data out of models.
 * `Buildable`s have a `value`-property that can either be a static value or a `Buildable` again.
 */
export interface Buildable<T = any> {
  [Type]: string;
  /** The current value of the `Buildable`. Can be either a static value, a `ValueFn` or a `Buildable`. */
  value: T;
  /** The `AttachedFn`s associated with this `Buildable`. */
  attachedFns: AttachedFn[];
  /**
   * Property store that to be used by attached functions. This object can possibly have any property.
   * To avoid naming clashes it is considered good practice to prefix the properties you set to the store.
   */
  attachedProperties: AnyObject;
}
