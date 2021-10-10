# Fuzz - IO Validation

Stage: Ideation

A toolkit for generating assertions/tests based on information like;
* Input types
* Input usage (e.g. string that holds a path)
* Defined value ranges

That validates behaviour for;
* Inputs out of supported range
* Inputs at or close to range boundaries
* Integer over/underflows
* Float related arithmatic errors and pitfalls
* Path slashes and unqiue characteristics
* Path length limits

Inspired by [american fuzzy lop](https://lcamtuf.coredump.cx/afl/).
