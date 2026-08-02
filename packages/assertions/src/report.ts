import { getTestContext, type AssertionRecord } from "@theory/core";
import { isOk, unwrap } from "@theory/util-result";

/**
 * Records an assertion outcome against the active test, returning that outcome for composition.
 * Outside a test there is nowhere to record, and core must never throw, so the record is dropped.
 */
export function report(entry: AssertionRecord): boolean {
    const testContext = getTestContext();

    if (isOk(testContext)) {
        unwrap(testContext).report.record(entry);
    }

    return entry.passed;
}
