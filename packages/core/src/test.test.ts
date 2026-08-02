import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import test from "node:test";
import { isOk } from "@theory/util-result";
import { setAsyncVariableImplementation } from "./async-context.ts";
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

test("Context can be accessed within registered function", () => {
    function contextAccessor(valid: boolean) {
        const testContext = getTestContext();
        assert.equal(isOk(testContext), valid);
    }

    // Should be able to access
    const boundContextAccessor = bindTestContext(() => contextAccessor(true));
    boundContextAccessor();

    // Should not be able to access
    contextAccessor(false);
});

test("Context survives an await", async () => {
    const boundContextAccessor = bindTestContext(async () => {
        await Promise.resolve();
        assert.equal(isOk(getTestContext()), true);
    });

    await boundContextAccessor();
});
