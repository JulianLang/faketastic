# map

`map(mapFn: (value: any, node: ObjectTreeNode) => void): void`

This processor accepts a mapping function as parameter that converts the current node's value into another value.

## Example

```ts
const $Contact = model({
  telephone: someOf(
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    { minItems: 6, maxItems: 8 }
    map(names => names.join('')),
  ),
});

const contact = build($Contact);
// => { telephone: "58291727" }
```
