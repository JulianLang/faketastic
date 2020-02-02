# Glossar

### Symbols

- Type: 'ValueFn' | 'ReaderFn' | 'ArchitectFn' | 'ProcessorFn' | 'Buildable';
- FnCalled: boolean

### Special Entities

- value functions
- buildables
- attached functions 'reader' | 'architect' | 'processor'

### Buildable

Is an object summarizing all important information for building a model.
Buildables have a `value`-property that can either be a static value or a `Buildable` again.

Buildables are the input for builders.

### Property Build

Is the activity of a builder building one specific property. This activity can include:

- building a `Buildable`
- setting a static value

This process may be recursive. If the build's result is a `Buildable` again,
the process will be repeated.

### Value Functions

Value functions continuously return randomized values of a certain type. Often accepts parameters
that restricts the return value in a certain way (e.g. number bounds/ranges). They work similiar
to generator functions in javascript, but without the ability to be enumerated.
They are marked with a special symbol.

`valueFn<T>() => T`

### Property Functions

They can either return a static or a buildable value. Their result gets built by
faketastic's model builder. They often return a
`Buildable` which holds a `ValueFn` as value.

`property(...args, ...attachedFns) => Buildable | any`

### Attached Functions

Attached functions are either `ReaderFn`, `ArchitectFn` or `ProcessorFn`.
They run in the following order:

1. `ReaderFn`
2. `ArchitectFn`
3. `PreprocessorFn`
4. _(property-build)_
5. `PostprocessorFn`

### Reader Functions

Reader functions can visit parent, sibling and child properties, but must not touch any values.
They can gather data and place their results on nodes, though.

`reader(node: ObjectTreeNode) => void`

### Architect Functions (obsolete => pre-processor ?)

Architect functions can manipulate itself or child properties, but must not touch the parent.
They target the way how properties are structured, but must not touch any node's values.

`architect(value: any) => any`

- [obsolete?](./responsibilities.md#ArchitectFn-obsolete?)

### Processor Functions

Processor functions can manipulate the property they are located on.
They can choose from two execution-times: "preprocess" and "postprocess".

They return a value that then gets set for the property.

- "preprocess" will run before the property-build was executed.
- "postprocess" will run after the property-build was executed.

`processor(value: any): any`

### Placeholder

Placeholder is a special `buildable` result, that remains unbuilt until all property-builds are done.
Then, it gets rebuilt.

All attached functions that runs **before** property-building (`Readers`, `Architects`, `Preprocessors`) are executed.
Postprocessors gets transferred onto the placeholder and run after rebuilding it at the end.

Example:

```ts
ref('prop', canBe(null), map(v => v * 2)),
```
