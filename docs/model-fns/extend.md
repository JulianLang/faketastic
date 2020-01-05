# extend

`extend(base: T, mdl: K): Buildable<T & K>`

Creates a buildable model by extending a base model and merging the given object into it. Accepts two parameters.

- `base`: The base model to be extended.
- `mdl`: The template-object that extends the base model.
- `returns` a `Buildable` with the extended template-object.

### Example

```ts
const $Person = model({
  name: oneOf(['Sara', 'Peter']),
  age: range(1, 92),
});

const $Student = extend($Person, {
  age: range(18, 70),
  studentNumber: range(10000, 99999),
});
```

---

[Back to ModelFns](./model-fns.md) | [Back to Overview](../overview.md)
