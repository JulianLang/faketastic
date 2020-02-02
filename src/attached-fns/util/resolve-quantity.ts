import { Quantity } from '../quantity';

/**
 * Takes a quantity instance and converts it into an actual number.
 * @param quantity The quantity to turn into a concrete number.
 */
export function resolveQuantity(quantity: Quantity): number {
  return typeof quantity === 'function' ? quantity() : quantity;
}
