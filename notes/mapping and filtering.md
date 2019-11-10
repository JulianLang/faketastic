# Mapping

## What

Mapping data is interesting when it comes to computed properties, like shown as `email`-property in this example:

```ts
const Person = template({
  name: oneOf(Names),
  // email is computed from the Person's name.
  email: ref('name', map(name => `${name}@centigrade.de`))
});
```

The advantage here is the easy reuse of already generated data, which helps a lot to create inner data semantics for realistic data sets.

# Filtering (experimental)

## What

Generated data can be filtered. For example there might be a lot of found ref targets and the template author can provide custom filter functions, which allow custom implementations for "reference **_all_** | **_some_** | **_one_**" or "reference **_any_** objects **_of type XY_**". That way authors can write custom reference logic, while being able to reuse traversing strategies of faketastic. Also fallback values arer part of those implementations.

```ts
const Person = template({
  name: oneOf(Names),
  friends: ref(
    'name',
    // gets all matching 'name' nodes as input
    filter((currentNode, accumlatedNodes) => {
      return doYouWantToRef(currentNode) ? currentNode : null;
    }),
  ),
});
```
