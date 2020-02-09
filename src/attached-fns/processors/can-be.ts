import { probability } from '../../value-fns';
import { createProcessorFn } from '../util/create-processor.fn';

/**
 * Sets the current property's value to the given value by chance. Optionally accepts a likelihood
 * parameter to change the probability with which the given value will be set.
 * @param value The value to potentially set on the current property.
 * @param likelihood The likelihood with which to set the specified value. Defaults to "0.5" (50% chance).
 */
export function canBe(value: any, likelihood: number = 0.5) {
  function canBeImpl(original: any) {
    const apply = probability(likelihood);
    return apply ? value : original;
  }

  return createProcessorFn(canBeImpl, 'prebuild');
}
