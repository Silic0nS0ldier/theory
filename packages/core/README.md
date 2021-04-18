# Theory Core

Brings everything together with as small an API surface as possible. The core contributes framework primatives that most everything depends on.

## Directory

* Writing tests?
  ```ts
  import { deepEqual, similar } from "@theory/assertions";
  import type { TestContext } from "@theory/core";
  import { decorate } from "@theory/core";
  import { describe, skip } from "@theory/core/test-decorators";

  export const fooBar = decorate(
      describe("A decorated test"),
      skip
  ).impl(t => {
      t.log("Logging something associated with this test");
      deepEqual(
          { foo: "bar" },
          { bar: "foo" },
      );
  });

  export function barFoo(t: TestContext) {
      t.log("Logging something associated with this test");
      similar(
          new Date(),
          new Date(),
      );
  }

  ```
