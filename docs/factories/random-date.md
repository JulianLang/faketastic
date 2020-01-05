# randomDate

`randomDate(min: TimeInput, max: TimeInput): Date`

The factory function `randomDate` accepts two parameters.
- `min`: The smallest, allowed date to be generated.
- `max`: The greatest, allowed date to be generated.
- `returns` a `Date` being within the given date-range.

### Example

```ts
// 12.01.2020 00:00:00:000
const min = new Date(2020, 0, 12);
// 14.01.2020 12:02:19:129
const max = new Date(2020, 0, 14, 12, 2, 19, 129);

const date = randomDate(min, max);
// => 12.01.2020 18:21:29:201
```

---

[Back to FactoryFns](./factories.md#overview)
