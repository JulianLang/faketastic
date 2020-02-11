import { quantity } from './src/attached-fns';
import { build } from './src/builder';
import { model, oneOf, range, ref, use } from './src/property-fns';

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
const ParentModel = model({
  name: oneOf(['Hans', 'Pete', 'Sara']),
  born: range(1990, 2003),
  email: {
    ref: ref('name'),
  },
});

const output = build(use(ParentModel, quantity(2)));
console.log(JSON.stringify(output, null, 2));
