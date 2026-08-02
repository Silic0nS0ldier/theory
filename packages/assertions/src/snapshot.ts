import { report } from "./report.ts";

/**
 * Asserts that actual is deeply equal to a persisted copy of a previous actual.
 * Exotic structures such as React DOM trees should defer to purpose built snapshot assertions or
 * process the structure into more simple.
 * @param actual
 */
export function snapshot(actual: unknown): boolean {
    // Render actual into snapshot format
    // Try read existing snapshot
    // If exists
        // Compare, report failure on mismatch
    // Else
        // If not in update mode, report failure
    return report({
        assertion: "snapshot",
        passed: false,
        actual,
    });
}

