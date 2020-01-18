# Glossar

### Property Build

Is the activity of building one specific property. This activity can include:

- building a `Buildable`
- setting a static value

This process may be recursive. If the build's result is a `Buildable` again,
the process will be repeated.

### Attached Functions

Attached functions are either `ReaderFn`, `ArchitectFn` or `ProcessorFn`.
They run in the following order:

1. `ReaderFn`
2. `ArchitectFn`
3. `ProcessorFn` (preprocess)
4. *(property-build)*
5. `ProcessorFn` (postprocess)

### Reader Functions

Reader functions can visit parent, sibling and child properties, but must not touch any values.

### Architect Functions

Architect functions can manipulate itself or child properties.

### Processor Functions

Processor functions can manipulate the property they are located on.
They can choose from two execution-times: "preprocess" and "postprocess".

They return a value that then gets set for the property.

- "preprocess" will run before the property-build was executed.
- "postprocess" will run after the property-build was executed.

### Placeholder

Placeholder is a special `buildable` result, that remains unbuilt until all property-builds are done.
Then, it gets rebuilt.

Question: will attached functions be run initially?
