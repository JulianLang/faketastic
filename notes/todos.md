# Questions

## What happens if a ref() references another ref()?

If this is necessary, *might* be a design/architectural error, since I could not come up with a valid scenario yet. Has to be proven, though. Tried with something like that (which does not need a ref to a ref):

```ts
const Person = template({
  name: oneOf(Names),
  email: combine(
    {
      name: ref('name'),
      domain: ref('domain', { refStrategy: ParentsSiblings }),
      tld: ref('toplevelDomains', { refStrategy: ParentsSiblings }, map(tlds => randomItem(tlds))),
    },
    refs => `${refs.name}@${domain}.${tld}`,
  ),
});

const Providers = template({
  name: oneOf(Providers),
  toplevelDomains: oneOf(TLDS, quantity(5)),
});
```

## Should it be possible to reference values on _(technically) another_ build?

```ts
const Entity = template({
  name: ref('name', { refStrategy: Siblings }),
});

// Entity now has 3 siblings, but technically will create three trees because it acts as a root node; each tree for the three entities.
build(Entity, 3);
```

I would assume that this should be supported behavior, since it seems to be a valid use case. If so, we have to discuss, what happens, when there are no siblings, e.g.:

```ts
build(Entity, () => randomInt(1, 2)); // 1
```

Maybe the best solution here is to leave the reference as `undefined` or `null` or maybe let the user choose a fallback value:

```ts
const EmptyEntity = {};

const Entity = template({
  name: ref('name', {
    refStrategy: Siblings,
    fallbackValue: EmptyEntity,
  });
});
```

# Todo's

## ES6 Class Support

### Problem

At the moment ES6 classes can't be used since there is no way to correctly clone those instances in a
clean way. Moreover, it seems to be impossible to really clone built-in types such as `Map`.

### Possible Solutions

Maybe using constructor functions of (built-in and custom) classes in a dynamic way can help
cloning these correctly. But still it must be evaluated if it possible to clone objects and
instances side-by-side without losing information.

Something like:

```ts
function clone(value: any) {
  if (isClass(value)) {
    // call constructor dynamically:
    const ctor = value.constructor;

    return new ctor();
  } else {
    /* ... */
  }
}
```

Still, it is impossible in this context, to know which arguments to pass to the `ctor`;

### References

- https://stackoverflow.com/a/728694/3063191
