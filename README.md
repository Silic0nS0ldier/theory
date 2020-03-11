# Theory, a runtime portable test framework

Theory is a multi target test framework built to ease development of isomorphic JavaScript, and testing of difficult-to-reach environments.

## Goals

* 🤏 Low boilerplate
* 🐙 Easy testing of multiple targets (e.g. NodeJS, Chrome, Firefox)
* 🌏 Capacity to test against traditionally difficult to reach targets (e.g. Fitbit OS, remote browser, AWS Lambda)
* ➰Highly flexible
* 🛠 Highly extensible
* ⏩ High performance
* 🐜 Extremely lightweight
* 🖇 Easy to integrate with existing workflows

## Inspiration

* Bron, NodeJS test framework<br/>
  Super small, challenged expectations about test framework complexities. Showed that a test wrapper strictly speaking is not necessary.
* AVA, NodeJS test framework<br/>
  No magic globals, clean API, batteries included. There is a lot that AVA does right.
* xUnit, .NET test framework<br/>
  Attribute (similar to decoraters) driven test definitions are a nice clean "out of the way" solution. Hope is to adopt a similar pattern if and when JS supports decorators on functions.
* Azure Pipelines, CI/CD solution in the Azure DevOps suit<br/>
  Concept of build agents (as opposed to depending on xplat and a matrix) which enables pipelines to utilise platform specific strengths. Not the only service to support this model, but it does put it in the forefront. This inspired decoupling the user interface and test runner components.

## Planning

Any test is exported. This avoids need for an expensive test registry system, reducing complexity and lends itself to better performance thanks to less overhead.

Work on principle of test agents (current runtime, Chromium, VS Code, etc). Agent comms up to agent driver.

Support execution order and isolation mixing, where tests can be run within fresh environments (at performance expense) and run in different orders to assist in flushing out bugs that otherwise would go unnoticed.

Important that watcher scenarios are considered. Will almost definitely need to restart runner to test changes, so start time needs to be as fast as possible. Test discovery may require a separate process to avoid breaks and spec compliance.

Optional analytics. Include in config for default boilerplates. Features;
* Monitoring performance of test runners, use to direct performance efforts across ecosystem.
* Identify tangible changes across releases and issues
* Divide collected data down to;
  * Commit hash (if possible)
  * Environment
  * Test system version

Choas enginnering? Support would need to make testing common pitfalls easy, and have at most moderate difficulty for custom scenarios.

Would be nice to make each test file an alias for running that particular test file. How would configuration be discovered?

Some test agents will always take longer. Should be able to show available results before completion.