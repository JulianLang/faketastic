# Why and where to use?

- They could generate spec in prosa text. But within an application. How and where to consume?
- Out of scope for now.

### Interpreter

Part of a property function implementation. Interprets a property and generates matching output of a specific target format.
The format could be:

- mock data
- specification as text

`interpreter<T>(input: any): T`

```ts
export function oneOf(values: any[], ...attachedFns) {
  function asData() {
    return randomItem(values);
  }

  function asSpec() {
    return 'Can be one of ' + toString(values);
  }

  return createBuildable(
    {
      default: asData,
      spec: asSpec,
    },
    faketastic.oneOf, // id string "faketastic.oneOf"
    attachedFns,
  );
  // => { [faketastic.interpret]: { default: asData, spec: asSpec } }
}

function toHtml(input: any) {
  function oneOf(items: any[]) {
    const values = toString(items);
    return paragraph(`Can be one of "${values}"`);
  }

  return buildWith(v, [
    {
      fn: faketastic.oneOf, // imported id string "faketastic.oneOf"
      use: oneOf,
    },
  ]);
}

const mdl = model({
  numbers: oneOf([1, 2, 3]),
});

const result = toHtml(mdl);
const data = build(mdl);

export function canBe(value: any) {
  function asData() {}
  function asSpec() {}

  return createProcessorFn('preprocess', {
    default: asData,
    spec: asSpec,
  });
}
```

```ts
oneOf(Names, quantity(2, canBe('n.A.')), canBe(null));

const txt = spec($Person);
const data = build($Person);
```
