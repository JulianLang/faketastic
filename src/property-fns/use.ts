import { AttachedFn } from '../attached-fns';
import { asBuildable, Buildable } from '../buildable';
import { model } from './model';

/**
 * Uses a model any allows to manipulate
 * @param mdl The model to use.
 * @param attachedFns An arbitrary number of attached functions.
 */
export function use<T = any>(mdl: any, ...attachedFns: AttachedFn[]): Buildable<T> {
  const $model = model(mdl);

  return asBuildable($model, attachedFns);
}
