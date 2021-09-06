import { getTestContext } from "@theory/core";

/**
 * Asserts input function throws an exception matching the spec.
 * @param actualFn 
 */
export async function throws(actualFn: () => Promise<void>|void): Promise<boolean> {
    const t = getTestContext();

    let thrown = false;
    try {
        await actualFn();
    }
    catch (e: unknown) {
        thrown = true;
        // If does not match spec, throw
    }

    return thrown;
}