# Todo's

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
