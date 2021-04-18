import test from "ava";
import { decorate, FunctionDecorator, getOrCreateMeta } from "./test-meta-utils.js";

test("getOrCreateMeta", t => {
    const testFn = () => {};
    const meta = getOrCreateMeta(testFn);
    t.deepEqual(meta, new Map());
});

type Target = { foo?: true } & (() => void);

test("Returning decorator", t => {
    const decor: FunctionDecorator<Target> = target => {
        const wrapper: Target = () => target();
        wrapper.foo = true;
        return wrapper;
    }

    const before: Target = () => {};
    const after = decorate(decor).impl(before);

    t.falsy(before.foo);
    t.true(after.foo);
});

test("Non-returning decorator", t => {
    const decor: FunctionDecorator<Target> = target => {
        target.foo = true;
    }

    const before: Target = () => {};
    const after = decorate(decor).impl(before);

    t.true(before.foo);
    t.true(after.foo);
});
