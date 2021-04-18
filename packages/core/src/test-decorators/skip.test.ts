import test from "ava";
import { decorate } from "../test-meta-utils.js";
import { skip, skipSymbol } from "./skip.js";

test("single call", t => {
    const testFn = decorate(
        skip
    ).impl(() => {});

    t.deepEqual(
        testFn.meta,
        new Map([ [skipSymbol, true] ]),
    );
});
