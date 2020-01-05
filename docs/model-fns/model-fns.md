# ModelFns

Model functions are the core functionality of faketastic, since they take user input and bundles it into something faketastic can actually build into mock data. They also take care of reusability of your models as they allow you to build models upon other, existing models. The following model function are available:

> **[model](./model.md)**
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

> **[use](./use.md)**
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

> **[extend](./extend.md)**
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

> **[build](./build.md)**
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
