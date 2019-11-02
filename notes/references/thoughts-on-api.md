# Thoughts on reference API

## Key-Findings yet

### Reference the value of a node, not the node itself

> `ref` method should rather copy over the targeted node's value (to be explicit: the value gets cloned), than referencing the node itself. This will simplify the understanding as it avoids any possible side-effects on/from the original node. It allows to safely manipulate the value in any way, without having to worry about side-effects to the original node.

When referencing the node, it should `clone()` its value, so that further manipulations (such as `map()`-ing) can be done on it, without doing the same on the original (referenced) node's value. This implies, that the earliest time of referencing can be the `finalizer`-build cycle, since doing it earlier may cause deviations from the original node (e.g. by postprocessors changing the value differently).

Thus it seems **crucial** that the `ref()` method gets called as the **last** (processor-)function in the whole build cycle, only followed by the `map()` that must be executed afterwards. This will ensure that the original value really equals the cloned one.

```ts
const Person = template({
  name: oneOf(Names),
  // clones the value of a random, matching node and sets this clone as its value
  nickname: ref('name', map(toNickName)),
  email: combine(
    {
      // clones the value of a random, matching node and sets this clone as its value
      // combine will then strip away the `Buildable` part and only leaves the value over.
      // All properties defined here, must be children of the combine-node, so that
      // they get built too.
      name: ref('name'),
    },
    refs => `${refs.name}@domain.de`,
  ),
});

/*
  Expected Tree:

   Person: Node id-1
    |- name: Node id-2
    |- nickname: Node id-3 (equals Node id-2), but adds map(toNickName) to the finalizers. 
    |- email: Node id-3 (has the map-finalizer)
       |- name: Node id-4 (equals Node id-2)
*/
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
