# Naming

## Current State

- **TemplateFn**: Return a buildable and clone the template.
- **DirectiveFn**: (Template) Return a buildable and include processors with it.
- **BuilderFn**: (Statement & Directive) Return a buildable, include processors and have a builder-function as value.

- Everything returns a buildable.
- Every buildable represents a physical property on the output data.

## Modelling

- **combine:**: (Statement & Template)
  - returns a buildable
  - clones the template
  - adds processors
  - adds custom, hidden processor
  - 
