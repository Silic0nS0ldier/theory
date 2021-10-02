# FS Path

Dedicated path type to help avoid path related mishaps such as;

* Using a relative path for a resource which cannot be reliably referenced in such a manner.
* Using the wrong directory seperator.
* Leaking implementation details to the world by accidentally using absolute path.

It does **NOT** validate character range, length limitations and abusive patterns.

Input absolute paths must adhere to [RFC 8089](https://datatracker.ietf.org/doc/html/rfc8089) (`file://`). Helpers for absolute POSIX and Windows paths are available.
