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

Any test is exported. This avoids need for an expensive test registry system, reducing complexity and lends itself to better performance thanks to less overhead.

Work on principle of test agents (current runtime, Chromium, VS Code, etc). Agent comms up to agent driver.

Support execution order and isolation mixing, where tests can be run within fresh environments (at performance expense) and run in different orders to assist in flushing out bugs that otherwise would go unnoticed.

Important that watcher scenarios are considered. We can never be confident code is 100% pure (no side effects) so environment needs to be scrubbed between runs. Worthwhile in future adding opt-in agent reuse. Test discovery needs to occur in a separate process to isolate errors, minimise damage should a dependency contain malware (runner will need file system and potentially network access, so a lot of damage could be done), and simplify the overall implementation (no code reload hacks needed).

Opt-in analytics. Handy for;
* Profiling upstream dependencies against a large sample set.
* Identifying framework breakages across releases, and quicker issue detection.

Useful data includes;
* Commit hash (if possible)
  * Might be interesting to explore identifiction of a commit that has caused a failure for CI settings.
* Environment
* Test system version

Certain test agents are likely to take a long time to spin up, shouldn't hold up execution of tests on faster agents.

Support specifying a configuration.

Differentiate between failure types. e.g.;
* Assertion failure
  * Similarity between expected and unexpected values
* Error thrown
  * Runtime error (e.g. syntax error)
  * Error from imported library (tricky to implement)
  * Error defined by code being tested.

A lot of the usability enhancements come with a perfromance cost. Start time needs to be kept minimal, so ideally enhancements can be applied after tests have run (as much as is possible).

## Future Scope

* Chaos engineering, implemented via a plugin. Good way to prove framework extensibility. Good way to help people catch common pitfalls more easily.

* Test file as execution alias. Running the file via a supported runtime should test it as though runner was triggered with a single file.
  Consideration for how the configuration is discovered is needed however. Further, what about projects with build steps?

* First-class multi-config support.
  Should be possible to run everything with 1 command and no performance hit.
  Would necessitate a new process for each config to guard against side effects.
