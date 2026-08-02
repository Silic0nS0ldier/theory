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
    assert.equal(conforms({ foo: "bar" }, spec), true);
    assert.equal(conforms({}, spec), false);
});

test("Basic function", () => {
    const spec: Spec = {
        type: TypeNames.FUNCTION,
        properties: {
            foo: "bar"
        }
    };
    function actual() {}
    assert.equal(conforms(actual, spec), false);
    actual.foo = "bar";
    assert.equal(conforms(actual, spec), true);
});

test("Number literal", () => {
    assert.equal(conforms(1, 1), true);
    assert.equal(conforms(2, 1), false);
});


test("String literal", () => {
    assert.equal(conforms("foo", "foo"), true);
    assert.equal(conforms("foo", "bar"), false);
});

test("Boolean literal", () => {
    assert.equal(conforms(true, true), true);
    assert.equal(conforms(true, false), false);
});
