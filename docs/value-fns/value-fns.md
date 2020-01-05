# Value Functions

Value functions generate randomized values based on user input.

## ValueFn vs. FactoryFn?

Both, `FactoryFns` and `ValueFns` take arguments and turn it into a randomized value, with a specified type, that is restricted due to the given user-input. So what is the point in distinguishing it?

The answer is: The way they are used and, thus the signature of both differs:

- ValueFn: `(...args: any[]) => Buildable<ValueFn>`
- FactoryFn: `(...args: any[]) => any`

[For more details have a look here.](../factories/factories.md)

## Overview: Value Functions

The following functions are built-in into faketastic:

> #### **[range](./value-fns/range.md)**
>
> `range(min: number, max: number, ...attachedFns: AttachedFn[])`
>
> Returns a random number within the given range. Both range edges are including.
>
> ```ts
> const $Person = model({
>   age: range(1, 18),
> });
>
> const person = build($Person);
> // => { age: 16 }
> ```
>
> Example: The `age` property will be a number between (including) 1 and 18.

> #### **[time](./value-fns/time.md)**
>
> `time(earliest?: TimeInput, latest?: TimeInput, ...attachedFns: AttachedFn[])`
>
> Returns a random `Date` object within the given range, while the date is always today. If both parameter are omitted, the full day is taken as range (00:00:00 - 23:59:59).
>
> ```ts
> const $Appointment = model({
>   begin: time(['4:00 am', 'HH:mm aa'], ['23:59:59']),
> });
>
> const appointment = build($Appointment);
> // => { begin: [object Date; 16:45:17:102] }
> ```
>
> Example: The `appointment` property will be a date between (including) 04:00:00 and 23:59:59, today.

> #### **[duration](./duration.md)**
>
> `duration(baseDate: Date, minDuration: DurationInput, maxDuration?: DurationInput)`
>
> Creates a new date based on a `Date`-instance and a duration range.
>
> ```ts
> const now = new Date(); // 01.01.20 12:00:00
> const newDate = duration(now, [15, 'minutes'], [1, 'hours']);
> // => 01.01.20 12:37:12
> ```
>
> Example: Reads the base date and appends a random time within the range of `15 minutes` and `1 hour` (in this example). This way it is easy to create an end date from an existing start date, like needed for e.g. Appointments.

---

### Related Topics

- [FactoryFns](../factories/factories.md)
- [Overview](../overview.md)
- [Getting Started](../getting-started.md)
