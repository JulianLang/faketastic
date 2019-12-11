import { detectChanges } from './src';

// import { build, combine, oneOf, range, ref, template } from './src';

// const tmpl = template({
//   // x: oneOf([oneOf([oneOf([2])])]),
//   testA: oneOf([ref('range1'), ref('range2')]),
//   testB: ref('range3'),
//   range1: range(11, 20),
//   range2: range(1, 10),
//   range3: range(21, 30),
//   mapped: combine(
//     {
//       range1: ref('range1'),
//       range2: ref('range2'),
//     },
//     values => {
//       return `range1=${values.range1}, range2=${values.range2}.`;
//     },
//   ),
// });

// const output = build(tmpl);

// console.log(JSON.stringify(output, null, 2));
// console.log(output);
// console.log();

const value = {
  a: 'string',
  b: 12,
  c: () => {},
};

const val2 = {
  a: 'xy',
  b: 123,
  c: [1],
};

const detectA = detectChanges(value);
const detectB = detectChanges(val2);
const detectC = detectChanges({});

detectA.a = 'helloworld';
detectB.b = 12;
// detectB.c = [];

if (detectA.b) {
  detectA.c = () => 'nice';
}

detectB.c.push(2);

console.log(detectA.__changes, detectA.__hasChanges());
console.log(detectB.__changes, detectB.__hasChanges());
console.log(detectC.__changes, detectC.__hasChanges());
console.log();
