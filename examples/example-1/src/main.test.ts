import { fibonacci } from "./main.js";
import { is } from "@theory/assertions";

// wrapper needed for decoration and enabling composability (tag tests so that exports can be filtered)
function test(testFn: unknown): unknown {
    return testFn;
}

// t = execution context (similar to with ava), as `import('context')` cannot work reliably with async code
export const fib1 = test(t => {
    is(fibonacci(2), 4);
});
