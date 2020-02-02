import { Func } from '../types';

/** Defines possible ways to describe a quantity in faketastic. */
export type Quantity = number | Func<[], number>;
