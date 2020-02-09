import { probability, random, randomInt } from '../value-fns';
import { randomItems } from '../value-fns/random-items-value.fn';
import AP from './attached.properties';

export const defaultAttachedProperties = {
  [AP.strategies.probability]: probability,
  [AP.strategies.randomItems]: randomItems,
  [AP.strategies.randomInt]: randomInt,
  [AP.strategies.random]: random,
};
