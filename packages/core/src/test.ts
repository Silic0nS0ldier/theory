import { err, ok, type Result } from "@theory/util-result";
import { createAsyncVariable } from "./async-context.ts";
import type { AssertionReportContract } from "./contracts/assertion-report.ts";

const testContextStore = createAsyncVariable<TextContext>();

type TextContext = {
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
export function getTestContext(): Result<TextContext, GetTestContextErrors> {
    const testContext = testContextStore.get();

    if (testContext) {
        return ok(testContext);
    }

    return err({
        type: GetTestContextErrorTypes.NO_CONTEXT,
    });
}

type TestFn = () => Promise<void>|void;

export function bindTestContext(test: TestFn): TestFn {
    const textContext: TextContext = {
        fs: {
            read() { throw new Error("Not implemented"); },
            write() { throw new Error("Not implemented"); },
            copy() { throw new Error("Not implemented"); },
            move() { throw new Error("Not implemented"); },
        },
        report: {},
    };

    return () => testContextStore.run(textContext, test);
}
