import { conforms, Spec, TypeNames } from "./conforms.js";
import test from "ava";

test("Basic object", t => {
    const spec: Spec = {
        type: TypeNames.OBJECT,
        properties: {
            foo: "bar"
        }
    };
    t.notThrows(() => {
        conforms(spec, { foo: "bar" });
    });
    t.throws(() => {
        conforms(spec, {});
    });
});

test("Basic function", t => {
    const spec: Spec = {
        type: TypeNames.FUNCTION,
        properties: {
            foo: "bar"
        }
    };
    function actual() {}
    t.throws(() => conforms(spec, actual));
    actual.foo = "bar";
    t.notThrows(() => conforms(spec, actual));
});

test("Number literal", t => {
    t.notThrows(() => {
        conforms(1, 1);
    });
    t.throws(() => {
        conforms(1, 2);
    });
});

test("String literal", t => {
    t.notThrows(() => {
        conforms("foo", "foo");
    });
    t.throws(() => {
        conforms("foo", "bar");
    });
});

test("Boolean literal", t => {
    t.notThrows(() => {
        conforms(true, true);
    });
    t.throws(() => {
        conforms(true, false);
    });
});
