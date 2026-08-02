import assert from "node:assert/strict";
import test from "node:test";
import { not } from "./not.ts";

test("Value type equal", () => {
    assert.equal(not("foo", "foo"), false);
});

test("Reference type equal", () => {
    const foo = {};
    assert.equal(not(foo, foo), false);
});

test("Value type not equal", () => {
    assert.equal(not("foo", "bar"), true);
});

test("Reference type not equal", () => {
    assert.equal(not({}, {}), true);
});
