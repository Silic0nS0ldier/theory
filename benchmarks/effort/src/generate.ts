import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { subjectFile, type Framework } from "./frameworks.ts";
import type { Scenario } from "./scenarios.ts";

export const harnessRoot = path.resolve(fileURLToPath(import.meta.url), "../..");
export const workRoot = path.join(harnessRoot, ".work");
export const coverageRoot = path.join(harnessRoot, ".coverage");
export const resultsRoot = path.join(harnessRoot, "results");

/**
 * Paths are fixed rather than randomised: script URLs appear in coverage output, so a
 * temporary directory name would make results differ between otherwise identical runs.
 */
export function workDirFor(framework: Framework, scenario: Scenario): string {
    return path.join(workRoot, `${framework.id}--${scenario.id}`);
}

export function generate(framework: Framework, scenario: Scenario): string {
    const workDir = workDirFor(framework, scenario);

    rmSync(workDir, { force: true, recursive: true });
    mkdirSync(workDir, { recursive: true });

    for (const file of [ subjectFile, ...framework.emit(scenario) ]) {
        writeFileSync(path.join(workDir, file.name), file.contents, "utf8");
    }

    return workDir;
}
