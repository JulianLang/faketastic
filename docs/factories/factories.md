# Factories

Factories take user-input and create a random value, that gets directly returned as return-value.

`factory<T>(...inputParams: any[]) => T`

[Skip forward to FactoryFn overview](#overview)

## FactoryFn vs. ValueFn?

Both, `FactoryFns` and `ValueFns` take arguments and turn it into a randomized value, with a specified type, that is restricted to given user-input. So what is the point in distinguishing it?

The answer is: The way they are used. That's why the signature of both differs:

- ValueFn: `(...args: any[]) => Buildable<ValueFn>`
- FactoryFn: `(...args: any[]) => any`

Factory functions create a randomized value and immediately returns it, so that it can be used within a processor function for example. It won't return a `Buildable`, that continiously delivers random data, but it directly returns _a single random value_, that is based on the input parameters given. This behavior is often important in situations where you need a randomized value **that is dependent on another value**.

So the main difference between value functions and factories is the place where you use them. Value functions are used on model's properties, in order to generate randomized values over and over, while factory functions are used within processors in order to generate a single random value to be set once.

This might sound really theoretical, so let's see it by example!

### Understanding by Example

Consider modelling an appointment having a `startTime` and `endTime`. When defining the model, we have to ensure that the `endTime` is later than the `startTime`. In other words, the `endTime` is (of course) _dependent_ on `startTime`.

There is no (good) way to express that via a value function, since it just generates random `Date` objects. How could we actually know if the generated time was after the `startTime`? In this case a factory can help you out, _creating a valid `endTime` based on a given `startTime`_.

Here is the proof:

#### The Bad Way: Modelling an appointment's time-bounds with ValueFns

What about that model:

```ts
const $BadAppointment = model({
  // random time between 17:55 and 20:00.
  startTime: time(['17:55'], ['20:00']),
  // random time between 20:01 and 23:59:59
  endTime: time(['20:01'], ['23:59:59']),
});
```

We used [time](../value-fns/value-fns.md#time) (which is a ValueFn) to model out both, start- and endtime.

**But why is it bad?**

The first thing is, that touching either `startTime` or `endTime` will possibily break the other one, leading to invalid time bounds. In this example, the model is fairly simple, but what if the model grows and as worst case, the `startTime` and `endTime` is located in different submodels? Besides that, splitting the times as seen above will not work anymore, if appointments are allowed to be _at any time_:

```ts
model({
  startTime: time(), // 00:00:00:000 to 23:59:59:999
  endTime: ???,
})
```

Next, we have no control about the length of an appointment. How could we ever say, that the maximal lenght of an appointment is two hours? Or an appointment is not allowed to have a length of 30 seconds? In simple words: there is no way.

And finally, there is no explicit dependency drawn from `endTime` to `startTime`. Another developer would have no chance to see, that the `endTime` must be aligned to the `startTime`. Again, in more complex models this can lead to bugs that are really hard to find.

#### Fixing it: Modelling an appointment's time-bounds with FactoryFns

To fix it we use the [duration](./duration.md)-factory, which accepts a base-date value and a minimum and maximum parameter. Since it returns the created random value directly, we can use this function within a [map](../attached-fns/processor-fns.md#map)-processor, attached to a [ref](../builder-fns/builder-fns.md#ref)-builder:

```ts
const $Appointment = model({
  startTime: time(), // 00:00:00:000 to 23:59:59:999
  endTime: ref(
    'startTime',
    map(time => duration(time, [5, 'minutes'], [1, 'hours'])),
  ),
});
```

This way, we explicitly let `endTime` be dependent of `startTime` and calculate the `endTime` based on our time-bound-restrictions. Here an appointment's length is at least `5 minutes` and at most `1 hour`.

## Overview

These factory functions are built into faketastic:

> #### **[duration](./duration.md)**
>
> `duration(base: Date, min: TimeInput, max: TimeInput): Date`
>
> Takes a base date instance and adds a random duration to it then returns the result.
>
> **Note:** The duration summand can also be negative as in:
>
> `duration(someDate, [-2, 'hours'], [-1, 'minutes']);`
>
> ```ts
> import { model, time, ref, map, duration, build } from 'faketastic';
>
> const $Appointment = model({
>   startTime: time(),
>   endTime: ref(
>     'startTime',
>     map(time => duration(time, [5, 'minutes'], [1, 'hours'])),
>   ),
> });
>
> const appointment = build($Appointment);
> // => {
> //  startTime: [object Date; Today, 15:42:19],
> //  endTime: [object Date; Today, 16:03:52]
> // }
> ```
>
> Example: `ageRef` will resolve the value of `age`-property at "finalizer" build cycle.

---

### Related Topics

- [ValueFns](../value-fns/value-fns.md)
- [Overview](../overview.md)
- [Getting Started](../getting-started.md)
