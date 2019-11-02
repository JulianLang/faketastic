# Faketastic

## Installation

Please note: `faketastic` depends on [`object-tree` library](https://gitlab.centigrade.de/julian.lang/object-tree), which is currently linked in the `package.json` **as a file-path**. To get faketastic up and running, **follow these instructions**:

1. Download **both projects**, `object-tree` and `faketastic`
2. Move both project-folders, so that they are located **side-by-side**.
3. Install dependencies in `object-tree` via `$ npm install`
4. Build the `object-tree` project via `$ npm run build` or test it with `$ npm test`
5. Install dependencies in `faketastic` via `$ npm install`
6. Start the `faketastic` project via `$ npm start` or test it with `$ npm test`

> Note: When starting faketastic, it automatically runs the code in `example.ts`, which is located in the project's root folder. This file is meant as a **playground** which you can use without to worry about anything. It is also checked into git with a basic example; so if you mess up, just revert your changes. ;)

## What is faketastic?

Faketastic is a small library giving you tools to generate your mock data on a random basis. With it you can define templates for your mock objects, that gets filled with random data while respecting your data restrictions.

> **API is in Concept State**
> Please note: faketastic's API is currently in concept state and may be subject to changes in the future.

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
