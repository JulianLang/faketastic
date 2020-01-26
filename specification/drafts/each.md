```ts
model({
  name: each(
    someOf(Names),
    map(name => name.toLowerCase()),
  ),
});
```
