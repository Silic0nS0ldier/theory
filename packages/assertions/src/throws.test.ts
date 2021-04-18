import { throws } from "./throws.js";
import test from "ava";

test("Promise no throw", async t => {
    await t.throwsAsync(
        () => throws(
            async () => {},
        ),
    );
});

test("Promise throw", async t => {
    await throws(async () => {
        throw new Error();
    });

    t.pass();
});

test("No throw", async t => {
    await t.throwsAsync(
        () => throws(
            () => {},
        ),
    );
});

test("Throw", async t => {
    await throws(() => {
        throw new Error();
    });

    t.pass();
});

test.todo("thrown error specs");
