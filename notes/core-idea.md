# Core Idea of faketastic

## What?

**Model data entities in an easy way, which then produces data in any number and in a random, yet restriction-aligned manner.**

- **Defining Models ("Templates")**
  - ... as source for **data generation**
  - ... reflecting even **complex relationships**
  - ... in a **human readable and understandable** manner
  - ... in a **DRY** way, so that changes come as easy as possible
  - ... in a **data-agnostic** way
  - ... being **highly extensible** and **combinable**

## Weighted Properties

1. Simplicity & Understandabilty
2. Powerfullness
3. Extensibility

## Why?

- **Save time** when it comes to mock-data (rapid prototyping)
- **Stay on top of your models and data**
- **Enforce/ensure restrictions** on data models
- Incorporate **semantics** in data
- **Generate data you provide / know**
- **Random, yet domain specific test data** to be more confident about correct behavior when testing

## Alternatives

- Write data manually
- Write data manually then multiply the data with a for loop
- Copy/Paste from Online Generator Sources
- Use fake data APIs and adjust data as needed manually
- Don't test with data

## Outlook

- Defining Models as source for other outputs (e.g. docs & specs?)
- Being able to read sample/input data and auto-infer type and restrictions from that (maybe even interactively).

## Notes

- **What about performance?**. See last paragraph of https://medium.com/@paynoattn/creating-mock-data-for-jasmine-spec-and-protractor-e2e-tests-in-typescript-angular2-cf514c7ddb06

- Have a look at **JSON Generator (since it supports semantics in an easy way)**: https://next.json-generator.com/413c3rSiD
