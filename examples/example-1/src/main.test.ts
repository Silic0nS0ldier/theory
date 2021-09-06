import { fibonacci } from "./main.js";
import { is } from "@theory/assertions";

export function fib1() {
    is(fibonacci(2), 4);
}
