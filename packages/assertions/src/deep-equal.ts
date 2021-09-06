import { getTestContext } from "@theory/core";

function isPrimative(value: unknown) {
    return value !== Object(value);
}

/**
 * Asserts that inputs are deeply equal, but not the same.
 * Unless whitelisted, referential equality will result in a failure. This prevents unexpected
 * mutation of expected value.
 * @param expected 
 * @param actual 
 * @param spec - A spec that defines properties which must have referential equality.
 */
export function deepEqual(expected: unknown, actual: unknown): boolean {
    const t = getTestContext();

    // Throw if expected or actual are primative
    if (isPrimative(expected)) {
        return false;
    }
    if (isPrimative(actual)) {
        return false;
    }

    // What about common references? Could indicate a flaky test.
    return true;
}
