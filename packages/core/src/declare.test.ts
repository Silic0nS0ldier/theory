import assert from "node:assert/strict";
import nodeTest from "node:test";
import { isTest, only, skip, tag, test, timeout, title } from "./declare.ts";

nodeTest("Declared tests are branded", () => {
    assert.equal(isTest(test(() => {})), true);
});

nodeTest("Plain exports are not tests", () => {
    assert.equal(isTest(() => {}), false);
    assert.equal(isTest({}), false);
    assert.equal(isTest(null), false);
    assert.equal(isTest(undefined), false);
});

nodeTest("Declaration retains the body", async () => {
    let ran = false;
    await test(() => { ran = true; }).body();
    assert.equal(ran, true);
});

nodeTest("Declaration defaults", () => {
    assert.deepEqual(test(() => {}).meta, {
        title: undefined,
        tags: [],
        skip: false,
        only: false,
        timeoutMs: undefined,
    });
});

nodeTest("Modifiers compose without mutating the subject", () => {
    const subject = test(() => {});
    const modified = skip(only(timeout(50)(title("Fibonacci")(tag("unit")(subject)))));

    assert.deepEqual(subject.meta.tags, []);
    assert.deepEqual(modified.meta, {
        title: "Fibonacci",
        tags: [ "unit" ],
        skip: true,
        only: true,
        timeoutMs: 50,
    });
    assert.equal(isTest(modified), true);
});

nodeTest("Modifier order does not matter", () => {
    const body = () => {};

    assert.deepEqual(
        test(skip(title("Fibonacci")(body))).meta,
        title("Fibonacci")(skip(test(body))).meta,
    );
});

nodeTest("Modifiers accept a bare body", () => {
    const subject = skip(() => {});

    assert.equal(isTest(subject), true);
    assert.equal(subject.meta.skip, true);
});

nodeTest("Declaring an existing test is a no-op", () => {
    const subject = skip(test(() => {}));

    assert.equal(test(subject), subject);
});

nodeTest("Tags accumulate", () => {
    const subject = tag("slow")(tag("unit", "fs")(test(() => {})));

    assert.deepEqual(subject.meta.tags, [ "unit", "fs", "slow" ]);
});
