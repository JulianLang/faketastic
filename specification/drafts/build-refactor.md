```ts
buildData(node) {
  // pre-build all
  traverse(node, n => prebuild(n));

  // build value nodes (incl. postbuild)
  valueNodes = findNodes(node, n => n.currentValue() === 'value');
  valueNodes.forEach(n => buildValueNode(n));
  valueNodes.forEach(n => resolveIfReference(n));

  // build parent nodes (incl. postbuild)
  traverse(node => {
    if(node.currentType() === 'value') {
      return;
    }

    buildParentNode(node);
  },
  leafTraverser);
}
```

```ts
buildData(node) {
  // pre-build all
  traverse(node, n => prebuild(n));

  const valueNodes = [];
  const parentNodes = [];

  // build value nodes (incl. postbuild)
  traverse(node, n => {
    switch(n.currentType()) {
      case 'value':
        valueNodes.push(n);
        break;
      case 'object':
      case 'array':
        parentNodes.push(n);
        break;
      default:
        throw new Error('unknown node type.');
    }
  });

  valueNodes.forEach(n => buildValueNode(n));
  valueNodes.forEach(n => resolveIfReference(n));

  // build parent nodes (incl. postbuild)
  traverse(node => {
    if(node.currentType() === 'value') {
      return;
    }

    buildParentNode(node);
  },
  leafTraverser);
}
```
