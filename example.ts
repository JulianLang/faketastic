import { Names, Streets } from './resources';
import { oneOf, range } from './src/builders';
import { build, extend, quantity, template, use } from './src/core';

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
  array: [
    use(Person, quantity(2, 'useParentArray')),
    use(Senior, quantity(2, 'useParentArray')),
    use(Address, quantity(2, 'useParentArray')),
  ],
});

const output = build(Example);
console.log(JSON.stringify(output, null, 2));
