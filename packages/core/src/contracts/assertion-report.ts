/**
 * Outcome of a single assertion.
 */
export type AssertionRecord = {
    /** Name of the assertion which produced the record, e.g. `is`. */
    readonly assertion: string,
    readonly passed: boolean,
    readonly actual?: unknown,
    readonly expected?: unknown,
};

/**
 * Mechanisms for reporting test assertion results.
 */
export type AssertionReportContract = {
    record(entry: AssertionRecord): void,
    readonly records: readonly AssertionRecord[],
}

