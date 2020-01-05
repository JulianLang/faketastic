# model

`model(mdl: T): Buildable<T>`

Creates a buildable model from the given object. Accepts one parameter.

- `mdl`: The model template-object to be gets converted into a `Buildable`.
- `returns` a `Buildable`from with the given template-object.

### Example

```ts
const $Person = model({
  name: oneOf(['Sara', 'Peter']),
  age: range(1, 92),
});
```

---

[Back to ModelFns](./model-fns.md) | [Back to Overview](../overview.md)
