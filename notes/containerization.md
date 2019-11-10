# Containerization

## What

Introduce a concept where a node in the `object-tree` is present for manipulation of its children, but **not** rendered into the final mock data. Conceptually it's similiar to a `ng-template` or `ng-container` which is only a helper construct for more control over the tree's structure.

## Why

The current possibilities given by faketastic are no sufficient in some cases to really control the shape of the final mock data. Especially the introduction of computed data via `combine` lead to missing grip on nodes when missing the concept of containers.

## Example

The following example demonstrates that there is currently no way to manipulate the generated array of email entries:

```ts
const Person = template({
  name: oneOf(Names),
  email: combine(
    {
      name: ref('name'),
      domain: oneOf(Domains),
    },
    v => v.name + '@' + v.domain + '.de',
    /* 
        all the following processors refer the email entries itself,
        rather than the result (the array of email entries). So currently
        there is no way to refer the generated array of email addresses.
        This way you cannot say "the array of emails canBe(null)" for example.
    */
    quantity(2),
    canBe(null), // will refer all entries theirselves, not the containing array :(
  ),
});
```

To provide that behavior, we need some way to transparently wrap the combine node to add additional processors to this node, while not changing the structure of the final generated data. There could be something like a `wrap` functionality which can contain a buildable:

```ts
const Person = template({
  name: oneOf(Names),
  // wrap itself, will not be rendered, but its contents after manipulation
  email: wrap(
    combine(
      /* combine calculation ... */
      quantity(2) // refers the email entries
    ),
    canBe(null), // targets the generated array of emails! :)
  ),
});
```

## Todo

> ### Better Naming than "wrap"?
> TODO: langju: Try to think of better name than `wrap()` since it does not read too naturally in code (or does it)?
>
> Possible names:
> - **"beinhalten"**
>   - `contain()`
>   - `wrap()`
> - **"anwenden"**
>   - `apply()`
> - **"weiterleiten"**
>   - `forward()`
>   - `transfer()`
> - **"durchlassen"**
>   - `pass()` / `passthrough()`
> - `...`?

