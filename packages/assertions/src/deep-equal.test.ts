import test from "ava";
import { deepEqual } from "./deep-equal.js";

test("Throws on primative inputs", t => {
    t.throws(() => deepEqual("foo", {}));
    t.throws(() => deepEqual({}, "bar"));
});
