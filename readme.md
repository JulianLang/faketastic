# Faketastic

Faketastic is a small library giving you tools to generate your mock data on a random basis. With it you can define templates for your mock objects, that gets filled with random data while respecting your data restrictions:

## Quick Example

```ts
import {
  template,
  use,
  oneOf,
  range,
  quantity,
  build
} from 'faketastic';

// simple array with a bunch of different street names
import { StreetNames } from './resources.ts';
// same here
import { Names } from './resources.ts';

const Address = template({
  // gives you one value of the given street names
  street: oneOf(StreetNames),
  // gives you a random number within the defined range
  zip: range(100000, 999999),
});

const Person = template({
  name: oneOf(Names),
  age: range(1, 99),
  // gives you 5 (built) instances of the Address template
  address: use(Address, quantity(5)),
});

const output = build(Person);
/*
  "output" will be something like:
  {
    "name": "Marnie Banuelos",
    "age": 85,
    "address": [
      {
        "street": "Alfred Street",
        "zip": 221996
      },
      {
        "street": "Woodside Close",
        "zip": 455372
      },
      // 3 more ...
    ]
  }
*/
```
