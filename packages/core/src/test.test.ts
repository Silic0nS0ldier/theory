import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import nodeTest from "node:test";
import { isOk } from "@theory/util-result";
import { setAsyncVariableImplementation } from "./async-context.ts";
import { test } from "./declare.ts";
import { bindTestContext, getTestContext } from "./test.ts";

// Stands in for the host implementation an agent would register.
class NodeAsyncVariable<T> {
    #storage = new AsyncLocalStorage<T>();

    get(): T|undefined {
        return this.#storage.getStore();
    }

    run<R>(value: T, fn: () => R): R {
        return this.#storage.run(value, fn);
    }
}

setAsyncVariableImplementation(NodeAsyncVariable);

nodeTest("Context can be accessed within registered function", async () => {
    function contextAccessor(valid: boolean) {
        const testContext = getTestContext();
        assert.equal(isOk(testContext), valid);
    }

    // Should be able to access
    const boundContextAccessor = bindTestContext(test(() => contextAccessor(true)));
    await boundContextAccessor();

    // Should not be able to access
    contextAccessor(false);
});

nodeTest("Context survives an await", async () => {
    const boundContextAccessor = bindTestContext(test(async () => {
        await Promise.resolve();
        assert.equal(isOk(getTestContext()), true);
    }));

    await boundContextAccessor();
});

nodeTest("Assertions recorded against the context are returned", async () => {
    const boundTest = bindTestContext(test(() => {
        const testContext = getTestContext();

        if (isOk(testContext)) {
            testContext[1].report.record({ assertion: "is", passed: true });
        }
    }));

    assert.deepEqual(await boundTest(), [ { assertion: "is", passed: true } ]);
});

nodeTest("Each binding gets an isolated report", async () => {
    const boundTest = bindTestContext(test(() => {
        const testContext = getTestContext();

        if (isOk(testContext)) {
            testContext[1].report.record({ assertion: "is", passed: true });
        }
    }));

    assert.equal((await boundTest()).length, 1);
    assert.equal((await boundTest()).length, 1);
});
