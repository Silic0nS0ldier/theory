# Theory Core

Brings everything together with as small an API surface as possible. The core contributes framework primatives that most everything depends on.

## Directory

* Writing tests?
  ```ts
  import { deepEqual, similar } from "@theory/assertions";
  import { skip, tag, test, title } from "@theory/core";

  // Identity is the module path plus export name, so a title is optional.
  export const fooBar = skip(title("A skipped test")(test(() => {
      deepEqual(
          { foo: "bar" },
          { bar: "foo" },
      );
  })));

  export const barFoo = tag("flaky")(test(() => {
      similar(
          new Date(),
          new Date(),
      );
  }));
  ```

  Modifiers (`skip`, `only`, `tag`, `timeout`, `title`) accept either a bare function or an already
  declared test and return a new test, so they compose in any order and can migrate to function
  decorators once the proposal lands.

  Assertions resolve the active test from ambient context, so tests take no arguments. They record
  outcomes rather than throwing; a test fails when its report contains a failed assertion.
