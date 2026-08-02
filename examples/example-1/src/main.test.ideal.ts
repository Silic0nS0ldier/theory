// @ts-nocheck Function decorators do not exist yet; this file records the shape being aimed for.
// Named `.test.ideal.ts` so runners globbing `*.test.ts` skip it.
import { is } from "@theory/assertions";
import { skip, tag, test, timeout, title } from "@theory/core";
import { fibonacci } from "./main.ts";

// Identity is the module path plus export name, so a title is optional.
@test
export function fib1() {
    is(fibonacci(2), 1);
}

// Order is irrelevant; every modifier accepts a bare function or an already declared test.
@test
@title("Fibonacci of ten")
@tag("unit")
export function fib2() {
    is(fibonacci(10), 55);
}

@timeout(50)
@test
@skip
export function fib3() {
    is(fibonacci(50), 12586269025);
}
