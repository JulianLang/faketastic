# Referencing

References are what drive semantics in data.

## Case A (TopDown)

```ts
// ------ Case A: top down, Single ------

const Company = template({
  name: oneOf(CompanyNames, provideAs('companyName')),
  ceo: ref('employee.id'),
  employees: use(Employee, quantity(20), provideAs('employee')),
});

build(Company);
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

### Case: Self

```ts
const Person = template({
  name: oneOf(Names),
});

const Company = template({
  name: oneOf(CompanyNames),
  employees: use(Person, quantity(2)),
  ceo: ref('employee'),
  // this will need processor priorization, since combine must be evaluated last (after ref to "ceo").
  mail: combine(refs => `${refs.name}@${refs.companyName}.de`, {
    name: ref('ceo.firstName'),
    companyName: ref('name'),
  }),
});

build(Company);
```
