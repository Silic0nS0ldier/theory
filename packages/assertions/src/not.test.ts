import test from "ava";
import { not } from "./not.js";

test("Value type equal", t => {
    t.throws(() => not("foo", "foo"));
});

test("Reference type equal", t => {
    const foo = {};
    t.throws(() => not(foo, foo));
});

test("Value type not equal", t => {
    t.notThrows(() => not("foo", "bar"));
});

test("Reference type not equal", t => {
    t.notThrows(() => not({}, {}));
});
