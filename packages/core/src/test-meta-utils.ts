import type { Test, TestMeta } from "./test.js";

/**
 * Helper for accessing test meta
 * @param test Test meta relates to.
 * @todo Returned map should block interactions that affect other keys without fore-knowledge.
 * e.g. `clear`, `forEach`, `entries`, `keys`, `values`, and `size.
 */
export function getOrCreateMeta(test: Test): TestMeta {
    if (!test.meta) {
        test.meta = new Map();
    }

    return test.meta;
}

/**
 * Type spec for function decorators.
 * Test augmentation is driven by decorators in Theory, so this type is provided to aid development.
 * Adheres to spec proposed in [github.com/tc39/proposal-decorators/EXTENSIONS.md](https://github.com/tc39/proposal-decorators/commit/5d755cf295c203ecbb7c5172da3cb737a96efa1d#function-decorators-and-annotations).
 */
export type FunctionDecorator<T = Test> = {
    (target: T, context: { kind: "function" }): T | void;
}

/**
 * Function decorators ponyfill tailored for manual usage.
 * Compatible with function decorators that adhere to `FunctionDecorator` type spec.
 * @param decorators Decorators to apply.
 * @todo We can remove `.impl`.
 */
export function decorate<T = Test>(
    ...decorators: FunctionDecorator<T>[]
): { impl: (fn: T) => T } {
    return {
        impl(fn: T) {
            for (const decorator of decorators) {
                const res = decorator(fn, { kind: "function" });
                if (res) {
                    fn = res;
                }
            }
    
            return fn;
        }
    };
}
