# ProcessorFns

Processor functions are functions that manipulate the value they are attached to. They can be attached to any builder function and affect the output value by either altering or replacing it completely. There are the following processor functions built into faketastic:

> #### **[canBe](./attached-fns/can-be.md)**
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

> #### **[map](./attached-fns/map.md)**
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

---

### Related Topics

- [AttachedFns](./model-fns/model-fns.md)
- [ArchitectFns](./attached-fns/architect-fns.md)
- [TreeReaderFns](./attached-fns/tree-reader-fns.md)
- [Getting Started](./getting-started.md)
