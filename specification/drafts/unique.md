```ts
const Names = ['Pete', 'Sara'];
const $Person = model({
  name: oneOf(Names),
});

const persons = build($Person, quantity(2), unique(['name']));
// => ['Pete', 'Sara']
```

`unique(['name'])` tells that the `name`-property is a Buildable.
Unique is a pre-processor, caching the Buildable having the ValueFn
as value. It can than replace the Buildable with a wrapped version,
which keeps track of the values produced and in case it is not unique,
reexecuting the value fn as long as it isn't unique.
