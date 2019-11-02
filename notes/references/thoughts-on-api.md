# Thoughts on reference API

## Key-Findings yet

### Reference nodes, not values

`ref` method should rather reference the taregted node(s), than setting its node's value to the value(s) of the referenced node(s):

```ts
const Person = template({
  name: oneOf(Names),
  worksAt: ref('name', { onType: Company, mode: 'one' }), // replaces itself with a random matching node
  email: combine(
    {
      // ref replaces itself with the "name" node on finalize
      // combine() then strips away the `Buildable` part
      // so that `refs.name` just becomes the correct value.
      name: ref('name'),
    },
    refs => `${refs.name}@domain.de`,
  ),
});
```
---

## Quantity-Semantics

```ts
const Product = template({
  name: oneOf(Names),
});

const ProductTest = template({
  id: uid(),
  hasPassed: bool(),
});

// TODO: think of good API for such cases
const DataSet = template({
  products: use(Product, quantity(1, 20)),
  tests: use(
    ProductTest,
    // quantity is products.length +/- 5:
    quantity('products.length', {
      positiveDeviation: 5,
      negativeDeviation: 5,
    }),
  ),
});
```

## Computation-Semantics

### Self References

```ts
const toEmailAddress = (name: string) => `${name}@my-domain.de`;

const Person = template({
  name: oneOf(Names),
  email: ref('name', map(toEmailAddress)),
});
```

### Mutual References

```ts
const Person = template({
  name: oneOf(Names),
  friends: ref('name', { searchStrategy: ParentsSiblings }),
});

// TODO: this scenario will probably fail. build() with quantity parameter
// must work the same way as quantity() function would
// (adding a parent array node), in order to let all Persons
// be queryable for the ref() function.
build(Person, 10);
```

#### Bidirectionality

```ts
friends: ref('name', {
  searchStrategy: ParentsSiblings,
  directionality: 'bidirectional',
});
```

#### Alternative Ref Strategies

```ts
friends: ref('name', {
  refStrategy: ParentsOnly,
  directionality: 'bidirectional',
  refType: Person,
});
```

#### Quantity Selection Mode

```ts
// TODO: Verbose API here :(
friends: ref('name', {
  refStrategy: ParentsSiblings,
  directionality: 'unidirectional',
  refType: Person,
  refMode: 'some' | 'all' | 'one',
  filterFn: (refMatches: ObjectTreeNode[], self: ObjectTreeNode) => {
    // filterFn selects only persons, that are friends with me and vice versa
    const myName = findNode(self.parent, n => n.name === 'name');

     return refMatches.filter(match => {
       const theirFriends = findNode(match.parent, n => n.name === 'friends');
       return theirFriends.value.includes(myName.value);
     });
  }
}),
```

**Alternative API for "Quantity Selection Mode":** Instead of filtering and narrowing on refs, reference rules can be defined.

```ts
// enables rule superseding
const rules = [
  {
    id: 'Person.friends.bidirectionality',
    applyAtCycle: ['postprocessor'],
    appliesTo: [Person, 'friends'],
    // allow any new friendship, when there is none yet.
    isApplicable: (referencer: ObjectTreeNode, referencee: ObjectTreeNode) => {
      const myFriends = findNode(referencer.parent, n => n.name === 'friends');

      return myFriends.value.length > 0;
    },
    apply: (referencer: ObjectTreeNode, referencee: ObjectTreeNode) => {
      // exceptional state when either 'theirFriends' or 'myName' is not defined,
      // let it crash then, since this state is a bug.
      const theirFriends = findNode(name, n => n.name === 'friends')!;
      const myName = findNode(self, n => n.name === 'name')!;
      const isBidirectional = theirFriends.value.includes(myName.value);

      if (!isBidirectional) {
        theirFriends.push(myName.value);
      }

      return true;
    },
  },
];

const Person = template({
  friends: ref('name', {
    searchStrategy: ParentsSiblings,
    directionality: 'unidirectional',
  }),
});

build(Person, 20, { ruleSet: rules });
```

### Child References

```ts
const Company = template({
  name: oneOf(CompanyNames),
  // TODO: maybe fixable:
  // Note: order of properties is important here (employees, ceo)! :(
  employees: use(Employee, quantity(20)),
  ceo: ref('employees.*.id'),
});

build(Company);
```
