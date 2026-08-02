import assert from "node:assert/strict";
import test from "node:test";
import { deepEqual } from "./deep-equal.ts";

test("Fails on primative inputs", () => {
    assert.equal(deepEqual("foo", {}), false);
    assert.equal(deepEqual({}, "bar"), false);
});
