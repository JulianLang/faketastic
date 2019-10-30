```ts
type SearchStrategy = (node, onNext) => void;
type RefRestrictorFn<T = any> = (itemCandidate: T, availableItems?: any[]): T | any;

interface RefOptions {
  searchStrategy?: SearchStrategy,
  restrictions?: RefRestrictorFn[],
  provideAs: string
}

function ref(path: string, opts: RefOptions): Function;
```

## Case A (TopDown)

```ts
// ------ Case A: top down, Single ------

const Company = template({
  name: oneOf(CompanyNames, provideAs('companyName')),
  ceo: ref('employee', { searchStrategy: SearchSelf, provideAs: '#ceo' }), // SearchSelf = SiblingsWithChildrenStrategy
  mail: combine(values => `${values.firstName}.${values.lastName}@${values.companyName}.de`, {
    firstName: ref('#ceo.firstName'),
    lastName: ref('#ceo.lastName'),
    company: ref('companyName'),
  }),
  employees: use(Employee, quantity(2), provideAs('employee')),
});

build(Company, () => randomInt(1, 3));
```

## Case B (BottomUp)

```ts
// ------ Case B: bottom up, Single ------

const Flat = template({
  address: use(Address, provideAs('address')),
  residents: use(Resident, quantity(2)),
});

const Person = template({
  name: oneOf(Names),
});

const Resident = extend(Person, {
  livesIn: ref('address.city'),
});

build(Company, () => randomInt(1, 3));
```
