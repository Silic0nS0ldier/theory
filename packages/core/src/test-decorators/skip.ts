import type { FunctionDecorator } from "../test-meta-utils.js";
import { getOrCreateMeta } from "../test-meta-utils.js";

export const skipSymbol = Symbol("Identifies the test skip meta");

/**
 * Marks a test as to be skipped.
 */
export const skip: FunctionDecorator = test => {
    getOrCreateMeta(test).set(skipSymbol, true);
};
