import assert from "node:assert/strict";
import test from "node:test";
import { is } from "./is.ts";

test("Value type equal", () => {
    assert.equal(is("foo", "foo"), true);
});

test("Reference type equal", () => {
    const foo = {};
    assert.equal(is(foo, foo), true);
});

test("Value type not equal", () => {
    assert.equal(is("foo", "bar"), false);
});

test("Reference type not equal", () => {
    assert.equal(is({}, {}), false);
});

test("Plus and minus zero not equal", () => {
    assert.equal(is(+0, -0), false);
});

test("NaN are equal", () => {
    assert.equal(is(NaN, NaN), true);
});
