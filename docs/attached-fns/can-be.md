# canBe

`canBe(value: any, likelihood = 0.5): void`

This processor replaces the value of the builder function it is attached to based on a given likelihood. `canBe` accepts as first parameter the replacement-value and as a second, the likelihood with which the regular value will be replaced.

## Example

```ts
const $Person = model({
  driverLicense: use($DriverLicense, canBe(null, 0.7))
});
```
