# Dev Notes

## Use Cases

### Setting random values

- `const tmpl = { value: int(1, 22) }`
- `const tmpl = { value: text(1, 6) }`

```ts
const Person = {
  age: int(18, 99),
  id: text(12), // string, length: 12
};
```

### Setting static values

- `const tmpl = { value: 12 }`

```ts
const Person = {
  age: 21,
  id: uuid(), // an external function returning something
};
```

### Setting random static values

- `const tmpl = { value: oneOf(Names) }`

```ts
const Person = {
  age: int(18, 99),
  name: oneOf(Names),
};
```

### Generate a number of values

- **initializer "quantity"**
- `const tmpl = { value: oneOf(Names, quantity(12)) }`
- `const tmpl = { value: int(1, 2, quantity(12)) }`
- `const tmpl = { value: use(Template, quantity(12)) }`

```ts
const Address = { city: oneOf(Cities), … }
const Person = {
  // a person can have 1 or 2 addresses:
  addresses: use(Address, quantity(1, 2)),
};
```

### Generate Object

- **preprocessor "use" (without quantity > 1) or native object**
- `const tmpl = { ... }`
- `const tmpl = use(Template, quantity(1))`

```ts
const Address = { city: oneOf(Cities), … }
const Person = {
  address: use(Address), // default quantity = 1
};
```

### Generate Array

- **Quantity > 1 or native arrays**
- `const tmpl = use(Template, quantity(2))`
- `const tmpl = int(1, 2, quantity(2))`
- `const tmpl = int(1, 2, asArray())`

```ts
const Address = { city: oneOf(Cities), … }
const Person = {
  // will be array, even if result is 1;
  // but would be object for quantity(1)
  addresses: use(Address, quantity(1, 2)),
};

function quantity(min, max): Quantity {
  if(min === 1 && max === undefined) {
    return 1;
  } else if(min && max) {
    return () => randomInt(min, max);
  }

  // ...
}
```

### Generate value that also can be Undefined or null custom value

- **postprocessor "canBe"**
- `const tmpl = int(1, 2, canBe(null, 0.2))`
- `const tmpl = int(1, 2, canBe(undefined, 0.2))`

```ts
const Address = { city: oneOf(Cities), … }
const Person = {
  // a person can have no address (20% likely)
  addresses: use(Address, canBe(undefined, 0.2)),
};
```

### Reference other values to keep semantics

- **postprocessor "ref"**
- `const tmpl = use(Template, provideAs('something')) … ref('something.id')`

```ts
// TODO: think if a realistic example for ref
…
```

### Debug build process

- **pre- and postprocessor "debug"**
- `const tmpl = use(Template, debug('all' | 'pre' | 'post'))`

```ts
const Person = {
  name: oneOf(Names, debug()) // all,
  age: int(18, 99, debug('post')), // post
  address: use(Template, debug('pre'))
}
```

## Build Cycles

1. pre-processors (hooks)
1. build-cycle (no-hooks)
1. post-processors (hooks)

## Encapsulate logic to build a property

Class represents current state of a property.

```ts
const Person = template({
  name: oneOf(Names),
});
const tmpl = template({
  id: uid(provideAs('id')),
  something: use(Person, quantity(1, 2)); // Property
  subobj: {
    str: oneOf(strings, canBe(undefined, 0.2), asObject()),
    bool: bool(),
    age: range(1, 10),
    arr: someOf(objects, 4),
    id: ref('id'),
  },
}); // returns Property instance

tmpl.build(12);

class Property {

  constructor(value, processorfns, quantity) {}

  public build(quantity?: Quantity = 1): any {
    if(quantity !== undefined) {
      this.quantity = quantity;
    }

    const count = resolveQuantity(quantity);
    const results = [];

    for(let i = 0; i < count; i++) {
      const built = this.doBuild(this.value);
      results.push(built);
    }

    return results;
  }

  private doBuild(obj: Property) {
    for(const property of Object.keys(obj)) {
      const value = obj[property];

      if(value is Property) {
        value.setParent(this);
        obj[property] = value.build();
      }
      // else: static value has been set,
      // such as true or 123
    }
  }

  addProcessor(fn, type): void;
  setParent(prop: Property): void;
  readonly value: any;
  parent: Property;
  children: Property[];
  quantity: Quantiy;
  // property bag, e.g. provideAs() attaches a "providerId",
  // which then can be referenced by ref()
  attachedProperties: Map<string, any>;
}

```

## WIP: Think of concepts for…

### Generating values that are instances of a class

```ts
class Node {
  public static EmptyNode = new EmptyNode();
  public clone(): Node;
  public remove(): void;
  public name: string;
  public children: Node[];
}

const NodeTemplate = instance(
  Node, // Node class (must have default ctor?)
  {
    name: oneOf(NodeNames),
    children: use(
      NodeTemplate,
      // important to allow 0 as minimum,
      // otherwise we'll get an endless loop
      quantity(0, 2),
    ),
  },
  // can also be an EmptyNode with 10% likelyhood
  // array here, since children is of type Node[]
  canBe(Node.EmptyNode, 0.1),
);

const tree = dataBuilder.build(NodeTemplate);
```
