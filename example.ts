import { Names, Streets } from './resources';
import { combine, oneOf, range } from './src/builders';
import { build, extend, template, use } from './src/core';

// const insertItemsOf = (tmpl: Buildable, q: number) => use(tmpl, quantity(q, 'useParentArray'));
const toCoolNickname = (nickname: string) =>
  nickname
    .replace('o', '0')
    .replace('i', '1')
    .replace('e', '3')
    .replace('a', '4');

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
  random: oneOf([Senior, Person, Address, true, false, 'string']),
  computed: combine(
    {
      nickname: oneOf(['CoolBoYY', 'NiceDuude', 'Allen{FrEsh}', '.:|Andy RaceR|:.']),
      separator: oneOf([':', '?!', '_', '||']),
      someNumber: range(20, 99),
    },
    props => toCoolNickname(`${props.nickname}${props.separator}${props.someNumber}`),
  ),
});

const output = build(Example, 5);
console.log(JSON.stringify(output, null, 2));
