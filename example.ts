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
import { build, Buildable, canBe, combine, oneOf, quantity, ref, template, use } from './src';

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

// @ts-ignore
const Directory: Buildable<any> = template({
  name: oneOf(['A', 'B', 'C', 'D', 'E', 'F']),
  files: use(File, quantity(2)),
});

Directory.value.directories = use(
  Directory,
  canBe(null, 0.3),
  quantity(() => 1),
);

const output = build(Directory);
console.log(JSON.stringify(output, null, 2));
