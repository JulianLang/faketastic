import { Names, Streets } from './resources';
import { combine, oneOf, range } from './src/builders';
import { build, extend, probability, randomInt, template, use } from './src/core';
import { canBe, map, quantity } from './src/processors';

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
  canBeTest: oneOf(['abc', '123'], canBe('hello world', 0.2)),
  // multiple: oneOf([1, true, 'hi there', null], quantity(() => randomInt(0, 3))),
  multiple: oneOf(
    [1, true, 'hi there', null],
    quantity(() => randomInt(0, 3)),
  ),
  randomTemplate: oneOf([Senior, Person, Address, true, false, 'string']),
  computed: combine(
    {
      nickname: oneOf(['CoolBoYY', 'NiceDuude', 'Allen{FrEsh}', '.:|Andy RaceR|:.']),
      separator: oneOf([':', '?!', '_', '||']),
      someNumber: range(20, 99),
    },
    props => {
      const nickname = `${props.nickname}${props.separator}${props.someNumber}`;
      return probability(0.5) ? toCoolNickname(nickname) : nickname;
    },
    quantity(2),
    map<string>(str => str.toUpperCase()),
  ),
});

const output = build(Example, 4);
console.log(JSON.stringify(output, null, 2));
