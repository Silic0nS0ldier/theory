import type { FunctionDecorator } from "../test-meta-utils.js";
import { getOrCreateMeta } from "../test-meta-utils.js";

export const describeSymbol = Symbol("Identifies a test description");

/**
 * Adds a description to a test which Theory can surface in reporting.
 * Multiple applications to a function will add more description text.
 * @param desc Description of test.
 */
export function describe(desc: string): FunctionDecorator {
    return target => {
        const meta = getOrCreateMeta(target);
        let description = meta.get(describeSymbol);
        if (Array.isArray(description)) {
            description.push(desc);
        } else {
            description = [desc];
        }
        meta.set(describeSymbol, description);
    };
}
