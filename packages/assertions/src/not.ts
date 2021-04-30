import { AssertionError } from "./assertion-error.js";
import { is } from "./is.js";

/**
 * Asserts inputs are not the same. Logical opposite of `is`.
 * @param actual 
 * @param expected 
 */
export function not(actual: unknown, expected: unknown) {
    try {
        is(actual, expected);
    }
    catch {
        return;
    }

    throw new AssertionError();
}