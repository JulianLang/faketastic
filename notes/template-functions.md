# Template Functions

Template functions are functions that creates `Buildable` templates for faketastic. They take arbitrary input and convert it into Buildables that can then be built. Template functions have a signature like this:

`(...arbitraryInput: any[]) => Buildable<any>`

## Planned Template Functions

## `extend`-function

- [x] \*implemented in v0.0.15\*\*

Dynamically adds or overrides properties to/on a given Template.

**`function extend(base: Template, extended: Template): Template`**

```ts
const Person = template({
  name: oneOf(Names),
  age: range(1, 99),
});

const Student = extend(Person, {
  studentNumber: range(10000, 99999),
  semester: range(1, 6),
  studyPath: oneOf(StudyPaths),
});
```
