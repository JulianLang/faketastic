## `maybe`-processor

Executes specified processor functions based on a probability.

> Formal signature
>
> `maybe(opts: MaybeOptions | Probability (number), ...processorFns: Function[])`

```ts
type Probability = number;
enum EvaluationMode {
  // for each item eval if to execute or not
  ForEach,
  // eval once if all items should be executed or not
  ForAll
}
interface MaybeOptions {
  probability: Probability;
  mode: EvaluationMode; // default: ForEach
}
```

```ts
const template = template({
  // 50 - 50 chance that address gets generated asArray
  // (instead object, quantity is 1), and 50% chance to be undefined
  address: use(Address, maybe({ probability: 0.5, mode: EvalMode.Foreach },
                              asArray(),
                              canBe(undefined)));
  person: use(Person, maybe({ probability: 0.5, mode: EvalMode.ForAll },
                            canBe(undefined)));
});
```

## `extend`-function

Dynamically adds properties to a given Template.

> Formal signature:
>
> function extend(base: Template, extended: Template): Template

```ts
const Flat = template({
  address: use(Address),
  residents: use(
    extend(Person, {
      // dynamically adds a 'livesIn' property to Person instance:
      livesIn: ref('address.street')
    }),
    // processors ...
  )
});
```
