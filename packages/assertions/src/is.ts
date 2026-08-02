import { report } from "./report.ts";

/**
 * Asserts that inputs are the same (referentially equal for reference types, identical for value
 * types). Note that when reference types are used, the actual value may be mutated in an
 * traceable manner. Other assertions are necessary to validate behaviour.
 * @param actual
 * @param expected
 */
export function is(actual: unknown, expected: unknown): boolean {
    return report({
        assertion: "is",
        passed: Object.is(actual, expected),
        actual,
        expected,
    });
}
