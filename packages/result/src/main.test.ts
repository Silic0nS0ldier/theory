import assert from "node:assert/strict";
import test from "node:test";
import { err, isErr, isOk, ok, unwrap } from "./main.ts";

test("baseline", () => {
    // ok
    const ro1 = ok(true);
    // `assert.equal` rather than `assert.ok` so the result type stays un-narrowed below
    assert.equal(isOk(ro1), true);
    assert.equal(isErr(ro1), false);
    // @ts-expect-error Non-error indicates implementation type has leaked
    const uwro1 = unwrap(ro1);
    assert.equal(uwro1, true);
    isOk(ro1) && unwrap(ro1);
    isErr(ro1) && unwrap(ro1);

    // err
    const re1 = err(true);
    assert.equal(isOk(re1), false);
    assert.equal(isErr(re1), true);
    // @ts-expect-error Non-error indicates implementation type has leaked
    const uwre1 = unwrap(re1);
    assert.equal(uwre1, true);
    isOk(re1) && unwrap(re1);
    isErr(re1) && unwrap(re1);
});
