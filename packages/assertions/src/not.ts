import { getTestContext } from "@theory/core";
import { is } from "./is.js";

/**
 * Asserts inputs are not the same. Logical opposite of `is`.
 * @param actual 
 * @param expected 
 */
export function not(actual: unknown, expected: unknown) {
    const t = getTestContext();

    return !is(actual, expected);
}