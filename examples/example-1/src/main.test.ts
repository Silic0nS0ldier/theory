import { is } from "@theory/assertions";
import { test, title } from "@theory/core";
import { fibonacci } from "./main.ts";

// Identity is the module path plus export name, so a title is optional.
export const fib1 = test(() => {
    is(fibonacci(2), 1);
});

export const fib2 = title("Fibonacci of ten")(test(() => {
    is(fibonacci(10), 55);
}));
