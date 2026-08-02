import { report } from "./report.ts";

/**
 * Asserts inputs are not the same. Logical opposite of `is`.
 * @param actual
 * @param expected
 */
export function not(actual: unknown, expected: unknown): boolean {
    return report({
        assertion: "not",
        passed: !Object.is(actual, expected),
        actual,
        expected,
    });
}
