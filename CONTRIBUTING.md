# Contributing

The following assumes a POSIX environment with `curl`installed (among others).

```sh
# Get PNPM (you may need to restart your terminal)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Need NodeJS?
pnpm env use -g 16

# Install project dependencies
pnpm i

# Build
pnpm build -r

# Run tests
pnpm test -r
```

## Code Guidelines

As a general rule, TypeScript should be relegated to type validation only.

1. Don't use `const enum`. To prevents isolated module compilation and complicates usage in JavaScript projects.
2. Don't use `enum`. More simple code can be created using alternative constructs.
3. Avoid keying type narrowing with strings and numbers, use `Symbol` instead.
