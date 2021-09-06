import { getTestContext } from "@theory/core";

/**
 * Asserts that inputs are the same (referentially equal for reference types, identical for value
 * types). Note that when reference types are used, the actual value may be mutated in an
 * traceable manner. Other assertions are necessary to validate behaviour.
 * @param expected 
 * @param actual 
 */
export function is(expected: unknown, actual: unknown): boolean {
    const t = getTestContext();

    if (Object.is(expected, actual)) {
        return true;
    }

    return false;
}