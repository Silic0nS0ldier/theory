/**
 * Subset of `AsyncContext.Variable` from the TC39 async context proposal (stage 2),
 * covering only what Theory relies on.
 * @see https://github.com/tc39/proposal-async-context
 */
export type AsyncVariableContract<T> = {
    /** The value bound to the current execution flow, or `undefined` outside any `run`. */
    get(): T|undefined,
    /** Runs `fn` with `value` bound to it, and to any async continuation it starts. */
    run<R>(value: T, fn: () => R): R,
};

export type AsyncVariableConstructorContract = new <T>() => AsyncVariableContract<T>;
