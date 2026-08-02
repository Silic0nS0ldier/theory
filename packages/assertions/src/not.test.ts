import assert from "node:assert/strict";
import test from "node:test";
import { not } from "./not.ts";

test("Value type equal", () => {
    assert.throws(() => not("foo", "foo"));
});

test("Reference type equal", () => {
    const foo = {};
    assert.throws(() => not(foo, foo));
});

test("Value type not equal", () => {
    assert.doesNotThrow(() => not("foo", "bar"));
});

test("Reference type not equal", () => {
    assert.doesNotThrow(() => not({}, {}));
});
