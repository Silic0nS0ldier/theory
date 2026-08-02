import assert from "node:assert/strict";
import test from "node:test";
import { deepEqual } from "./deep-equal.ts";

test("Throws on primative inputs", () => {
    assert.throws(() => deepEqual("foo", {}));
    assert.throws(() => deepEqual({}, "bar"));
});
