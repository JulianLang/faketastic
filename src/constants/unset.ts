import { setSymbol } from '../util';

/** The UnsetSymbol can be found on the values of `Buildable`s being `UnsetValue`s */
export const UnsetSymbol = Symbol('faketastic.value.unset');

/** Marks a value as unset. This can be the initial state on a `Buildable`. */
export const UnsetValue = setSymbol(UnsetSymbol, {});
