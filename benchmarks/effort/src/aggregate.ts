import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Framework } from "./frameworks.ts";
import { harnessRoot } from "./generate.ts";

const repoRoot = path.resolve(harnessRoot, "../..");

export const buckets = [
    "framework",
    "assertions",
    "test-code",
    "dependencies",
    "runtime",
    "harness",
] as const;

export type Bucket = typeof buckets[number];

/**
 * Counts of work done, all derived from V8 precise coverage call counts. None of them observe a
 * clock, so the same inputs on the same runtime produce the same numbers on any machine.
 */
export type Metrics = {
    /** Distinct scripts compiled, summed across processes. A script loaded twice counts twice. */
    readonly scripts: number,
    /** Bytes of source compiled, summed across processes. Stands in for parse effort. */
    readonly sourceBytes: number,
    /** Distinct functions that ran at least once. */
    readonly functions: number,
    /** Total function invocations. */
    readonly calls: number,
    /** Total basic block executions, so loop heavy code is not flattened to one call. */
    readonly blocks: number,
};

export type Aggregate = {
    readonly processes: number,
    readonly total: Metrics,
    readonly buckets: Record<Bucket, Metrics>,
    /** Per script detail, keyed by a machine independent path. Used to locate instability. */
    readonly scripts: ReadonlyMap<string, ScriptEntry>,
};

export type ScriptEntry = Metrics & {
    readonly bucket: Bucket,
};

type CoverageRange = {
    readonly startOffset: number,
    readonly endOffset: number,
    readonly count: number,
};

type CoverageFunction = {
    readonly ranges: readonly CoverageRange[],
};

type CoverageScript = {
    readonly url: string,
    readonly functions: readonly CoverageFunction[],
};

type CoverageFile = {
    readonly result: readonly CoverageScript[],
};

const emptyMetrics: Metrics = { scripts: 0, sourceBytes: 0, functions: 0, calls: 0, blocks: 0 };

function add(left: Metrics, right: Metrics): Metrics {
    return {
        scripts: left.scripts + right.scripts,
        sourceBytes: left.sourceBytes + right.sourceBytes,
        functions: left.functions + right.functions,
        calls: left.calls + right.calls,
        blocks: left.blocks + right.blocks,
    };
}

const packageNames = new Map<string, string|undefined>();

/** Resolves the owning package by walking up to the nearest manifest, as the module loader does. */
function packageNameFor(filePath: string): string|undefined {
    return packageNameForDirectory(path.dirname(filePath));
}

function packageNameForDirectory(directory: string): string|undefined {
    if (packageNames.has(directory)) {
        return packageNames.get(directory);
    }

    const parent = path.dirname(directory);
    const resolved = readManifestName(path.join(directory, "package.json"))
        ?? (parent === directory ? undefined : packageNameForDirectory(parent));

    packageNames.set(directory, resolved);

    return resolved;
}

function readManifestName(manifestPath: string): string|undefined {
    try {
        const name: unknown = JSON.parse(readFileSync(manifestPath, "utf8")).name;

        return typeof name === "string" ? name : undefined;
    } catch {
        return undefined;
    }
}

function classify(url: string, framework: Framework, workDir: string): Bucket {
    if (!url.startsWith("file://")) {
        return framework.frameworkUrlPatterns.some(pattern => pattern.test(url))
            ? "framework"
            : "runtime";
    }

    const filePath = fileURLToPath(url);

    if (filePath.startsWith(`${workDir}${path.sep}`)) {
        return "test-code";
    }

    if (framework.frameworkPaths.includes(filePath)) {
        return "framework";
    }

    const name = packageNameFor(filePath);

    if (name === undefined) {
        return "dependencies";
    }

    if (framework.frameworkPackages.includes(name)) {
        return "framework";
    }

    if (framework.assertionPackages.includes(name)) {
        return "assertions";
    }

    return name === "@theory/benchmark-effort" ? "harness" : "dependencies";
}

/** Strips machine specific and run specific prefixes so results compare across runs. */
function keyFor(url: string, framework: Framework, workDir: string): string {
    const stable = framework.urlReplacements.reduce(
        (value, [ pattern, replacement ]) => value.replace(pattern, replacement),
        url,
    );

    if (!stable.startsWith("file://")) {
        return stable;
    }

    const filePath = fileURLToPath(stable);

    if (filePath.startsWith(`${workDir}${path.sep}`)) {
        return `<work>/${path.relative(workDir, filePath)}`;
    }

    return filePath.startsWith(`${repoRoot}${path.sep}`)
        ? `<repo>/${path.relative(repoRoot, filePath)}`
        : filePath;
}

function measure(script: CoverageScript): Metrics {
    let sourceBytes = 0;
    let functions = 0;
    let calls = 0;
    let blocks = 0;

    for (const entry of script.functions) {
        const [ root ] = entry.ranges;

        if (!root) {
            continue;
        }

        sourceBytes = Math.max(sourceBytes, root.endOffset);
        calls += root.count;

        if (root.count > 0) {
            functions += 1;
        }

        for (const range of entry.ranges) {
            blocks += range.count;
        }
    }

    return { scripts: 1, sourceBytes, functions, calls, blocks };
}

export function aggregate(coverageDir: string, framework: Framework, workDir: string): Aggregate {
    const files = readdirSync(coverageDir).filter(name => name.endsWith(".json")).sort();
    const scripts = new Map<string, ScriptEntry>();
    const totals = new Map<Bucket, Metrics>(buckets.map(bucket => [ bucket, emptyMetrics ]));
    let total = emptyMetrics;

    for (const file of files) {
        const coverage: CoverageFile = JSON.parse(readFileSync(path.join(coverageDir, file), "utf8"));

        for (const script of coverage.result) {
            if (script.url === "") {
                continue;
            }

            const bucket = classify(script.url, framework, workDir);
            const key = keyFor(script.url, framework, workDir);
            const metrics = measure(script);

            scripts.set(key, { bucket, ...add(scripts.get(key) ?? emptyMetrics, metrics) });
            totals.set(bucket, add(totals.get(bucket) ?? emptyMetrics, metrics));
            total = add(total, metrics);
        }
    }

    return {
        processes: files.length,
        total,
        buckets: Object.fromEntries(totals) as Record<Bucket, Metrics>,
        scripts,
    };
}
