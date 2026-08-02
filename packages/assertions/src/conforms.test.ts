import assert from "node:assert/strict";
import test from "node:test";
import { conforms, type Spec, TypeNames } from "./conforms.ts";

test("Basic object", () => {
    const spec: Spec = {
        type: TypeNames.OBJECT,
        properties: {
            foo: "bar"
        }
    };
    assert.doesNotThrow(() => {
        conforms(spec, { foo: "bar" });
    });
    assert.throws(() => {
        conforms(spec, {});
    });
});

test("Basic function", () => {
    const spec: Spec = {
        type: TypeNames.FUNCTION,
        properties: {
            foo: "bar"
        }
    };
    function actual() {}
    assert.throws(() => conforms(spec, actual));
    actual.foo = "bar";
    assert.doesNotThrow(() => conforms(spec, actual));
});

test("Number literal", () => {
    assert.doesNotThrow(() => {
        conforms(1, 1);
    });
    assert.throws(() => {
        conforms(1, 2);
    });
});

test("String literal", () => {
    assert.doesNotThrow(() => {
        conforms("foo", "foo");
    });
    assert.throws(() => {
        conforms("foo", "bar");
    });
});

test("Boolean literal", () => {
    assert.doesNotThrow(() => {
        conforms(true, true);
    });
    assert.throws(() => {
        conforms(true, false);
    });
});
