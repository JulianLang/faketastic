import { probability } from '../value-fns';
import { randomItems } from '../value-fns/random-items-value.fn';
import AP from './attached.properties';

export const defaultAttachedProperties = {
  [AP.strategies.probability]: probability,
  [AP.strategies.randomItems]: randomItems,
};
