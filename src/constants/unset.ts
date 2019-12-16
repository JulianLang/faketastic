/** The UnsetSymbol can be found on the values of `Buildable`s being `UnsetValue`s */
export const UnsetSymbol = Symbol('faketastic.value.unset');

// TODO: make UnsetValue === UnsetSymbol
/** Marks a value as unset. This can be the initial state on a `Buildable`. */
export const UnsetValue = { [UnsetSymbol]: true };
