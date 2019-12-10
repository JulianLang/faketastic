// ------------------------------------------------------------
// |        PLEASE DO NOT CARELESSLY CHANGE ORDERS!           |
// |                                                          |
// |  Be careful when (re-)ordering processor functions and   |
// |  try to keep their dependencies as clear as possible, as |
// |  changes could easily break functionality of other pro-  |
// |  cessor functions.                                       |
// ------------------------------------------------------------

/**
 * **Contains the ordering for processor functions.**
 *
 * The higher the order number of a processor function, the later the
 * processor gets executed.
 * Any processor function that has no processor order number assigned,
 * has an order number of `0` by default. All functions with the same order number
 * get executed according to the order they appear in the code.
 *
 * Example:
 * ```ts
 * template({
 *  names: oneOf(Names, proc1, proc2, proc3),
 * });
 * ```
 * If `proc2` and `proc3` both have the same order number – for example `0` –
 * but `proc1` has a order of `1`, they get executed like so: `proc2`, `proc3`, `proc1`
 * as the order number `1` comes behind `0`.
 *
 * ---
 *
 * **Note:** You can assign an order number to your processor function by
 * using the `createProcessorFn`-method and specifying the third parameter.
 *
 * ---
 *
 * **Note:** It is possible to assign negative order number numbers, too.
 * The execution of functions with negative order numbers gets preposed,
 * according to their value.
 *
 * Example:
 * ```ts
 * template({
 *  names: oneOf(Names, proc1, proc2, proc3),
 * });
 * ```
 * if `proc3` has an order number of `-1` and `proc1` and `proc2` both have
 * an order number of `0`, the execution order is as follows: `proc3`, `proc1`, `proc2`.
 *
 * ---
 *
 * **Note:** Order numbers only apply to the build-cycle, the
 * processor is bound to. For example the `map`-processor
 * is a `finalizer`-processor function. Thus its order number
 * is always related to all other `finalizer`-processors applied
 * to the same property. It will have no effect on the ordering
 * of `initializer`-processors, for example.
 */
export const FunctionOrders = {
  processors: {
    // -------------------------------------------------------
    // initializer
    // -------------------------------------------------------
    /**
     * **Dependencies**
     *
     * *run-before:* `unpriorized processors`
     */
    treeStructureChanging: -4005,
    /**
     * **Dependencies**
     *
     * *run-before:* `unpriorized processors`
     */
    recursion: -4000,
    // -------------------------------------------------------
    // preprocessors
    // -------------------------------------------------------

    // -------------------------------------------------------
    // postprocessors
    // -------------------------------------------------------

    // -------------------------------------------------------
    // finalizer
    // -------------------------------------------------------
    /**
     * **Dependencies**
     *
     * *run-after:* `unpriorized processors`
     */
    ref: 4000,
    /**
     * **Dependencies**
     *
     * *run-after:* `ref()`
     */
    combineValues: 4010,
    /**
     * **Dependencies**
     *
     * *run-after:* `ref()`, `combineValues()`
     */
    map: 4015,
  },
} as const;
