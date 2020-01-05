# probability

`probability(n = 0.5): number`

The factory function `probability` accepts one optional parameter.
- `n`: A number between `0`and `1` representing the percental likelihood that `probability` returns `true`. Defaults to `0.5` (50% chance).
- `returns` a random boolean.

### Example

```ts
const bool1 = probability(1); // => true
const bool2 = probability(0); // => false
const bool3 = probability(); // => false
```

---

[Back to FactoryFns](./factories.md#overview)
