import { build, combine, model, oneOf, range, ref } from './src';

const tmpl = model({
  // x: oneOf([oneOf([oneOf([2])])]),
  testA: oneOf([ref('range1'), ref('range2')]),
  testB: ref('range3'),
  range1: range(11, 20),
  range2: range(1, 10),
  range3: range(21, 30),
  mapped: combine(
    {
      range1: ref('range1'),
      range2: ref('range2'),
    },
    values => {
      return `range1=${values.range1}, range2=${values.range2}.`;
    },
  ),
});

const output = build(tmpl);

// console.log(JSON.stringify(output, null, 2));
console.log(output);
console.log();
