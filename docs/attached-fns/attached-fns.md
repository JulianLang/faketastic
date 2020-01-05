# Attached Functions

Attached functions are hosted on [builder functions](../builder-fns/builder-fns.md). They can be considered as the "adjectives" of a model's property, as they affect the values.

In general we can distinguish three attached function types.

## Type 1: Tree-Readers

> **Note:** We skip TreeReaderFns, since you will most likely not need them. In a nutshell, tree-readers are functions being used to prepare architect functions for or value-dependent restructurings.

Tree-Readers are often helping constructs for builder functions. As they are readonly (not affecting/changing any values) they most likely won't occur as a standalone function. For example, `itself` uses a tree-reader function to figure out when to stop the recursion.

## Type 2: Architects

Architect functions are functions that restructure the result of builder functions. As already said, `quantity` is an excellent example. Take a look on this code snippet:

```ts
range(1, 10, quantity(4)); // => [6, 1, 3, 9]
```

In this snippet, `quantity` turns one builder function into four builder functions with the same configuration and wraps the result into an array. So basically `quantity` "multiplies" an builder functions by repeating the same functionality and wrapping their results into an array.

> Note: This is not technically spoken. There is a reason why they are called "ArchitectFns". If you need more understanding here, navigate to [build mechanism](./topics/build-mechanism.md).

> Note: By now, faketastic has only the `quantity`-architect. There might be other cases than multiplying an expression, but those cases can be implemented by the user itself, as faketastic allows you to [write custom attached functions](./attached-fns/attached-fns.md#custom-attached-fns).

- [View: quantity architect](./quantity.md)

## Type 3: Processors

Processor functions are attached functions that changes or replaces the current result of a builder function. Currently there are the following processors available:

- [View: canBe processor](./can-be.md)
- [View: map processor](./map.md)

## Custom AttachedFns

You can write your custom attached functions as well. [Take a look here!](../topics/custom-code.md#Create-Custom-AttachedFns)

---

### Related Topics

- [ArchitectFns](../attached-fns/architect-fns.md)
- [ProcessorFns](../attached-fns/processor-fns.md)
- [BuilderFns](../builder-fns/builder-fns.md)
- [Overview](../overview.md)
- [Getting Started](../getting-started.md)

