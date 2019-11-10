# Referencing

References are what drive semantics in data.

## Types of Semantics

### Semantics in terms of quantity

**One data type is generated in relation to another one.**

*Example:* The entity `ProductTest` depends on the number of `Products` that got generated. There are multiple quantity-relation-rules imaginable here:

1. **number of product tests == number of products.** Every product has been tested exactly once.
2. **number of product tests <= number of products.** Some products haven't been tested yet.
3. **number of product tests >= number of products.** Some products have been tested multiple times.
4. **number of product tests is ranged.** There is a range of quantities possible, that deviate from the referenced quantity.
   - Example: There are `+/- 5 instances of ProductTest relative to <number-of-products>`
5. **number of product tests is arbitrary.** There is no restriction / any situation is possible.

[API Drafts: Quantity Semantics](./thoughts-on-api.md#quantity-semantics)

### Semantics in term of value-computations

#### Case A (Self References)

**A property or value is somehow dependent on another value that belongs
to the same entity.**

*Example:* The entity `Person` has a `name` and an `email` address. The `email` address should be aligned to the `name` in some way.

> If the random name is `"Max Merlin"`, then the email should be something like `"max.merlin@my-domain.com"`.

[API Drafts: Self References](./thoughts-on-api.md#self-references)

#### Case B (Mutual References)

**A property or value is dependent on a value of some of its parent's siblings.**

*Example:* The `Person` entity has a `name` and `friends`, which refers to other
generated `Persons`.

[API Drafts: Mutual References](./thoughts-on-api.md#mutual-references)

We can specify more things here, for example:

- **Bidirectionality:** In most cases friend-relationships are bidirectional. [API Drafts: Bidirectionality](./thoughts-on-api.md#bidirectionality)

* **Alternative Ref Strategies:** How to traverse the object-tree in order to find the correct node(s). Also you may want to narrow the allowed reference-targets to a specific type, since the `name` property is common to many types [API Drafts: Ref-Strategies](./thoughts-on-api.md#alternative-ref-strategies)

- **Quantity of items to select:** Depending on the situation, the reference should possibly include **_all_**, **_some_** (on a random basis or by filterFn) or **_one_** finding into its value. [API Drafts: Quantity Selection Mode](./thoughts-on-api.md#quantity-selection-mode)

### Case C (Child References)

**A data value is dependend on a child structure.**

*Example*: The Entity `Company` has a `ceo`, which has to be one of its `employees`.

[API Drafts: Mutual References](./thoughts-on-api.md#child-references)
