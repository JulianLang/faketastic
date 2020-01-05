# duration

`duration(base: Date, min: DurationInput, max: DurationInput): number`

The factory function `duration` accepts three parameters.
- `base`: A date instance which acts as reference point in time.
- `min`: The smallest, allowed time-distance in relation to the `base` date.
- `max`: The greatest, allowed time-distance in relation to the `base`date.
- `returns` a new `Date` being within the given time-distance range.

### Types

- `type TimeUnit = 'hours' | 'minutes' | 'seconds'` as in [Momentjs Docs](https://momentjs.com/docs/#/manipulating/add/)
- `type DurationInput = [number, TimeUnit]`

### Example

```ts
// 12.01.2020 14:00:00
const base = new Date(2020, 0, 12, 14);

const date = duration(base, [-20, 'minutes'], [2, 'hours']);
// => 12.01.2020 13:45:01:029
```

---

[Back to FactoryFns](./factories.md#overview)
