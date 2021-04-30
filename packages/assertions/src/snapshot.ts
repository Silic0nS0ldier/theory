import { TestContext } from "@theory/core";

/**
 * Asserts that actual is deeply equal to a persisted copy of a previous actual.
 * Exotic structures such as React DOM trees should defer to purpose built snapshot assertions or
 * process the structure into more simple.
 * @param actual 
 */
export function snapshot(t: TestContext, actual: unknown) {
    // Render actual into snapshot format
    // Try read existing snapshot
    // If exists
        // Compare, throw assertion error on missing
    // Else
        // If not in update mode, throw
}
