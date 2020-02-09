/** Holds meta information about what value to pass into an mutation function (architects and processors). */
export const MutationFnReadType = Symbol('faketastic.symbols.attached-fn-read-type');
/** Holds meta information about an object's or function's type. */
export const Type = Symbol('faketastic.symbols.type');
/** Holds meta information about the time of execution of a function (mostly `ProcessorFn`s). */
export const TimeOfExecution = Symbol('faketastic.symbols.time-of-execution');
/** Holds meta information about whether a faketastic-attached-function was already called. */
export const FnCalled = Symbol('faketastic.symbols.fn-called');
