# Why and where to use?

- They could generate spec in prosa text. But within an application. How and where to consume?

```ts
export function oneOf(values: any[], ...attachedFns) {
  function asData(items: any[]) {
    return randomItem(items);
  }

  function asSpec(items: any[]) {
    return 'Can be one of ' + toString(items);
  }

  return createBuildable(
    {
      default: asData,
      spec: asSpec,
    },
    values,
    faketastic.oneOf, // id string "faketastic.oneOf"
    attachedFns,
  );
  // => { [faketastic.interpret]: { default: asData, spec: asSpec, $args: values } }
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
