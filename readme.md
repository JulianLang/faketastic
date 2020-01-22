# Faketastic

## Installation

`$ npm install faketastic`

## What is faketastic?

Faketastic is a library giving you tools to model your entities and generate randomized data from it. This way you get any number of random data, while still respecting your data restrictions specified in your model. The main difference to well-known mock data generators out there is that faketastic don't want to feed you with _just some random data_, but it _lets you define what data_ to use and in what shape to deliver. It also strives to let you add semantics to it. The vision is to allow users to design data models of arbitrary complexity and instantly generate _valid and meaningful_ data.

Thus the main purpose of faketastic (yet) is the combination of defining data models and generating valid sample data from it.

> **API is in Concept State**
>
> Please note: faketastic's API is currently in concept state and may be subject to changes in the future.
> If you like the idea of this project, please feel free to get in touch and/or contribute :)

## Quick Example

```ts
import { template, use, oneOf, range, quantity, build } from 'faketastic';

// simple array we can define with a bunch of made-up street names
import { StreetNames } from './resources.ts';
// same here for Names, could be possibly split up into any
// category of names (first-names, surnames, male, female, ...)
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
  // gives you 3 (built) instances of the Address template
  address: use(Address, quantity(3)),
});

// simple string transform function for use in Employee
const toMailName = (name: string) => name.replace(' ', '.').toLowerCase();

const Employee = extend(Person, {
  age: range(16, 62),
  email: combine(
    {
      name: ref(Employee, 'name', map(toMailName)),
      domain: oneOf(Domains),
    },
    values => `${values.name}@${values.domain}.de`,
  ),
});

const output = build(Employee, 3);
/*
  "output" will be something like:
  [
    {
      "name": "Daniel Banuelos",
      "age": 54,
      "email": "daniel.banuelos@hotmail.de",
      "address": [
        {
          "street": "Eldow Street",
          "zip": 221996
        },
        // 2 more addresses ...
      ]
    },
    // 2 more employees ...
  ]
*/
```
