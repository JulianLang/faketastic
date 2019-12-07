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
import { build, Buildable, combine, oneOf, quantity, randomInt, ref, template, use } from './src';
import { withRecursion } from './src/template-modifier/with-recursion';

// @ts-ignore
const File = template({
  name: oneOf(['empty', 'nice', 'something']),
  extension: oneOf(['css', 'txt', 'rtf', 'docx', 'mp3']),
  fileName: combine(
    {
      name: ref('name'),
      ext: ref('extension'),
    },
    v => `${v.name}.${v.ext}`,
  ),
});

const Directory: Buildable<any> = template(
  withRecursion(
    {
      name: oneOf(['A', 'B', 'C', 'D', 'E', 'F']),
      files: use(File, quantity(2)),
    },
    'directories',
    quantity(() => randomInt(0, 2)),
  ),
);

const output = build(Directory);
console.log(output);
console.log();
