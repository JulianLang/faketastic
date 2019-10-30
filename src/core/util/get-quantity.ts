import { Quantity } from '../types/quantity';

export function getQuantity(quantity: Quantity): number {
  return typeof quantity === 'function' ? quantity() : quantity;
}
