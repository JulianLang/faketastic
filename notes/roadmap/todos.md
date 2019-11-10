# Todo's

## Allow Wrapping / Containerization

**See here for a more detailed [article](./containerization.md).**

For example, this is the only way to manipulate the result of combine(), **after** every processor has been applied on it.

**Example:**

```ts
const Anything = template({
  something: wrap(
    // Wrapping Start
    combine(
      {
        /* ... */
      },
      mapFn,
      quantity(2),
    ),
    // Wrapping End, now do something with it:
    canBe(null),
    map(theResult), // map will then manipulate the combine's result array (array, because quantity = 2)
  ),
});
```

Maybe we need a better approach here though.

## ES6 Class Support

### Problem

At the moment ES6 classes can't be used since there is no way to correctly clone those instances in a
clean way. Moreover, it seems to be impossible to really clone built-in types such as `Map`.

### Possible Solutions

Maybe using constructor functions of (built-in and custom) classes in a dynamic way can help
cloning these correctly. But still it must be evaluated if it possible to clone objects and
instances side-by-side without losing information.

Something like:

```ts
function clone(value: any) {
  if (isClass(value)) {
    // call constructor dynamically:
    const ctor = value.constructor;

    return new ctor();
  } else {
    /* ... */
  }
}
```

Still, it is impossible in this context, to know which arguments to pass to the `ctor`;

### References

- https://stackoverflow.com/a/728694/3063191


---

# Done Todo's

## Concatenate Tree of a Dynamic Template with the Main Object Tree

- [x] **implemented in v0.0.15**

This will allow references that are located inside the dynamic template, to find their targets even if they are not located in the dynamic template.

**Example:**

A `Person` has a `Pet` which can be either a `Dog` or a `Cat`. Which type is dynamically chosen at runtime (=> "dynamic template"). Inside the template of each `Pet` the `Person` who owns it is referenced by name. This reference is currently impossible to resolve, as the dynamic template gets built in isolation from the main tree (it is **not** connected to it).

This should be solved in future as it is easy to do so and quite a hard restriction when ignored.

**The following example could not resolve the `owner` property yet:**

```ts
const Pet = template({
  owner: ref('name', { refStrategy: Parents, refType: Person }),
});
const Cat = extend(Pet, {
  /* ... */
});
const Dog = extend(Pet, {
  /* ... */
});

const Person = template({
  name: oneOf(Names),
  // the dynamically chosen template would not be able to find Person,
  // as it gets build isolated from the Person's / main object-tree:
  pet: oneOf([Dog, Cat]),
});
```

Simply connecting the isolated tree as a child of the `pet`-property-node would solve this problem as it connects the isolated tree to the main tree.
