import test from "ava";
import { is } from "./is.js";

test("Value type equal", t => {
    t.notThrows(() => is("foo", "foo"));
});

test("Reference type equal", t => {
    const foo = {};
    t.notThrows(() => is(foo, foo));
});

test("Value type not equal", t => {
    t.throws(() => is("foo", "bar"));
});

test("Reference type not equal", t => {
    t.throws(() => is({}, {}));
});
