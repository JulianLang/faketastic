# ArchitectFns

Architect functions restructure the [build-tree](../topics/build-mechanism.md) in a unique way. The following architects are available out-of-the-box:

> **[quantity](./attached-fns/quantity.md)**
>
> `quantity(amount: number | () => number, insertMode?: QuantityInsertMode)`
>
> Restructures the build-tree by multiplying the node it is attached to and turning its node-type into "array". This leads to multiple result-values instead of a single one. Consider the following scenario:
>
> ```ts
> const $Student = model({
>  grades: range(1, 5, quantity(4));
> });
> // => [5, 3, 1, 1]
> // instead of single value: 5
> ```
>
> Example: Instead of printing out one number between 1 and 5, quantity multiplies it to four results, wrapped within an array.
>
> **The same works with models when building them:**
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
> Example: Multiplies the number of built `$Student`-instances to a random amount between 1 and 3 instances.

## Custom ArchitectFns

You can write your custom architect function, see: [Creating custom Architects](../topics/custom-code.md#Architects).

---

### Related Topics

- [ModelFns](../model-fns/model-fns.md)
- [ProcessorFns](./processor-fns.md)
- [TreeReaderFns](./tree-reader-fns.md)
- [Overview](../overview.md)
- [Getting Started](../getting-started.md)

