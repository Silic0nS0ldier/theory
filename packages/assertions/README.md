# Assertions

Assertions for Theory built with speed, correctness, and determinism in mind. Not exception based.

## Usage

### `conforms`

Asserts that a value conforms to a specification. Useful for when a value is coming from a blackbox, and cannot be statically validated.

Functionally similar to a JSON Schema validator, but for JS values.

e.g.

```ts
import { TypeNames } from "...";
// true
conforms(
    {
        foo: "bar",
        foobar() {}
    },
    {
        type: TypeNames.OBJECT,
        properties: {
            foo: "bar",
            foobar: {
                type: TypeNames.FUNCTION,
            }
        }
    }
);
```

### `deepEqual`

Asserts that values are deeply equal, but not the same.

Inputs must not be a primative (use `is` for asserting those).
If referential equality is encountered at any point during traversal, the assertion will fail. This is to prevent false positives and avoid flaky tests (tested code should not be able to affect the expected value).

e.g.

```ts
// true
deepEqual({ foo: "bar" }, { foo: "bar" });
```

### `is`

Asserts that values are identical (referentially equal for reference types).

```ts
// true
is(1, 1);
// false
is({}, {});
// true
const t = {};
is(t, t);
```

### `not`

Logical opposite of `is`.

### `similar`

Sometimes tests have an unavoidable source of entropy which is tedious to assert. This is where `similar` becomes useful.

This assertion combines snapshotting and an optional expected value (to provide a baseline) to find what parts vary from run to run and what is an acceptable amount of variation.

Behind the scenes this uses `conforms` when asserting.

TODO: Figure out API surface.

### `snapshot`

Asserts that a value is deeply equal to a persisted copy from a past run.

```ts
// true/false, depending on persisted baseline
snapshot({});
```

### `throws`

Asserts that a callback throws.

---


npm true-equals


## Snapshots

testFunctionName

1

```
{
    foo: Foo {
        bar: "foobar",
    },
    bar: Bar(...) {
        customProp: "barfoo",
    },
    foobar: FooBar(...),
    barbar: BarBar,
}
```

```json
{
    "type": "object",
    "properties": {
        "foo": {
            "type": "class-instance",
            "properties": {
                "bar": "foobar"
            }
        },
        "foo": {
            "type": "function",
            "properties": {
                "customProp": "barfoo"
            }
        },
        "foobar": {
            "type": "function"
        },
        "barbar": {
            "type": "class-definition",
            // ...
        }
    }
}
```
