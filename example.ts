import { quantity } from './src/attached-fns';
import { createBuildable } from './src/buildable';
import { build } from './src/builder';
import { extend, range, use } from './src/property-fns';

/*
  Playground. You can try out faketastic here when developing your own functionality.
  Please do not check in changes of this file.

  To make git ignore this file for changes, enter this command into a terminal:

    $ cd path/to/this/repository/root
    $ git update-index --assume-unchanged example.ts

  Now you can edit this file without worrying about checking in these changes.
  See also: https://stackoverflow.com/a/17410119/3063191 or https://git-scm.com/docs/git-update-index

  To execute the code in this file, simply run:

    $ npm start
*/
const pet = createBuildable({ age: range(1, 15) });
const dog = extend(pet, { paws: range(0, 4) });

const output = build(use(dog, quantity(3)));
console.log(JSON.stringify(output, null, 2));
