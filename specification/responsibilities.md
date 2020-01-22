# Responsibilities

## Model Builder

- Takes data input, traverses a model and calls the property builder, then assigns the result into the build-object.
- Knows and delegates to a traverser and property builder
- `modelBuilder<T = any>(value: any): T`

## Property Builder

- Completely builds a single property, recursively and returns the data result.
- Calls property-function and attached functions in correct order and each fn only once.
- Does not know anything about ObjectTreeNodes
- `propertyBuilder(value: Buildable | any): Placeholder | any`

## Traverser

- Converts an input object into structure which gets traversed
- e.g. `traverser(input: any): any`

```ts
traverser(input, callback: (value: any) => void) {
  // do not expose node structure
  traverse(input, (node) => callback(node.value));
}
```

## ArchitectFn (obsolete?)

May not be necessary, when the builder supports recursive building.
Could be kept, since strucural changes should be executed first anyway.

Example:

```ts
function quantity(n) {
  return (value: any) => {
    for(i < n) {
      cloned = clone(n);
      array.push(cloned);
    }

    // can be an array including buildables, which are found and built by model-builder.
    return array;
  }
}
```

**What about `ref`?**

```ts
function ref(target, attachedFns: AttachedFn[]) {
  let result: any;

  const readerFn = createReader(node => (result = findNode(node, n => n.name === target)));
  const refImpl = createBuilder(buildable => {
    return isDefined(result) ? result : buildable;
  });

  return createBuildable(refImpl);
}
```
