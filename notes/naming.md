# Definitions

**All following functions returns a `Buildable` which is why they are all `TemplateFn` or a subtype of them:**

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

- Every buildable represents a physical property on the output data.

## Template Functions

Template functions are functions that creates `Buildable` templates for faketastic. They take arbitrary input and convert it into Buildables that can then be built. Template functions have a signature like this:

`(...arbitraryInput: any[]) => Buildable<any>`

## Processor Functions

`ProcessorFn`s return `Function => void`, as they are designed to **work on** `Buildables` rather than to create those.

- **ProcessorFn**: Return a processor-function (void), that manipulates the node or its parents, where it runs on.

# Modelling

- **combine:** (`DirectiveFn`)
  - returns a buildable
  - clones the template
  - adds processors
  - adds custom, hidden processor

> **Question** What makes `combine` different from `use`?
