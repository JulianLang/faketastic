# Built-In Functionality

## Attached-Fns

Attached functions can be considered as the "adjectives" of your models. They define the shape and behavior of your data.

### Architects

> **[quantity](./attached-fns/quantity.md)**
> Multiplies how often a builder function gets executed and wraps their results into an array.
>
> ```ts
> const $Student = model({
>  grades: range(1, 5, quantity(4));
> });
> // => [5, 3, 1, 1]
> ```
>
> Example: Instead of printing out one number between 1 and 5, quantity multiplies it to four results, wrapped within an array.
>
> ```ts
> const $Student = model({ name: oneOf(Names) });
> const students = build(
>   $Student,
>   quantity(() => randomInt(1, 3)),
> );
> // => [ { name: 'Hubert' }, { name: 'Mariah' }]
> ```
>
> Example: Multiplies the number of built $Students to a random amount between 1 and 3 instances (Note the passed argument is a function returning the value to use as quantity).

### Processors

> **[combine](./attached-fns/combine.md)**
> Takes an object of values to be evelauted and combines them into a single value.
>
> ```ts
> const Names = ['dorah.deen'];
> const Domains = ['gmail'];
> combine(
>   {
>     name: oneOf(Names),
>     number: 42,
>     domain: oneOf(Domains),
>   },
>   values => `${values.name}${values.number}@${values.domain}.de`,
> );
> // => "dorah.deen42@gmail.de"
> ```
>
> Example: Evaluates all the given values and combines them as implemented within a mapping function.

> **[itself](./attached-fns/itself.md)**
> Enables models to be recursive by referencing the model it located on.
>
> ```ts
> import { /* ... */, RecursionDepth } from 'faketastic';
>
> const $Directory = model({
>  name: oneOf(DirNames),
>  directories: itself(RecursionDepth(null, 1, 1)),
> });
>
> const dir = build($Directory);
> // => {
> //   name: 'Documents',
> //   directories: {
> //      name: '.trash',
> //      directories: null,
> //   }
> // }
> ```
>
> Example: Builds a recursive model, with a recursion depth that ranges from at least 1 recursion to at most 1 recursion (=> exact one recursion depth) and ends the recursion with the value `null`.

> **[oneOf](./attached-fns/itself.md)**
> Chooses a random item from a given array of items. The randomly chosen item can be a model again.
>
> ```ts
> const $Person = model({ age: range(1, 42) });
> oneOf([4711, $Person]);
> // => { age: 22 }
> ```
>
> Example: Builds a recursive model, with a recursion depth that ranges from at least 1 recursion to at most 1 recursion (=> exact one recursion depth) and ends the recursion with the value `null`.
