import test from "ava";
import { err, isErr, isOk, ok, unwrap } from "./main.js";

test("baseline", t => {
    // ok
    const ro1 = ok(true);
    t.true(isOk(ro1));
    t.false(isErr(ro1));
    // @ts-expect-error Non-error indicates implementation type has leaked
    const uwro1 = unwrap(ro1);
    t.is(uwro1, true);
    isOk(ro1) && unwrap(ro1);
    isErr(ro1) && unwrap(ro1);

    // err
    const re1 = err(true);
    t.false(isOk(re1));
    t.true(isErr(re1));
    // @ts-expect-error Non-error indicates implementation type has leaked
    const uwre1 = unwrap(re1);
    t.is(uwre1, true);
    isOk(re1) && unwrap(re1);
    isErr(re1) && unwrap(re1);
});
