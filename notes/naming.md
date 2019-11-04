# Naming

All following functions returns a `Buildable`:

> **TemplateFn**: 
> - Returns a buildable
> - clone the template
> - maybe include their own hidden processors
> - **does not accept** (externally given) ProcessorFns
>
> **DirectiveFn**: 
> - conceptually extends a `TemplateFn` but:
> - **does accept** (externally given) processors as input
>
> **BuilderFn**:
> - Returns a buildable
> - assigns a builder-function as value
> - computes a value at `"build-node"`-stage.

---

Only `ProcessorFn`s return `Function => void`. They are expected to **work on** `Buildables`.

- **ProcessorFn**: Return a processor-function (void), that manipulates the node it runs on.

---

- Every buildable represents a physical property on the output data.

## Modelling

- **combine:** (`DirectiveFn`)
  - returns a buildable
  - clones the template
  - adds processors
  - adds custom, hidden processor

> **Question** What makes `combine` different from `use`?
