import assert from "node:assert/strict";
import test from "node:test";
import { is } from "./is.ts";

test("Value type equal", () => {
    assert.doesNotThrow(() => is("foo", "foo"));
});

test("Reference type equal", () => {
    const foo = {};
    assert.doesNotThrow(() => is(foo, foo));
});

test("Value type not equal", () => {
    assert.throws(() => is("foo", "bar"));
});

test("Reference type not equal", () => {
    assert.throws(() => is({}, {}));
});

test("Plus and minus zero not equal", () => {
    assert.throws(() => is(+0, -0));
});

test("NaN are equal", () => {
    assert.doesNotThrow(() => is(NaN, NaN));
});
