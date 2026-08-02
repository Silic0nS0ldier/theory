# Contributing

The supported setup is the bundled dev container, which pins Node 24 and enables pnpm via corepack. Open the repository in VS Code and choose **Reopen in Container**; `pnpm install` runs automatically on create.

```sh
# Build
pnpm -r build

# Run tests
pnpm -r test
```

Working outside the dev container is untested, but requires Node >= 24 and pnpm enabled through corepack (`corepack enable`), followed by `pnpm install`.

## Code Guidelines

As a general rule, TypeScript should be relegated to type validation only.

1. Don't use `const enum`. To prevents isolated module compilation and complicates usage in JavaScript projects.
2. Don't use `enum`. More simple code can be created using alternative constructs.
3. Avoid keying type narrowing with strings and numbers, use `Symbol` instead.
