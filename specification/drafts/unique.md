```ts
const Names = ['Pete', 'Sara'];
const $Person = model({
  name: oneOf(Names),
});

const persons = build($Person, quantity(2), unique(['name']));
// => ['Pete', 'Sara']
```

From `unique(['name'])` we can tell that the `name`-property should be a Buildable.
Unique is an architect running before quantity. It replaces the `name`-Buildable with
a wrapped version, which keeps track of the values produced and in case it is not unique,
reexecuting the value fn as long as it isn't unique.

This should work as - even if quantity clones the wrapped buildable - the function/closure
reference should remain the same. To be tested.

```ts
const model = {
  name: oneOf(Names, unique),
};

function unique() {
  function monitorValues(node) {
    const parent = node.parent.value;
    const cache = getSymbol(UniqueCache, parent);
    const val = node.value();

    cache.push(val);

    return val;
  }

  return node => {
    // wrap original valueFn
    node.value = monitorValues;
  };
}
```
