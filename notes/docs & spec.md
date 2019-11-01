# Documentation and Specification via Faketastic

While interfaces give a hint on what data is considered valid, the data constraints defined via faketastic really gives insights in where valid data ranges begin and end.

Thus, faketastic should organize this input in a way, which enables auto-generated documentation about data specs.

## Considerations to data organisation

### Low Data Complexities

```ts
const toIsAdult = (age: number) => age >= 18;

const Person = template({
  name: oneOf(Names),
  age: range(1, 99),
  isAdult: ref('age', map(toIsAdult)),
});
```

Desired Documentation Output:

> **Person**
>
> - `name`: e.g. 'Jonas Frey', 'Mary Noor', [see all](.).
> - `age`: Number between 1 and 99.
> - `isAdult`: references `age`, `"age >= 18"`
