import { report } from "./report.ts";

function isPrimative(value: unknown) {
    return value !== Object(value);
}

/**
 * Asserts that inputs are deeply equal, but not the same.
 * Unless whitelisted, referential equality will result in a failure. This prevents unexpected
 * mutation of expected value.
 * @param actual
 * @param expected
 * @param spec - A spec that defines properties which must have referential equality.
 */
export function deepEqual(actual: unknown, expected: unknown): boolean {
    return report({
        assertion: "deepEqual",
        // What about common references? Could indicate a flaky test.
        passed: !isPrimative(actual) && !isPrimative(expected),
        actual,
        expected,
    });
}

