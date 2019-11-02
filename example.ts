import { Names, Streets } from './resources';
import { oneOf, range } from './src/builders';
import { build, extend, template, use } from './src/core';

// const insertItemsOf = (tmpl: Buildable, q: number) => use(tmpl, quantity(q, 'useParentArray'));

const Address = template({
  street: oneOf(Streets),
  zip: range(100000, 999999),
});

const Person = template({
  name: oneOf(Names),
  age: range(1, 79),
  address: use(Address),
});

const Senior = extend(Person, {
  age: range(80, 90),
  isSenior: oneOf([true, false]),
});

const Example = template({
  random: oneOf([Senior, Person, Address]),
  // array: [
  //   use(Person, quantity(2, 'useParentArray')),
  //   insertItemsOf(Senior, 2),
  //   use(Address, quantity(2)),
  // ],
});

const output = build(Example, 5);
console.log(JSON.stringify(output, null, 2));
