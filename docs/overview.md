# Overview: Built-In functionality

Short overview about faketastic's built-in functionality.

## Builder Functions

Builder functions are the "nouns" of your models. They generate the data that attached functions then can manipulate. They are also hosts of attached functions.

- [Overview: BuilderFns](./builder-fns/builder-fns.md)
  - [combine builder](./builder-fns/combine.md)
  - [itself builder](./builder-fns/itself.md)
  - [oneOf builder](./builder-fns/one-of.md)
  - [range builder](./builder-fns/range.md)
  - [ref builder](./builder-fns/ref.md)
  - [someOf builder](./builder-fns/some-of.md)

## Attached-Fns

Attached functions can be considered as the "adjectives" of your models. They define the shape and behavior of your data.

There are three subtypes of attached functions:

- TreeReaderFns (skipped, as not really important for usual modelling)
- [ArchitectFns](./attached-fns/architect-fns.md)
- [ProcessorFns](./attached-fns/processor-fns.md)


### Architects

Architect functions restructure the [build-tree](./topics/build-mechanism.md), thus indirectly affecting the result-value. They are not concerned with the actual value they are attached to, but with the shape of the result-value.

For example, the `quantity` architect multiplies the [build-tree](./topics/build-mechanism.md) node it is attached and turns it into an `array`-type node. This changes a single-value result to be a multiple-value result. These kinds of work are done by architect functions.

- [Overview: ArchitectFns](./attached-fns/architect-fns.md)
  - [quantity architect](./attached-fns/quantity.md)

### Processors

Processor functions manipulates the value they are attached to. They can be attached to any builder function and affect the result value by either altering or replacing it completely.

- [Overview: ProcessorFns](./attached-fns/processor-fns.md)
  - [canBe processor](./attached-fns/can-be.md)
  - [map processor](./attached-fns/map.md)

## Model Functions

Modelling functions allow you to define, extend and reuse existing models. They are the core of faketastic.

- [Overview: ModelFns](./model-fns/model-fns.md)
  - [build model-function](./model-fns/build.md)
  - [extend model-function](./model-fns/extend.md)
  - [model model-function](./model-fns/model.md)
  - [use model-function](./model-fns/use.md)

## Value Functions

Value functions can be used to create randomized data of a specific type (such as `Date` or `string`), that respects given input-restrictions (e.g. `min`/`max` parameters).

- [Overview: ValueFns](./value-fns/value-fns.md)
  - [range value function](./value-fns/range.md)
  - [time value function](./value-fns/time.md)

---

### Related Topics

- [Getting Started](./getting-started.md)
- [BuilderFns](./builder-fns/builder-fns.md)
- [AttachedFns](./model-fns/model-fns.md)
- [ModelFns](./model-fns/model-fns.md)
