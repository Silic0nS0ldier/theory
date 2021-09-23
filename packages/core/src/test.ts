import { FileSystemContract } from "./contracts/fs.js";
import { err, ok, Result } from "@theory/util-result";
import { createContext } from "context";
import { AssertionReportContract } from "./contracts/assertion-report.js";

const testContextStore = createContext<TextContext>();

type TextContext = {
    fs: FileSystemContract,
    report: AssertionReportContract,
};

const enum GetTestContextErrorTypes {
    NO_CONTEXT = "NO_CONTEXT",
};
type NoContextError = {
    readonly type: GetTestContextErrorTypes.NO_CONTEXT,
};
type GetTestContextErrors =
    | NoContextError;

/**
 * Gets the context for the current test.
 * @returns The test context.
 */
export function getTestContext(): Result<TextContext, GetTestContextErrors> {
    const testContext = testContextStore.use();

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

    return testContextStore.bind(textContext, test);
}
