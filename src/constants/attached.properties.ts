/** The indentifiers for attached properties set by faketastic's attached functions. */
export default {
  /** List of attached properties for faketastic's `range`-property function. */
  range: {
    /**
     * Set this attached property to override range's strategy to generate numbers.
     *
     * ---
     *
     * Example:
     *
     * ```ts
     * const customRangeGen = (min, max) => 42;
     * const myModel = model({
     *   property: range(1, 10, attach(AP.range.strategy, customRangeGen)),
     * });
     * ```
     */
    strategy: 'faketastic:range.strategy',
  },
};
