import test from "ava";
import { decorate, describe, skip } from "./theory-meta.js";

test("Description is added", t => {
    const impl = decorate(
        describe("foo bar"),
    ).impl(() => {});

    t.deepEqual(impl.theoryMeta?.get("description"), ["foo bar"]);
});

test("Description accumulates across calls", t => {
    const impl = decorate(
        describe("foo bar"),
        describe("bar foo"),
    ).impl(() => {});

    t.deepEqual(impl.theoryMeta?.get("description"), ["foo bar", "bar foo"]);
});

test("Skip flag is added", t => {
    const impl = decorate(
        skip
    ).impl(() => {});

    t.is(impl.theoryMeta?.get("skip"), true);
});
