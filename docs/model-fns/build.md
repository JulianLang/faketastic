# build

`build(mdl: Buildable): any`

Creates a buildable model by extending a base model and merging the given object into it. Accepts two parameters.

- `mdl`: The buildable model to generate mock data from.
- `returns` the generated mock data.

### Example

```ts
const $Person = model({
  name: oneOf(['Sara', 'Peter']),
  age: range(1, 92),
});

const person = build($Person);
// => {
//  name: 'Peter',
//  age: 21,
// }
```

---

[Back to ModelFns](./model-fns.md) | [Back to Overview](../overview.md)
