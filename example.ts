import { map, quantity } from './src/attached-fns';
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
const parentModel = model({
  name: oneOf(['Hans', 'Pete', 'Sara', 'Sabine']),
  born: range(1990, 2003),
  email: use(
    {
      name: ref(
        'name',
        map(s => {
          return s.toUpperCase();
        }),
      ),
    },
    map(v => {
      return v;
    }),
  ),
});

const output = build(use(parentModel, quantity(3)));
// tslint:disable-next-line: no-console
console.log(JSON.stringify(output, null, 2));
