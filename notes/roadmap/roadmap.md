# Roadmap

## Next

- [Concept for Basic Referencing](../references/scope-1.md)

## Done

### `extend`-function

- [x] **implemented in v0.0.15**

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
