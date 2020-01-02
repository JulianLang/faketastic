# Getting Started: Faketastic

Faketastic is a library that helps you with modeling your data objects in a readable, flexible and extensible way. After defining your models you can then generate random data from it, that respects the restrictions of your models.

## Installation

To install faketastic simply run:

`$ npm install faketastic`

## Basics

Before starting with modelling concrete examples, it is useful to understand the single building blocks of faketastic. Thus, this "Getting Started" explains these building blocks first and merges the knowledge gradually until a sample model was completely created.

### Builder Functions: Anatomy of a Data Description

Let's dive into some examples in order to understand how to define data with faketastic. The basic building blocks of faketastic are called builder functions (abbr. "BuilderFns").

Builder functions allow you to describe the type and frame of expected data. At a very high level they look like this:

![Anatomy of Builder Fns](./assets/anatomy-of-builder-fns.jpg)

1. The first parameters are specific to any builder function. There are builder functions without any (required) parameters and their are some that expect your input.
2. After those required parameters, you can add an arbitrary number of [attached functions](./attached-fns/attached-fns.md). We will have a closer look on these functions, later on.

When we zoom in a bit, we might see something like that:

![Anatomy of Builder Fns](./assets/anatomy-of-a-property.jpg)

Here, we have a concrete example of a builder function in use. [oneOf](./builders/one-of.md) is a builder function that expects one parameter: The array that contains the values to randomly choose an item from. In this example we just passed the values `[1, 2, 3]`. After this parameter is passed-in, we **can** add additional [attached functions](./attached-fns/attached-fns.md). In this example we added [canBe](./attached-fns/can-be.md) and [map](./attached-fns/map.md).

> Since we does not have to add attached functions, it is completely legal to call `oneOf` like this:
>
> ```ts
> oneOf([1, 2, 3]);
> ```

Let's see another example to get used to the shape of builder functions.

![Anatomy of Builder Fns](./assets/anatomy-of-builder-fns-2.jpg)

[range](./builders/range.md) is another builder function which requires two parameters. It returns a random number from a given range. Thus it needs the minimum and maximum value as input. After they have been given, again, we can add an arbitrary list of [attached functions](./attached-fns/attached-fns.md).

This way we describe data and their restrictions in faketastic.

### Attached Functions in a nutshell

We have seen some [attached functions](./attached-fns/attached-fns.md) by now. They get added to builder functions in order to affect their generated value somehow. To gain a better understanding, have a closer look to the latest example:

![Anatomy of Builder Fns](./assets/anatomy-of-builder-fns-2.jpg)

We declare a range from `1 to 99`, but add the [canBe](./attached-fns/can-be.md) attachment to say, that the value can also be `-1`. But wait, when will it be `-1`? The short answer is: with a change of 50%. `canBe` accepts not only the value it could be, but has further, but optional parameters. The full signature of it is:

`function canBe(value: any, likelyhood = 0.5) {}`

As we omit the `likelyhood` parameter, there is a 50/50 chance, that the original value gets replaced with the value given to `canBe`.

This is just one example for a attached function. In fact there are three sub-types of attached functions:

1. **TreeReaderFns**: Skipping for now (not that important for usual models).
2. **ArchitectFns**: Restructures the result of the builder function it is attached to. The most common example is `quantity`, that multiplies the call of a builder function and wraps their results into an array.
3. **ProcessorFns**: Changes or replaces the result of the builder function it is attached to. `canBe` and `map`, in fact, are processor functions.

### Turn it into a model

By now we have only seen isolated calls of builder functions that produces results that were never used. Also we attached functions that affects these results, but we could not use these.

Now, we turn our knowledge into models, so that we have something we can play with. Have a look on this code:

```ts
import { model, oneOf, range } from 'faketastic';

const Names = ['Sara', 'Peter'];
const $Person = model({
  name: oneOf(Names),
  age: range(18, 99),
  isMarried: oneOf([true, false], canBe(null)),
});
```

Here, we describe a person in a (simple) model. We say, that a person has:

- a `name`, that is one of `['Sara', 'Peter']`
- an `age` which is within the range of `18 to 99`.
- and a flag whether the person is married, which could also be `null` for some reason.

We now have a model. Models can be considered as something like `classes` in programming languages. They describe entities, but this is only a receipt how to build it, and not actual instances. To generate mock data out of it, we need to build it:

```ts
import { model, oneOf, range, build } from 'faketastic';

const Names = ['Sara', 'Peter'];
const $Person = model({
  name: oneOf(Names),
  age: range(18, 99),
  isMarried: oneOf([true, false], canBe(null)),
});

const samplePerson = build($Person);
// => { name: "Sara", age: 29, isMarried: false }
```

> **Note: build, in fact, is also a builder function!** This means that you can attach functions here, too:
>
> ```ts
> const persons = build($Person, quantity(3));
> // => [
> //  { name: 'Sara', age: 22, isMarried: true },
> //  { name: 'Peter', age: 41, isMarried: null },
> //  { name: 'Peter', age: 18, isMarried: false },
> // ]
> ```
>
> The full signature of build is:
>
> `function build(value: Buildable, ...attachedFns: AttachedFn[])`

### There is more to it: Reuse Models

Earlier we said that models are something like `classes` in programming languages. There is more to it, as you can reuse models the same way, you would do with classes in programming. Take a look on this code snippet:

```ts
const PetNames = ['Bobby' /* , ... */];
const FurColors = ['Black/White' /* , ... */];

const $Pet = model({
  name: oneOf(PetNames),
  age: range(1, 20),
  legCount: range(0, 4),
});

const $Dog = extend($Pet, {
  furColor: oneOf(FurColors),
});

const $Bird = extend($Pet, {
  legCount: 42,
});

const pet = build($Pet);
// => { name: "Bobby", age: 11, legCount: 2 }

const dog = build($Dog);
// => { name: "Bobby", age: 20, legCount: 3, furColor: "Black/White" }

const dog = build($Bird);
// => { name: "Bobby", age: 4, legCount: 42 }
```

In this example we have seen that you can **extend** models, so that the reusability of models is as high as possible. We also figured out that you can override already existing properties with new values, as `$Bird` always has the value `42` as `legCount`, whereas other pets have a value between `0 and 4`.

> **Please note:** The comparison of models with `classes` is not perfect as many concepts we know from programming has no application with models in this context. For example there is no "polymorphism" or something like that with models. Models, under the hood, aren't even ES6 classes, but plain old javascript-objects.

### References

Sometimes when modelling, you have data-dependent descriptions. For example when modelling a person, the name is dependent on the gender chosen. So

### Try it yourself!

In order to get started, the best you can do is - try it yourself. You may want to have a look on the following pages for a complete list of built-in functionality.

Faketastic is made to be extensible. If the built-in functionality isn't enough for your use case, help yourself by writing custom functionality. :)

**Quick Example**

> In case you wonder why our custom processor function gets a `ObjectTreeNode` as input parameter, please take a look [here](./topics/build-mechanism.md).

```ts
const genderedName = createProcessorFn((node: ObjectTreeNode) => {
  const nameSource = node.value === 'female' ? FemaleNames : MaleNames;
  // replace the current value with a random gendered name:
  node.value = randomItem(nameSource);
}, 'finalizer');

const $Person = model({
  name: ref('gender', genderedName()),
  gender: oneOf(['female', 'male']),
});
```
