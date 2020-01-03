# Built-In Functionality

Short overview about faketastic's built-in functionality.

## Builder Functions

Builder functions are the "nouns" of your models. They generate the data that attached functions then can manipulate. They are also hosts of attached functions.

> **[combine](./builders/combine.md)**
>
> `combine<T extends object>(values: T, mapFn: T => any, ...attachedFns: AttachedFn[])`
>
> Takes an object of values to be evelauted and combines them into a single value.
>
> ```ts
> const Names = ['dorah.deen'];
> const Domains = ['gmail'];
>
> const $Student = model({
>  email: combine(
>     {
>       name: oneOf(Names),
>       number: 42,
>       domain: oneOf(Domains),
>     },
>     values => `${values.name}${values.number}@${values.domain}.de`,
>   );
> });
>
> const student = build($Student);
> // => { email: "dorah.deen42@gmail.de" }
> ```
>
> Example: Evaluates all the given values and combines them as implemented within a mapping function.

> **[itself](./builders/itself.md)**
>
> `itself(endWhen: RecursionController, ...attachedFns: AttachedFn[])`
>
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

> **[oneOf](./builders/one-of.md)**
>
> `oneOf(values: any[], ...attachedFns: AttachedFn[])`
>
> Chooses a random item from a given array of items. The randomly chosen item can be a model again.
>
> ```ts
> const $Person = model({ age: range(1, 42) });
> oneOf([4711, $Person]);
> // => { age: 22 }
> ```
>
> Example: oneOf chooses a random item, which can be also a model.

> **[someOf](./builders/some-of.md)**
>
> `someOf(values: any[], options?: SomeOfOpts, ...attachedFns: AttachedFn[])`
>
> Chooses some random items from a given array. Those items can be models again.
>
> ```ts
> const $Person = model({ age: range(1, 42) });
> someOf([4711, $Person]);
> // => [ { age: 22 }, 4711 ]
> ```
>
> Example: someOf chooses random items, which can also be models.

> **[ref](./builders/ref.md)**
>
> `ref<T = any>(property: keyof T, ...attachedFns: AttachedFn[])`
>
> References the specified property and resolves its value at "finalizer" build-cycle.
>
> ```ts
> const $Person = model({
>   age: range(1, 42),
>   ageRef: ref('age'),
> });
> // => { age: 28, ageRef: 28 }
> ```
>
> Example: `ageRef` will resolve the value of `age`-property at "finalizer" build cycle.

## Attached-Fns

Attached functions can be considered as the "adjectives" of your models. They define the shape and behavior of your data.

### Architects

> **[quantity](./attached-fns/quantity.md)**
>
> `quantity(amount: number | () => number, insertMode?: QuantityInsertMode)`
>
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
> Example: Multiplies the number of built `$Student`-instances to a random amount between 1 and 3 instances (Note, the passed argument is a function returning the value to use as quantity).

### Processors

> **[canBe](./attached-fns/can-be.md)**
>
> `canBe(value: any, likelihood = 0.5)`
>
> Replaces the builder function's result with the given value and a specified likelihood. The likelihood defaults to 50%.
>
> ```ts
> const $Person = model({
>   children: use($Person, quantity(2), canBe([], 1)),
> });
>
> const person = build($Person);
> // => { children: [] }
> ```
>
> Example: Instead of building two persons as children, the `canBe` processor will always (likelhood = 1) replace the value with an empty array.

> **[map](./attached-fns/map.md)**
>
> `map(mapFn: (value: any, node?: ObjectTreeNode) => any)`
>
> Reads the current value and maps it as implemented within the given map-function defines.
>
> ```ts
> const $Person = model({
>   age: range(
>     1,
>     99,
>     map(age => `${age} years old`),
>   ),
> });
>
> const person = build($Person);
> // => { age: "42 years old" }
> ```
>
> Example: Reads the result of the evaluated builder function and maps it as defined within the map-function.

## Value Functions

Value functions generate randomized values based on user input.

> **[range](./value-fns/range.md)**
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

> **[time](./value-fns/time.md)**
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

## Modelling Functions

Modelling functions allow you to define, extend and reuse existing models. They are the core of faketastic.

> **[model](./modelling/model.md)**
>
> `model<T extends object>(mdl: T): Buildable<T>`
>
> Takes an object containing the model and converts it into a buildable.
>
> ```ts
> const $MyModel = model({
>   /* properties... */
> });
> ```
>
> Example: Creating a model using `model`.

> **[use](./modelling/use.md)**
>
> `use<T extends object>(mdl: T, ...attachedFns: AttachedFn[]): Buildable<T>`
>
> Takes an existing model as reference and optionally decorates it with attached functions (if any provided).
>
> ```ts
> const $Company = model({
>   employees: use($Person, quantity(10)),
> });
> ```
>
> Example: Using the `$Person` model within `$Company` and additionally decorating it with the `quantity` architect.

> **[extend](./modelling/extend.md)**
>
> `extend<T, K>(base: T, extension: K): Buildable<T & K>`
>
> Takes an existing model as base model and extends it with given properties.
>
> ```ts
> const $Person = model({
>   name: oneOf(Names),
>   age: range(18, 99),
> });
>
> const $Student = extend($Person, {
>   age: range(18, 50), // overrides
>   grades: use(
>     Grade,
>     quantity(() => randomInt(2, 8)),
>   ),
> });
> ```
>
> Example: Extending the `$Person` model to be the `$Student` model.

> **[build](./modelling/build.md)**
>
> `build(mdl: Buildable, ...attachedFns: AttachedFn[]): any`
>
> Takes a model, builds it and returns the built mock data.
>
> ```ts
> const $Person = model({
>   name: oneOf(Names),
>   age: range(18, 99),
> });
>
> const samplePersons = build($Person, quantity(2));
> ```
>
> Example: Extending the `$Person` model to be the `$Student` model.

## Factories

> **[duration](./factories/duration.md)**
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
