```ts
interface Buildable<T> {
  value: T;
  initializers: (node: IObjectTreeNode) => void;
  finalizers: (node: IObjectTreeNode) => IObjectTreeNode;
  preprocessors: (value: T) => T;
  postprocessors: (value: T) => T;
}

const Person = {
  name: combine(Names, Surnames),
  age: range(11, 100),
  address: use(
    {
      street: oneOf(Streets),
      zip: range(152824, 923467),
    },
    quantity(2),
  ),
};

build(Person, 3);

function build(tmpl: any) {
  const tree = new ObjectTree(tmpl);

  tree.traverse(n => (n.value as Buildable).initializers.forEach(i => i(n)));
  tree.traverse(n => (n.value as Buildable).preprocessors.forEach(i => i(n.value)));
  tree.traverse(n => (n.value as Buildable).postprocessors.forEach(i => i(n.value)));
  tree.traverse(n => (n.value as Buildable).finalizers.forEach(i => i(n)));
}

function quantity(node: IObjectTreeNode) {
  for(i = 0; i < desiredCount - 1) {
    node.parent.add(node, true);
  }
}

/*
  root (Company)
    - name
    - est
    - Person-1
      - name
      - age
    - Person-2
      - name
      - age
*/
```
