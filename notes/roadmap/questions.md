# Questions

## Should `extend` be really a `DirectiveFn` or rather a `TemplateFn`?

For more details on function naming, have a look [here](./naming.md). If it should rather be a `TemplateFn`, remove test cases for `DirectiveFn`s.

**Think of cases when we would _really_ need to apply processors on `extend()`? Are there any after all?**

## What happens if a ref() references another ref()?

For example we ref a computed property, which in turn contains a ref as well.

```ts
const Person = template({
  name: oneOf(Names),
  age: range(14, 30),
  isAdult: ref('age', map(a => a >= 18)),
});

const Family = template({
  members: use(Person, quantity(4)),
  parents: ref('members', filter(member => member.isAdult === true),
});

build(Family);
```

Since leave nodes are built first, the reference should work as is. Problems are introduced as soon, as both references are on the same level, and the first ref targets the second one:

```ts
const Person = template({
  age: range(1, 50),
  // order is important:
  isMarried: ref('isAdult', map(adult => adult && probability(0.8))),
  isAdult: ref('age' /* ... */),
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
