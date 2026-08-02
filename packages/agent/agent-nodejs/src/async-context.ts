import { AsyncLocalStorage } from "node:async_hooks";
import type { AsyncVariableContract } from "@theory/core";

/**
 * `AsyncContext.Variable` backed by NodeJS async hooks, for use until hosts expose
 * a native `globalThis.AsyncContext`.
 */
export class AsyncLocalStorageVariable<T> implements AsyncVariableContract<T> {
    #storage = new AsyncLocalStorage<T>();

    get(): T|undefined {
        return this.#storage.getStore();
    }

    run<R>(value: T, fn: () => R): R {
        return this.#storage.run(value, fn);
    }
}
