import { AssertionError } from "./assertion-error.js";

/**
 * Asserts input function throws an exception matching the spec.
 * @param actualFn 
 */
export async function throws(actualFn: () => Promise<void>|void): Promise<void> {
    let thrown = false;
    try {
        await actualFn();
    }
    catch (e: unknown) {
        thrown = true;
        // If does not match spec, throw
    }
    
    if (!thrown) {
        throw new AssertionError();
    }
}