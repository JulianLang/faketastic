/**
 * `Stickiness` describes the behavior of `ProcessorFn`s when applied to a node which contains a `quantity(…)`.
 * `ProcessorFn` marked as `'sticky'` will always stick to the mulitplied value-nodes, whereas `unsticky`
 * processors will remain on the original node, which turns into an array node, when `quantity(…)` is applied.
 */
export type Stickiness = 'sticky' | 'unsticky';
