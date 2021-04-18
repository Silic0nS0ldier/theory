import test from "ava";
import { decorate } from "../test-meta-utils.js";
import { describe, describeSymbol } from "./describe.js";

test("single call", t => {
    const testFn = decorate(
        describe("foobar"),
    ).impl(() => {});
    
    t.deepEqual(
        testFn.meta,
        new Map([ [describeSymbol, ["foobar"]] ]),
    );
});

test("multiple calls", t => {
    const testFn = decorate(
        describe("foobar"),
        describe("barfoo"),
    ).impl(() => {});
    
    t.deepEqual(
        testFn.meta,
        new Map([ [describeSymbol, ["foobar", "barfoo"]] ]),
    );
});
