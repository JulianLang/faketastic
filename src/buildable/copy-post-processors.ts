import { isProcessorFn } from '../attached-fns';
import { Buildable } from './buildable';

/**
 * Copies over the postprocessors from one buildable to another.
 * @param original The original buildable to copy the postprocessors from.
 * @param target The target buildable receiving the copies.
 */
export function copyPostprocessors(original: Buildable, target: Buildable): void {
  const postprocessors = original.attachedFns.filter(fn => isProcessorFn(fn, 'postbuild'));
  /*
     APPEND postprocessors from "original" to "target", to keep the correct execution order.
   */
  target.attachedFns.push(...postprocessors);
}
