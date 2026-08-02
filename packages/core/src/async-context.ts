import type {
    AsyncVariableConstructorContract,
    AsyncVariableContract,
} from "./contracts/async-context.ts";

type HostGlobal = {
    AsyncContext?: {
        Variable?: AsyncVariableConstructorContract,
    },
};

let hostImplementation: AsyncVariableConstructorContract|undefined;

/**
 * Registers the `AsyncContext.Variable` implementation for hosts that lack a native one.
 * A native `globalThis.AsyncContext` always takes precedence, since only the host can
 * propagate context across its own async APIs.
 */
export function setAsyncVariableImplementation(implementation: AsyncVariableConstructorContract): void {
    hostImplementation = implementation;
}

/**
 * Creates a variable whose value propagates across the async execution flow.
 * The implementation is resolved on first use, so hosts may register one after import.
 */
export function createAsyncVariable<T>(): AsyncVariableContract<T> {
    let variable: AsyncVariableContract<T>|undefined;

    function resolve(): AsyncVariableContract<T>|undefined {
        if (!variable) {
            const Implementation = (globalThis as HostGlobal).AsyncContext?.Variable ?? hostImplementation;
            variable = Implementation && new Implementation<T>();
        }

        return variable;
    }

    return {
        // Absent an implementation nothing can have been bound, which `undefined` already conveys.
        get: () => resolve()?.get(),
        run: (value, fn) => {
            const resolved = resolve();

            if (!resolved) {
                throw new Error(
                    "No AsyncContext.Variable implementation available. Run on a host exposing `globalThis.AsyncContext`, or register one with `setAsyncVariableImplementation`.",
                );
            }

            return resolved.run(value, fn);
        },
    };
}
