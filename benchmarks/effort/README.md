# Effort benchmark

Compares Theory against other test frameworks by counting **operations**, not seconds.

A wall clock benchmark measures the machine as much as the framework: CPU model, thermal state,
background load and I/O latency all move the number. This harness instead counts how much work a
framework asks the runtime to do. Two runs of the same workload on the same runtime produce the
same counts whether the machine is idle or saturated, so a result is meaningful without a
controlled lab and a regression cannot be explained away as noise.

Real world performance is explicitly out of scope. A framework can do fewer operations and still
be slower, and this harness will not notice.

## What is measured

Each measured process runs with `NODE_V8_COVERAGE` set, which is node's wrapper around the
DevTools [`Profiler.startPreciseCoverage`](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/#method-startPreciseCoverage)
call with `callCount` and `detailed` enabled. Every child process inherits the variable and dumps
its own file, so worker pools are captured without patching any framework.

From those dumps, per script:

| Metric | Meaning |
| --- | --- |
| `scripts` | Scripts compiled, summed over processes. Loading the same file in five workers counts five times. |
| `sourceBytes` | Bytes of source compiled. Stands in for parse effort. |
| `functions` | Distinct functions that ran at least once. |
| `calls` | Function invocations. The headline number. |
| `blocks` | Basic block executions, so a hot loop is not flattened into one call. |

Every script is attributed to a bucket, resolved from the nearest `package.json`:

* `framework` — the framework's own packages, including node internals for `node:test`.
* `assertions` — assertion libraries shipped separately, currently only `@theory/assertions`.
* `test-code` — the generated suite files and the subject under test.
* `dependencies` — everything else the framework drags in.
* `runtime` — node's own bootstrap and module loader.
* `harness` — this package's preload, kept separate so it does not flatter or penalise anyone.

## Fairness

Every flavour asserts the same thing about the same subject (`fibonacci(10) === 55`, from an
identical generated `subject.js`) using that framework's idiomatic equality assertion. Differences
in `test-code` therefore reflect the declaration API, not the work being tested.

Scenarios vary shape so fixed cost can be separated from marginal cost: `minimal` (1 test),
`wide` (50 files × 1 test), `deep` (1 file × 50 tests), `typical` (20 × 10) and `typical-async`.

Theory has no finished CLI yet, so `src/runners/theory-runner.js` stands in for one. It is counted
as `framework`, and its cost is not comparable to a mature CLI's until it grows the same features.

## Determinism

Several things had to be pinned down before counts repeated:

* **`--predictable`.** Without it V8's concurrent GC can flush the feedback vectors that hold
  coverage counts, so hot functions under report by a varying amount. This was by far the largest
  source of noise; `node:path#isPosixPathSeparator` swung by 30% between identical runs.
* **A preloaded coverage guard.** Pools terminate workers with a signal, which skips node's exit
  time dump. `src/runners/coverage-guard.js` calls `v8.takeCoverage()` on `SIGTERM`, `SIGINT` and
  `SIGHUP`. Without it vitest's worker vanished from the results entirely and its `test-code`
  bucket read zero.
* **A fixed, minimal environment.** `PATH`, `HOME`, `TMPDIR`, `TZ` and colour variables are set
  explicitly, and `HOME`/`TMPDIR` point at a sandbox that is wiped before every run. Inherited
  environment steers frameworks down different code paths, and a warm cache makes a second run
  cheaper than the first.
* **Fixed paths.** Suites are generated at a stable location rather than a temporary directory,
  because script URLs appear in coverage output and a random directory name would change the keys.
* **Regeneration per repeat.** The work directory is rebuilt before each repeat so nothing carries
  a transform cache forward.

What remains is checked rather than assumed: every cell runs `--repeats` times and the results are
compared script by script. Anything that differs is reported by name in the instability section.

Single process frameworks (`theory`, `mocha`, `jest`, `node-test`) come out bit for bit identical.
Pool based ones retain a little noise — pipe reads from esbuild chunk differently, progress timers
fire a different number of times — which is why `--tolerance-ppm` exists. Observed drift is under
0.2%; the default gate is 0.5%.

Verified: with all cores saturated by busy loops, `theory` and `mocha` produced byte identical
counts and `jest` moved by 4 calls in 555,433 (7 ppm).

## Usage

```sh
pnpm bench
pnpm bench --frameworks=theory,vitest --scenarios=typical --repeats=5
pnpm bench --tolerance-ppm=0   # demand bit for bit reproducibility
```

Writes `results/effort.json` and `results/effort.md`. Exits non-zero if any cell drifts beyond the
tolerance, so it can gate CI.

Counts are only comparable within one node version and one set of dependency versions, both of
which are recorded in the report. Competitor versions are pinned exactly for that reason.
