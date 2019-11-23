import { Names } from './resources';
import { oneOf, someOf } from './src/builders';
import { build, randomInt, template, use } from './src/core';
import { quantity } from './src/processors';

const Colleague = template({
  name: oneOf(Names),
  test: someOf([1, 2, 3, 4]),
});

const MyTemplate = template({
  participants: use(
    Colleague,
    quantity(() => randomInt(2, 3)),
  ),
});

const output = build(MyTemplate, () => randomInt(2, 3));
console.log(JSON.stringify(output, null, 2));
