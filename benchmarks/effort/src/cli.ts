import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { argv, exit, stdout, version } from "node:process";
import { aggregate, type Aggregate } from "./aggregate.ts";
import { frameworks } from "./frameworks.ts";
import { generate, resultsRoot, workDirFor } from "./generate.ts";
import { toCell, toJson, toMarkdown, type Cell, type Results } from "./report.ts";
import { run } from "./run.ts";
import { scenarios } from "./scenarios.ts";

type Options = {
    readonly frameworks: readonly string[],
    readonly scenarios: readonly string[],
    readonly repeats: number,
    /**
     * Frameworks that spread work over a process pool retain a little irreducible noise: pipe
     * reads chunk differently and progress timers fire a different number of times. Anything
     * above this share of total calls is a real loss of control over the measurement.
     */
    readonly tolerancePpm: number,
    readonly out: string,
};

function parse(args: readonly string[]): Options {
    const values = new Map<string, string>();

    for (const arg of args) {
        const match = /^--([\w-]+)=(.*)$/.exec(arg);

        if (!match?.[1]) {
            console.error(`Unknown argument: ${arg}`);
            exit(1);
        }

        values.set(match[1], match[2] ?? "");
    }

    const list = (name: string, fallback: readonly string[]): readonly string[] => {
        const value = values.get(name);

        return value ? value.split(",") : fallback;
    };

    return {
        frameworks: list("frameworks", frameworks.map(framework => framework.id)),
        scenarios: list("scenarios", scenarios.map(scenario => scenario.id)),
        repeats: Number(values.get("repeats") ?? 3),
        tolerancePpm: Number(values.get("tolerance-ppm") ?? 5000),
        out: values.get("out") ?? resultsRoot,
    };
}

const options = parse(argv.slice(2));
const selectedFrameworks = frameworks.filter(framework => options.frameworks.includes(framework.id));
const selectedScenarios = scenarios.filter(scenario => options.scenarios.includes(scenario.id));
const cells: Cell[] = [];

function label(cell: Cell): string {
    if (cell.reproducible) {
        return "exact";
    }

    return cell.driftPpm <= options.tolerancePpm ? "within tolerance" : "OVER TOLERANCE";
}

for (const scenario of selectedScenarios) {
    for (const framework of selectedFrameworks) {
        const repeats: Aggregate[] = [];
        let exitStatus: number|null = null;

        for (let repeat = 0; repeat < options.repeats; repeat += 1) {
            // Regenerated every repeat so no framework can carry a warm cache between them.
            const workDir = generate(framework, scenario);
            const outcome = run(framework, scenario, workDir);

            if (outcome.status !== 0) {
                console.error(`${framework.id}/${scenario.id} exited with ${outcome.status}`);
                console.error(outcome.stdout.slice(-4000));
                console.error(outcome.stderr.slice(-4000));
            }

            exitStatus = outcome.status;
            repeats.push(aggregate(outcome.coverageDir, framework, workDir));
        }

        const cell = toCell(framework.id, scenario, exitStatus, repeats);

        cells.push(cell);
        stdout.write(
            `${framework.id.padEnd(10)} ${scenario.id.padEnd(14)} `
            + `calls=${String(cell.total.calls).padStart(12)} `
            + `procs=${String(cell.processes).padStart(3)} `
            + `drift=${String(cell.driftPpm).padStart(6)}ppm `
            + `${label(cell)}\n`,
        );
    }
}

const results: Results = {
    runtime: version,
    repeats: options.repeats,
    tolerancePpm: options.tolerancePpm,
    cells,
};

mkdirSync(options.out, { recursive: true });
writeFileSync(path.join(options.out, "effort.json"), toJson(results), "utf8");
writeFileSync(path.join(options.out, "effort.md"), toMarkdown(results), "utf8");

console.log(`\nWrote ${path.join(options.out, "effort.json")}`);

const drifted = cells.filter(cell => cell.driftPpm > options.tolerancePpm);

if (drifted.length > 0) {
    for (const cell of drifted) {
        console.error(
            `${cell.framework}/${cell.scenario} drifted ${cell.driftPpm} ppm across repeats.`,
        );
    }

    exit(2);
}
