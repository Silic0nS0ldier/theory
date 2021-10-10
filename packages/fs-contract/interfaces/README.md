# FS Contract

Contracts for file system access, designed with opinionated best practises in mind. API is relatively low-level, the expectation being that more advanced functionality can be built on top.

Goals include;

* Controlling file system access in source by providing access scopes.
* Making code which uses the file system easier to test by promoting its use as a service, and speeding tests up by avoiding costly disk IO.
* Promoting development of more fault tolerant code by expressing error states in return values (since exception handling is traditionally a black box).
* Discouraging anti-patterns like checking file existance prior to reading, which can change between the calls.
* Decoupling libraries from runtime specific FS API implementations.
* Avoiding common pitfalls associated with string paths via dedicated primatives.

Some contract slices implicitly include additional capabilities to prevent misuse (e.g. overwrite capability comes with delete, read includes discovery).

Unlike the NodeJS FS APIs, most interactions lack a synchronous counterpart. This maximises compatibility (e.g. browser support) and avoids blocking threads.

## TODO

* Create basic error types for common problems (too long path, blocked by permissions, out of space).
* Create separate contracts for interactions which are not universally applicable or supported (e.g. watching and permissions).
