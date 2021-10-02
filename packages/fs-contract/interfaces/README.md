# FS Contract

Contracts for file system access, designed with opinionated best practises in mind. API is relatively low-level, the expectation being that more advanced functionality can be built on top.

Goals include;

* Controlling file system access in source by providing access scopes.
* Making code which uses the file system easier to test by promoting its use as a service, and speeding tests up by avoiding costly disk IO.
* Promoting development of more fault tolerant code by expressing error states in return values (since exception handling is traditionally a black box).
* Discouraging anti-patterns like checking file existance prior to reading, which can change between the calls.
* Decoupling libraries from runtime specific FS API implementations.
* Avoiding common pitfalls associated with string paths via dedicated primatives.

## TODO

* Determine read/write API surface. Keeping memory usage low and performance high is a priority. Investigation of existing FS APIs is necessary.
* Create basic error types for common problems (too long path, blocked by permissions, out of space).
* Copy/move API surface, and how to discourage/prevent work arounds with read/write/delete API surfaces.
