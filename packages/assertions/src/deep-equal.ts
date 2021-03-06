import { AssertionError } from "./assertion-error.js";

function isPrimative(value: unknown) {
    return value !== Object(value);
}

type Spec = {
    [x: string]: Spec|true,
};

/**
 * Asserts that inputs are deeply equal, but not the same.
 * Unless whitelisted, referential equality will result in a failure. This prevents unexpected
 * mutation of expected value.
 * @param expected 
 * @param actual 
 * @param spec - A spec that defines properties which must have referential equality.
 */
export function deepEqual(expected: unknown, actual: unknown, spec?: Spec) {
    // Throw if expected or actual are primative
    if (isPrimative(expected)) {
        throw new AssertionError();
    }
    if (isPrimative(actual)) {
        throw new AssertionError();
    }

    // What about common references? Could indicate a flaky test.
}
