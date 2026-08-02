import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Scenario } from "./scenarios.ts";

const harnessRoot = path.resolve(fileURLToPath(import.meta.url), "../..");
const modulesRoot = path.join(harnessRoot, "node_modules");
const theoryRunner = path.join(harnessRoot, "src", "runners", "theory-runner.js");

export type GeneratedFile = {
    readonly name: string,
    readonly contents: string,
};

export type Framework = {
    readonly id: string,
    /** Packages whose execution counts as framework overhead rather than user work. */
    readonly frameworkPackages: readonly string[],
    readonly assertionPackages: readonly string[],
    /** Absolute paths counted as framework overhead, for code outside any published package. */
    readonly frameworkPaths: readonly string[],
    /** Non `file:` script URLs counted as framework overhead, for runtime built in frameworks. */
    readonly frameworkUrlPatterns: readonly RegExp[],
    /** Rewrites applied to script URLs that carry a per run token, such as a timestamp. */
    readonly urlReplacements: readonly (readonly [RegExp, string])[],
    emit(scenario: Scenario): readonly GeneratedFile[],
    /** Arguments for the node binary, run with the work directory as the working directory. */
    argv(scenario: Scenario, workDir: string): readonly string[],
};

function suiteNames(scenario: Scenario): readonly string[] {
    return Array.from({ length: scenario.files }, (_, index) => `suite-${index}.test.js`);
}

function testIndices(scenario: Scenario): readonly number[] {
    return Array.from({ length: scenario.testsPerFile }, (_, index) => index);
}

/**
 * Every flavour asserts the same thing about the same subject, so differences in the
 * `test-code` bucket reflect the declaration API rather than the work being tested.
 */
function subjectCall(scenario: Scenario): string {
    return scenario.async ? "await fibonacciAsync(10)" : "fibonacci(10)";
}

function subjectImport(scenario: Scenario): string {
    return scenario.async
        ? `import { fibonacciAsync } from "./subject.js";`
        : `import { fibonacci } from "./subject.js";`;
}

function asyncPrefix(scenario: Scenario): string {
    return scenario.async ? "async " : "";
}

function manifest(id: string, scenario: Scenario, extra: Record<string, unknown> = {}): GeneratedFile {
    return {
        name: "package.json",
        contents: `${JSON.stringify({
            name: `effort-${id}-${scenario.id}`,
            version: "0.0.0",
            private: true,
            type: "module",
            ...extra,
        }, undefined, 4)}\n`,
    };
}

function emitSuites(
    scenario: Scenario,
    render: (fileIndex: number) => readonly string[],
): readonly GeneratedFile[] {
    return suiteNames(scenario).map((name, fileIndex) => ({
        name,
        // The marker keeps sources unique so content addressed transform caches cannot collide.
        contents: [ `// suite ${fileIndex}`, ...render(fileIndex), "" ].join("\n"),
    }));
}

/** Reads a package's declared bin so the harness does not depend on installer shim layout. */
function resolveBin(packageName: string, binName: string): string {
    const packageDir = path.join(modulesRoot, packageName);
    const declared: unknown = JSON.parse(
        readFileSync(path.join(packageDir, "package.json"), "utf8"),
    ).bin;
    const relative = typeof declared === "string"
        ? declared
        : (declared as Record<string, string>|undefined)?.[binName];

    if (!relative) {
        throw new Error(`Package ${packageName} declares no bin named ${binName}.`);
    }

    return path.join(packageDir, relative);
}

const theory: Framework = {
    id: "theory",
    frameworkPackages: [ "@theory/core", "@theory/agent-nodejs", "@theory/util-result" ],
    assertionPackages: [ "@theory/assertions" ],
    // Stands in for the not-yet-complete CLI; see README.
    frameworkPaths: [ theoryRunner ],
    frameworkUrlPatterns: [],
    urlReplacements: [],
    emit: scenario => [
        manifest("theory", scenario),
        ...emitSuites(scenario, () => [
            `import { is } from "@theory/assertions";`,
            `import { test } from "@theory/core";`,
            subjectImport(scenario),
            "",
            ...testIndices(scenario).flatMap(index => [
                `export const test${index} = test(${asyncPrefix(scenario)}() => {`,
                `    is(${subjectCall(scenario)}, 55);`,
                `});`,
                "",
            ]),
        ]),
    ],
    argv: (_scenario, workDir) => [ theoryRunner, workDir ],
};

const nodeTest: Framework = {
    id: "node-test",
    frameworkPackages: [],
    assertionPackages: [],
    frameworkPaths: [],
    // The runner ships inside node, so its overhead only shows up as internal script URLs.
    frameworkUrlPatterns: [ /^node:internal\/(test_runner|main\/test_runner)/ ],
    urlReplacements: [],
    emit: scenario => [
        manifest("node-test", scenario),
        ...emitSuites(scenario, () => [
            `import { strictEqual } from "node:assert/strict";`,
            `import { test } from "node:test";`,
            subjectImport(scenario),
            "",
            ...testIndices(scenario).flatMap(index => [
                `test("test ${index}", ${asyncPrefix(scenario)}() => {`,
                `    strictEqual(${subjectCall(scenario)}, 55);`,
                `});`,
                "",
            ]),
        ]),
    ],
    argv: scenario => [ "--test", "--test-concurrency=1", ...suiteNames(scenario) ],
};

const vitest: Framework = {
    id: "vitest",
    frameworkPackages: [
        "vitest",
        "@vitest/runner",
        "@vitest/utils",
        "@vitest/expect",
        "@vitest/snapshot",
        "@vitest/spy",
        "@vitest/pretty-format",
        "@vitest/mocker",
        "vite",
        "vite-node",
        "tinypool",
        "tinyrainbow",
        "tinybench",
        "chai",
    ],
    assertionPackages: [],
    frameworkPaths: [],
    frameworkUrlPatterns: [],
    // Vite rewrites the config to a temporary file whose name carries the current time.
    urlReplacements: [ [ /\.timestamp-\d+-[0-9a-f]+\.mjs$/, ".timestamp.mjs" ] ],
    emit: scenario => [
        manifest("vitest", scenario),
        {
            name: "vitest.config.js",
            contents: [
                "export default {",
                "    test: {",
                `        include: [ "*.test.js" ],`,
                `        pool: "forks",`,
                "        poolOptions: { forks: { singleFork: true } },",
                "        fileParallelism: false,",
                "    },",
                "};",
                "",
            ].join("\n"),
        },
        ...emitSuites(scenario, () => [
            `import { expect, test } from "vitest";`,
            subjectImport(scenario),
            "",
            ...testIndices(scenario).flatMap(index => [
                `test("test ${index}", ${asyncPrefix(scenario)}() => {`,
                `    expect(${subjectCall(scenario)}).toBe(55);`,
                `});`,
                "",
            ]),
        ]),
    ],
    argv: () => [ resolveBin("vitest", "vitest"), "run", "--no-color" ],
};

const jest: Framework = {
    id: "jest",
    frameworkPackages: [
        "jest",
        "jest-cli",
        "jest-config",
        "jest-runner",
        "jest-runtime",
        "jest-circus",
        "jest-resolve",
        "jest-resolve-dependencies",
        "jest-haste-map",
        "jest-snapshot",
        "jest-message-util",
        "jest-util",
        "jest-worker",
        "jest-each",
        "jest-environment-node",
        "jest-mock",
        "jest-regex-util",
        "jest-validate",
        "jest-watcher",
        "jest-diff",
        "jest-matcher-utils",
        "jest-leak-detector",
        "jest-changed-files",
        "jest-docblock",
        "jest-get-type",
        "jest-pnp-resolver",
        "expect",
        "pretty-format",
        "babel-jest",
        "@jest/core",
        "@jest/globals",
        "@jest/reporters",
        "@jest/transform",
        "@jest/types",
        "@jest/console",
        "@jest/environment",
        "@jest/expect",
        "@jest/expect-utils",
        "@jest/fake-timers",
        "@jest/schemas",
        "@jest/source-map",
        "@jest/test-result",
        "@jest/test-sequencer",
        "@jest/snapshot-utils",
        "@jest/pattern",
        "@jest/diff-sequences",
        "@jest/get-type",
    ],
    assertionPackages: [],
    frameworkPaths: [],
    frameworkUrlPatterns: [],
    urlReplacements: [],
    emit: scenario => [
        manifest("jest", scenario),
        ...emitSuites(scenario, () => [
            `import { expect, test } from "@jest/globals";`,
            subjectImport(scenario),
            "",
            ...testIndices(scenario).flatMap(index => [
                `test("test ${index}", ${asyncPrefix(scenario)}() => {`,
                `    expect(${subjectCall(scenario)}).toBe(55);`,
                `});`,
                "",
            ]),
        ]),
    ],
    // Jest only runs ESM sources under the VM modules flag.
    argv: () => [
        "--experimental-vm-modules",
        resolveBin("jest", "jest"),
        "--runInBand",
        "--no-cache",
        "--ci",
        "--colors=false",
    ],
};

const ava: Framework = {
    id: "ava",
    frameworkPackages: [
        "ava",
        "@ava/typescript",
        "concordance",
        "emittery",
        "cbor",
        "chalk",
        "figures",
        "plur",
        "time-zone",
    ],
    assertionPackages: [],
    frameworkPaths: [],
    frameworkUrlPatterns: [],
    urlReplacements: [],
    emit: scenario => [
        manifest("ava", scenario, {
            ava: {
                files: [ "*.test.js" ],
                concurrency: 1,
                serial: true,
                workerThreads: false,
            },
        }),
        ...emitSuites(scenario, () => [
            `import test from "ava";`,
            subjectImport(scenario),
            "",
            ...testIndices(scenario).flatMap(index => [
                `test("test ${index}", ${asyncPrefix(scenario)}t => {`,
                `    t.is(${subjectCall(scenario)}, 55);`,
                `});`,
                "",
            ]),
        ]),
    ],
    argv: () => [ resolveBin("ava", "ava"), "--serial", "--concurrency=1" ],
};

const mocha: Framework = {
    id: "mocha",
    frameworkPackages: [
        "mocha",
        "chokidar",
        "glob",
        "diff",
        "supports-color",
        "workerpool",
        "yargs",
        "yargs-parser",
        "yargs-unparser",
    ],
    assertionPackages: [],
    frameworkPaths: [],
    frameworkUrlPatterns: [],
    urlReplacements: [],
    emit: scenario => [
        manifest("mocha", scenario),
        ...emitSuites(scenario, fileIndex => [
            `import { strictEqual } from "node:assert/strict";`,
            subjectImport(scenario),
            "",
            `describe("suite ${fileIndex}", () => {`,
            ...testIndices(scenario).flatMap(index => [
                `    it("test ${index}", ${asyncPrefix(scenario)}() => {`,
                `        strictEqual(${subjectCall(scenario)}, 55);`,
                `    });`,
            ]),
            `});`,
        ]),
    ],
    // Config discovery is disabled so nothing outside the work directory can influence a run.
    argv: scenario => [
        resolveBin("mocha", "mocha"),
        "--no-config",
        "--no-package",
        "--no-diff",
        ...suiteNames(scenario),
    ],
};

export const frameworks: readonly Framework[] = [ theory, nodeTest, vitest, jest, ava, mocha ];

export const subjectFile: GeneratedFile = {
    name: "subject.js",
    contents: [
        "export function fibonacci(n) {",
        "    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);",
        "}",
        "",
        "export function fibonacciAsync(n) {",
        "    return Promise.resolve(fibonacci(n));",
        "}",
        "",
    ].join("\n"),
};
