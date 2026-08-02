import assert from "node:assert/strict";
import test from "node:test";
import { throws } from "./throws.ts";

test("Promise no throw", async () => {
    await assert.rejects(
        () => throws(
            async () => {},
        ),
    );
});

test("Promise throw", async () => {
    await throws(async () => {
        throw new Error();
    });
});

test("No throw", async () => {
    await assert.rejects(
        () => throws(
            () => {},
        ),
    );
});

test("Throw", async () => {
    await throws(() => {
        throw new Error();
    });
});

test.todo("thrown error specs");
