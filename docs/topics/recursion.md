# Recursive Models

Faketastic allows you to write recursive models. There is a `itself` [builder function](../builder-fns/builder-fns.md) that declares a property as recursive. Let's use an example for better understanding; consider the following `$Directory` model:

```ts
import { model, itself, RecursionDepth, oneOf, quantity, randomInt } from 'faketastic';

export const $File = model({
  /* ... */
});

export const $Directory = model({
  name: oneOf(['Documents', 'Pictures', 'User', 'Public']),
  files: use(
    $File,
    quantity(() => randomInt(0, 2)),
  ),
  directories: itself(
    RecursionDepth([], 1, 2),
    quantity(() => randomInt(0, 4)),
  ),
});
```

Let's go throught it: The `$Directory` model says:

- A directory has a name, which is either `"Documents"`, `"Pictures"`, `"User"` or `"Public"`.
- A directory has files, for which we want to use the `$File` model. A directory has at least `0` and at most `2` files (implicit: since the given `quantity` parameter is not constant `1`, the output will always be within an array, no matter what quantity-amount gets chosen).
- A directory has subdirectories (`itself`). The recursion min-depth is `1` and the max-depth is `2`. When ending the recursion, set the value `[]` (empty array) instead of another recursion. Based on that, the model will have at least one recursion level.

```ts
import { build } from 'faketastic';
import { $Directory } from './models';

const directory = build($Directory);

/*
    Outputs something like:
    File instances are left out (...) for simplicity.

    {
      name: "Public",
      files: [],
      directories: [
        {
          name: 'Documents',
          files: [ ... ],
          directories: [
            name: 'Public',
            files: [],
            // recursion ended at this level, so value [] was set:
            directories: [],
          ]
        },
        {
          name: 'Private',
          files: [ ... ],
          directories: [
            name: 'Users',
            files: [ ... ],
            // recursion ended at this level, so value [] was set:
            directories: [],
          ]
        },
      ]
    }
*/
```

---

### Topics

- [Overview](../overview.md)
- [Getting Started](../getting-started.md)
- [BuilderFns](../builder-fns/builder-fns.md)
- [AttachedFns](../model-fns/model-fns.md)
- [ModelFns](../model-fns/model-fns.md)
