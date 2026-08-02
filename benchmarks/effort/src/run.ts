import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { execPath } from "node:process";
import { pathToFileURL } from "node:url";
import type { Framework } from "./frameworks.ts";
import { coverageRoot, harnessRoot } from "./generate.ts";
import type { Scenario } from "./scenarios.ts";

const sandboxRoot = path.join(harnessRoot, ".sandbox");
const coverageGuard = pathToFileURL(
    path.join(harnessRoot, "src", "runners", "coverage-guard.js"),
).href;

/**
 * Without this, V8 loses call counts unpredictably: concurrent GC can flush the feedback vectors
 * that hold them, so hot functions under report by a varying amount. `--predictable` serialises
 * V8's background work, which makes the counts reproducible. Child processes inherit it through
 * `execArgv`, which is how every framework here spawns its workers.
 */
const deterministicFlags = [ "--predictable" ];

export type RunOutcome = {
    readonly status: number|null,
    readonly signal: string|null,
    readonly coverageDir: string,
    readonly stdout: string,
    readonly stderr: string,
};

/**
 * A fixed, minimal environment. Anything inherited from the host could steer a framework down a
 * different code path, and the paths are fixed because they surface in coverage script URLs.
 */
function environmentFor(coverageDir: string): NodeJS.ProcessEnv {
    return {
        PATH: "/usr/local/bin:/usr/bin:/bin",
        HOME: path.join(sandboxRoot, "home"),
        TMPDIR: path.join(sandboxRoot, "tmp"),
        TZ: "UTC",
        LANG: "C.UTF-8",
        CI: "1",
        NO_COLOR: "1",
        FORCE_COLOR: "0",
        NODE_V8_COVERAGE: coverageDir,
        // Inherited by every child, so pooled workers also dump what they executed.
        NODE_OPTIONS: `--import ${coverageGuard}`,
    };
}

/**
 * Runs one measured process tree. Every child inherits `NODE_V8_COVERAGE` and writes its own
 * coverage file, so worker pools are captured without instrumenting the frameworks.
 */
export function run(framework: Framework, scenario: Scenario, workDir: string): RunOutcome {
    const coverageDir = path.join(coverageRoot, `${framework.id}--${scenario.id}`);

    // Wiped every repeat, otherwise a warm cache would make the second run cheaper than the first.
    for (const directory of [ coverageDir, sandboxRoot ]) {
        rmSync(directory, { force: true, recursive: true });
    }

    mkdirSync(coverageDir, { recursive: true });
    mkdirSync(path.join(sandboxRoot, "home"), { recursive: true });
    mkdirSync(path.join(sandboxRoot, "tmp"), { recursive: true });

    const result = spawnSync(execPath, [ ...deterministicFlags, ...framework.argv(scenario, workDir) ], {
        cwd: workDir,
        env: environmentFor(coverageDir),
        encoding: "utf8",
        maxBuffer: 512 * 1024 * 1024,
    });

    if (result.error) {
        throw result.error;
    }

    return {
        status: result.status,
        signal: result.signal,
        coverageDir,
        stdout: result.stdout,
        stderr: result.stderr,
    };
}
