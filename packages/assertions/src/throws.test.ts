import assert from "node:assert/strict";
import test from "node:test";
import { throws } from "./throws.ts";

test("Promise no throw", async () => {
    assert.equal(await throws(async () => {}), false);
});

test("Promise throw", async () => {
    assert.equal(await throws(async () => {
        throw new Error();
    }), true);
});

test("No throw", async () => {
    assert.equal(await throws(() => {}), false);
});

test("Throw", async () => {
    assert.equal(await throws(() => {
        throw new Error();
    }), true);
});

test.todo("thrown error specs");

