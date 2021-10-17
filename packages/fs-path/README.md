# FS Path

Dedicated path type to help avoid path related mishaps such as;

* Using a relative path for a resource which cannot be reliably referenced in such a manner.
* Using the wrong directory seperator.
* Leaking implementation details to the world by accidentally using absolute path.

It does **NOT** validate character range and platform path length limitations.
It does **NOT** provide protection against attacks such as directory traversal.

Input absolute paths must adhere to [RFC 8089][RFC-8098] (`file://`).
Input relative paths must start with `./`, and otherwise adhere to a subset of [RFC 8089][RFC-8098].

## TODO

- Helpers for POSIX and Windows path normalisation (must be tree shakeable).
- Create a spec for relative paths to formalise which parts it has in common with [RFC 8089][RFC-8098].

[RFC-8089]: https://datatracker.ietf.org/doc/html/rfc8089
