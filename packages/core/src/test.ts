import { err, ok, type Result } from "@theory/util-result";
import { createAsyncVariable } from "./async-context.ts";
import type { AssertionRecord, AssertionReportContract } from "./contracts/assertion-report.ts";
import type { Test } from "./declare.ts";

const testContextStore = createAsyncVariable<TestContext>();

export type TestContext = {
    fs: unknown,
    report: AssertionReportContract,
};

const GetTestContextErrorTypes = {
    NO_CONTEXT: "NO_CONTEXT",
} as const;
type NoContextError = {
    readonly type: typeof GetTestContextErrorTypes.NO_CONTEXT,
};
type GetTestContextErrors =
    | NoContextError;

/**
 * Gets the context for the current test.
 * @returns The test context.
 */
export function getTestContext(): Result<TestContext, GetTestContextErrors> {
    const testContext = testContextStore.get();

    if (testContext) {
        return ok(testContext);
    }

    return err({
        type: GetTestContextErrorTypes.NO_CONTEXT,
    });
}

function createAssertionReport(): AssertionReportContract {
    const records: AssertionRecord[] = [];

    return {
        record: entry => { records.push(entry); },
        records,
    };
}

/**
 * Binds a test to a fresh context, yielding the assertions it recorded.
 */
export function bindTestContext(subject: Test): () => Promise<readonly AssertionRecord[]> {
    return async () => {
        const testContext: TestContext = {
            fs: {
                read() { throw new Error("Not implemented"); },
                write() { throw new Error("Not implemented"); },
                copy() { throw new Error("Not implemented"); },
                move() { throw new Error("Not implemented"); },
            },
            report: createAssertionReport(),
        };

        await testContextStore.run(testContext, subject.body);

        return testContext.report.records;
    };
}
