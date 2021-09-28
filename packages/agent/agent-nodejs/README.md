# Theory NodeJS Agent

Agent for running theory tests against NodeJS.

## Planning

Dynamic import with a constant path is fairly easy to support (tooling like rollup can pick it up for example). Dynamic import with a conditional path is more difficult, but intelligent enough tooling can still work it out. The final case, dynamic import with unknown path is much more difficult and cannot be supported in all environments.

It is not the responsibility of the test library to patch dynamic import support, nor should it modify code if it can be helped.
Decision: Dynamic import won't be used in cross runtime dependencies, runtime specific dependencies are allowed if support on target, user code must be in a form the runtime is compatible with before theory picks it up.

Check for `node_modules` candidates that are not part of test (e.g. in folders above temporary directory). This is to provide basic (and cheap) test isolation.

**Example test file**

```ts
// proj/src/main.test.ts -> proj/dist/main.test.js (types stripped only)
import { is } from "@theory/assertions";

export function onePlusOne() {
    is(2, 1 + 1);
}
```

**Agent**

Agent runs in a separate process (web worker, this is to ensure handler remains responsive). It is responsible for managing the actual test runners.

The NodeJS test runner can operate multiple versions of NodeJS at once;
* Current, web worker (web worker spawned)
* Current, bin (new NodeJS instance started)
* Different local, web worker (new NodeJS instance started for first, instance recycled with code running in web workers)
* Different local, bin (new NodeJS instance started)

Additional ways to run NodeJS are also possible.
* Remote machine
* Docker

```ts
// @theory/agent-nodejs/src/worker.ts

// TODO
// Test files are loaded dynamically
// If test file is from a different generation (a file has changed), a new NodeJS process is required (only applicable to watch mode).

```

**Runner**

Runner is the runtime context where tests are run.

TODO
Does NodeJS reuse modules across workers?
What happens to a worker's workers if it is terminated?
What happens to a worker's child processes if it is terminated? (relevent for tests running in a separate NodeJS instance)

1. Handler starts agent worker
2. Agent worker recieves message with configuration
3. Agent does start tasks
4. Agent sends ready message
5. Handler sends test instructions
6. Agent starts runners as appropriate and dispatches test jobs
7. Runner recieves test file path and running instructions
8. Runner starts running tests
9. Tests complete, runner messages agent to indicate completion
10. Agent messages handler to indicate completion.
