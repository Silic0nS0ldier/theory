import type { Aggregate, Bucket, Metrics, ScriptEntry } from "./aggregate.ts";
import { totalTests, type Scenario } from "./scenarios.ts";

export type Instability = {
    readonly script: string,
    readonly bucket: Bucket,
    readonly metric: keyof Metrics,
    readonly values: readonly number[],
};

export type Cell = {
    readonly framework: string,
    readonly scenario: string,
    readonly tests: number,
    readonly processes: number,
    readonly exitStatus: number|null,
    /** Every repeat produced identical counts for every script. */
    readonly reproducible: boolean,
    /** As above, ignoring the host's own bootstrap and module loading. */
    readonly reproducibleWorkload: boolean,
    /** Spread of total calls across repeats, in parts per million. */
    readonly driftPpm: number,
    readonly total: Metrics,
    readonly buckets: Record<Bucket, Metrics>,
    readonly instability: readonly Instability[],
};

export type Results = {
    readonly runtime: string,
    readonly repeats: number,
    readonly tolerancePpm: number,
    readonly cells: readonly Cell[],
};

const metricNames: readonly (keyof Metrics)[] = [
    "scripts",
    "sourceBytes",
    "functions",
    "calls",
    "blocks",
];

const columns = [
    "framework",
    "procs",
    "framework calls",
    "test calls",
    "dependency calls",
    "runtime calls",
    "total calls",
    "calls/test",
    "total blocks",
    "source KiB",
    "drift ppm",
    "exact",
] as const;

/**
 * Compares every repeat script by script. Any difference means something outside the workload
 * influenced execution, so the cell's numbers cannot be trusted and the culprit is named.
 */
function findInstability(repeats: readonly Aggregate[]): readonly Instability[] {
    if (repeats.length < 2) {
        return [];
    }

    const keys = new Set(repeats.flatMap(repeat => [ ...repeat.scripts.keys() ]));
    const found: Instability[] = [];

    for (const script of [ ...keys ].sort()) {
        const entries = repeats
            .map(repeat => repeat.scripts.get(script))
            .filter((entry): entry is ScriptEntry => entry !== undefined);

        for (const metric of metricNames) {
            const values = repeats.map(repeat => repeat.scripts.get(script)?.[metric] ?? 0);

            if (new Set(values).size > 1) {
                found.push({ script, bucket: entries[0]?.bucket ?? "runtime", metric, values });
            }
        }
    }

    return found;
}

function driftPpm(repeats: readonly Aggregate[]): number {
    const calls = repeats.map(repeat => repeat.total.calls);
    const highest = Math.max(...calls);

    return highest === 0 ? 0 : Math.round(((highest - Math.min(...calls)) / highest) * 1e6);
}

export function toCell(
    framework: string,
    scenario: Scenario,
    exitStatus: number|null,
    repeats: readonly Aggregate[],
): Cell {
    const [ first ] = repeats;

    if (!first) {
        throw new Error("A cell needs at least one repeat.");
    }

    const instability = findInstability(repeats);
    const sameProcessCount = new Set(repeats.map(repeat => repeat.processes)).size === 1;

    return {
        framework,
        scenario: scenario.id,
        tests: totalTests(scenario),
        processes: first.processes,
        exitStatus,
        reproducible: instability.length === 0 && sameProcessCount,
        reproducibleWorkload: sameProcessCount
            && instability.every(entry => entry.bucket === "runtime"),
        driftPpm: driftPpm(repeats),
        total: first.total,
        buckets: first.buckets,
        // Enough to find the cause; the full list is dominated by node internals.
        instability: instability.slice(0, 50),
    };
}

function row(cells: readonly string[]): string {
    return `| ${cells.join(" | ")} |`;
}

function exactness(cell: Cell): string {
    if (cell.reproducible) {
        return "yes";
    }

    return cell.reproducibleWorkload ? "runtime only" : "NO";
}

export function toMarkdown(results: Results): string {
    const lines = [
        "# Effort benchmark",
        "",
        `Runtime: \`${results.runtime}\`. Repeats per cell: ${results.repeats}. `
        + `Tolerance: ${results.tolerancePpm} ppm.`,
        "",
        "Counts come from V8 precise coverage, so they are independent of time, hardware and load.",
        "`drift ppm` is the spread of total calls across repeats. `exact` is `yes` when every",
        "repeat produced identical counts for every script.",
        "",
    ];

    for (const scenario of [ ...new Set(results.cells.map(cell => cell.scenario)) ]) {
        const cells = results.cells.filter(cell => cell.scenario === scenario);

        lines.push(
            `## Scenario \`${scenario}\` (${cells[0]?.tests ?? 0} tests)`,
            "",
            row(columns),
            row(columns.map(() => "---")),
        );

        for (const cell of cells) {
            lines.push(row([
                cell.framework,
                String(cell.processes),
                String(cell.buckets.framework.calls + cell.buckets.assertions.calls),
                String(cell.buckets["test-code"].calls),
                String(cell.buckets.dependencies.calls),
                String(cell.buckets.runtime.calls),
                String(cell.total.calls),
                (cell.total.calls / cell.tests).toFixed(1),
                String(cell.total.blocks),
                (cell.total.sourceBytes / 1024).toFixed(0),
                String(cell.driftPpm),
                exactness(cell),
            ]));
        }

        lines.push("");
    }

    const unstable = results.cells.filter(cell => !cell.reproducible);

    if (unstable.length > 0) {
        lines.push("## Instability", "");

        for (const cell of unstable) {
            lines.push(`### ${cell.framework} / ${cell.scenario}`, "");

            for (const entry of cell.instability.slice(0, 20)) {
                lines.push(
                    `* [${entry.bucket}] \`${entry.script}\` ${entry.metric}: ${entry.values.join(", ")}`,
                );
            }

            lines.push("");
        }
    }

    return `${lines.join("\n")}\n`;
}

export function toJson(results: Results): string {
    return `${JSON.stringify(results, undefined, 4)}\n`;
}
