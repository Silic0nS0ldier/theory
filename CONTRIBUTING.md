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
