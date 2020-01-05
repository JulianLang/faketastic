# Overview: Built-In functionality

Short overview about faketastic's built-in functionality. Table of contents:

- [BuilderFns](#builder-functions)
- [AttachedFns](#attached-functions)
  - [Architects](#architects)
  - [Processors](#processors)
- [ModelFns](#model-functions)
- [ValueFns](#value-functions)
- [FactoryFns](#factory-functions)

## Builder Functions

Builder functions are the "nouns" of your models. They generate the data that attached functions then can manipulate. They are also hosts of attached functions.

- [Overview: BuilderFns](./builder-fns/builder-fns.md)
  - [combine builder](./builder-fns/combine.md)
  - [itself builder](./builder-fns/itself.md)
  - [oneOf builder](./builder-fns/one-of.md)
  - [range builder](./builder-fns/range.md)
  - [ref builder](./builder-fns/ref.md)
  - [someOf builder](./builder-fns/some-of.md)

## Attached Functions

Attached functions can be considered as the "adjectives" of your models. They define the shape and behavior of your data.

There are three subtypes of attached functions:

- TreeReaderFns (skipped, as not really important for usual modelling)
- [ArchitectFns](./attached-fns/architect-fns.md)
- [ProcessorFns](./attached-fns/processor-fns.md)

### Architects

Architect functions are only affecting the [build-tree](./topics/build-mechanism.md) in which their associated property is located. They do not touch the result-value of the property itself, but rather moves/copies/removes it structurally within the [build-tree](./topics/build-mechanism.md). For example, the `quantity` architect multiplies the [build-tree](./topics/build-mechanism.md) node it is attached to and turns it into an `array`-type node. This way, it changes a single-value result to be a multiple-value result being wrapped within an array. These kinds of work are done by architect functions.

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

Value functions continiously create randomized data of a specific type (such as `Date` or `string`), that respects given input-restrictions (e.g. `min`/`max` parameters). They are used directly on properties, similiar to [builder functions](#builder-functions) as they return `Buildables`, that yields a new random value each time it gets called.

- [Overview: ValueFns](./value-fns/value-fns.md)
  - [range value function](./value-fns/range.md)
  - [time value function](./value-fns/time.md)

## Factory Functions

Factory functions are similiar to [value functions](#value-functions) as they take user-input and turns it into randomized data of a specific type, that respects given input-restrictions. But in contrast to value functions, factory functions are used within processor functions as they directly return the created, randomized value.

- [Overview: FactoryFns](./factories/factories.md)
  - [duration factory](./factories/duration.md)

---

### Related Topics

- [Getting Started](./getting-started.md)
- [ModelFns](./model-fns/model-fns.md)
- [BuilderFns](./builder-fns/builder-fns.md)
- [AttachedFns](./model-fns/model-fns.md)
