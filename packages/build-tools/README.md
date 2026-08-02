# Build Tools

Build tools for Theory packages, optimised for correctness (or will be one day).

## TypeScript configurations

Pick a base according to what the package's `src` is allowed to touch:

| Config                | Extend it when                                                        |
| --------------------- | --------------------------------------------------------------------- |
| `tsconfig.base.json`  | The package is runtime neutral. `types` is empty, so `node:*` imports and Node globals do not resolve. |
| `tsconfig.node.json`  | The package deliberately binds to Node, such as a host adapter or the CLI. |
| `tsconfig.test.json`  | Never extended directly by a package's main config -- see below.        |

Because `rootDir`, `include` and `exclude` resolve relative to the file that declares
them, they cannot be inherited and must be repeated in each package.

## Tests

Tests run under `node --test` whatever the package under test targets, so they are always
checked against Node types. A package with tests excludes them from its emitted project
and adds a `tsconfig.test.json`:

```json
{
    "extends": "@theory/build-tools/tsconfig.test.json",
    "include": [
        "./src/**/*"
    ]
}
```

`tbt build` type checks that project after emitting, so a runtime neutral package still
gets full coverage of its tests without leaking Node into what it ships.
