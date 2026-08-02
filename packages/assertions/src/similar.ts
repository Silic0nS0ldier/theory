import { report } from "./report.ts";

/**
 * Asserts that inputs are similar.
 * Intended as a stop-gap for assertions whose inputs may be impacted by timing or some form of
 * entropy. Measure for similarity is determined by running test multiple times and producing a
 * snapshot from the resulting tolerance spec.
 * @param actual
 * @param expected
 */
export function similar(actual: unknown, expected: unknown): boolean {
    return report({
        assertion: "similar",
        passed: false,
        actual,
        expected,
    });
}
