# Theory, a runtime portable test framework

Theory is an in-development multi target test framework built to ease development of isomorphic JavaScript, and testing of difficult-to-reach environments.

## Goals

* 🤏 Low boilerplate
* 🐙 Easy testing of multiple targets (NodeJS, Deno, Chrome, Firefox, Safari, Edge, IE, Fitbit OS, Electron, VSCode extension host, WebView components, etc)
* 🌏 Capacity to test against traditionally difficult to reach targets (e.g. Fitbit OS, remote browser, AWS Lambda)
* ➰ Highly flexible
* 🧱 Highly extensible
* 📈 Highly scalable
* ⏩ High performance
* 🐜 Extremely lightweight
* 🧩 Easy to integrate with existing workflows

## Inspiration

* Bron, NodeJS test framework<br/>
  Super small, challenged expectations about test framework complexities. Showed that a test wrapper strictly speaking is not necessary.
* AVA, NodeJS test framework<br/>
  No magic globals, clean API, batteries included. There is a lot that AVA does right.
* xUnit, .NET test framework<br/>
  Attribute (similar to decoraters) driven test definitions are a nice clean "out of the way" solution. Hope is to adopt a similar pattern if and when JS supports decorators on functions.
* Azure Pipelines, CI/CD solution in the Azure DevOps suit<br/>
  Concept of build agents (as opposed to depending on xplat and a matrix) which enables pipelines to utilise platform specific strengths. Not the only service to support this model, but it does put it in the forefront. This inspired decoupling the user interface and test runner components.

## Why

The initial inspiration behind this library was to develop something similar to ava for the purposes of testing VSCode extensions. As initial prototyping of the API surface progressed, it became clear that this could be made more generic such that tests might be run in arbitrary environments and runtimes. It is hoped that this expansion of scope might see more environments tested against with the hope being that more code is specification compliant (or at least handles the various deviations from the spec) and portable.

## Planning

Tests are exported, avoiding the need for test registry systems and enforcing test identity uniqueness at a language level.

Runtimes are supported via agent packages which keep integration logic out of the core.

Use an efficient agent for test discovery (not test files, just identities). Avoids duplicating effort.

Certain test agents are likely to take a long time to spin up, shouldn't hold up execution of tests on faster agents.

Support specifying a configuration.

Core libraries should never throw, instead expressing errors via the result. `try..catch` carries a significant performance cost (so minimise their usage) and as they aren't expressed as part of a functions signiture are a source of runtime errors.

### Test Validation

Support randomising execution order and complete isolation to flush out flaky tests which are affected by other tests.

### Watch Mode

Watch mode is a common feature for JS test frameworks, it should be a part of v1.

Reusing runtimes for tests is faster, but can be tricky. Memory usage may accumulate over time (old parsed source persisting) and many JS APIs are not pure. It should still be an option however, if not in v1.

### Analytics/Quality Control

Opt-in analytics. Handy for;
* Profiling upstream dependencies against a large sample set.
* Identifying framework breakages across releases, and quicker issue detection.

Useful data includes;
* Commit hash (if possible)
  * Might be interesting to explore identifiction of a commit that has caused a failure for CI settings.
* Environment
* Test system version

### Error Reporting

Differentiate between failure types. e.g.;
* Assertion failure
  * Similarity between expected and unexpected values
* Error thrown
  * Runtime error (e.g. syntax error)
  * Error from imported library (tricky to implement)
  * Error defined by code being tested.

Mistakes happen, particularly where async/await and callbacks are concerned. Should make it as easy as possible (and at the very least possible) to trace rouge promises and callbacks that are continuing after the test has terminated. This is doable on NodeJS via async hooks, other runtimes are much more difficult.

## Future Scope

* Chaos engineering, implemented via a plugin. Good way to prove framework extensibility. Good way to help people catch common pitfalls more easily.

* Test file as execution alias. Running the file via a supported runtime should test it as though runner was triggered with a single file.
  Tricky given there is no test wrapper.
  ```
  node path/to/test-file.test.js
  ```

* First-class multi-config support.
  Should be possible to run everything with 1 command and no performance hit.
  Would necessitate a new process for each config to guard against side effects.

* Memory monitor.
  Useful for identifying memory leaks and unintended memory mismanagement.
  Handy for tracking down issues like that caches that never are unloaded.

* Mutation testing.
  A technique where a program modifies code to create "mutations" that help to;
  * Validate unit tests.
  * Identify superfluous code.
  * Improve integrity by flushing out implementation weaknesses.
  See Stryker Mutator.

## Getting Started

```sh
pnpm i
pnpm run build -r
pnpm run test -r
```
