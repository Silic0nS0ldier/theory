import { report } from "./report.ts";

/**
 * Asserts input function throws an exception matching the spec.
 * @param actualFn
 */
export async function throws(actualFn: () => Promise<void>|void): Promise<boolean> {
    let thrown: unknown;
    let didThrow = false;

    try {
        await actualFn();
    }
    catch (e: unknown) {
        didThrow = true;
        thrown = e;
        // If does not match spec, fail
    }

    return report({
        assertion: "throws",
        passed: didThrow,
        actual: thrown,
    });
}
