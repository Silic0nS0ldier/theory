import { isErr, isOk, unwrap } from "@theory/util-result";
import test from "ava";
import { parsePath } from "./parse-path.js";

for (const path of [
    { in: "file:///foo/bar", out: "file:///foo/bar" },
    { in: "file://localhost/foo/bar", out: "file:///foo/bar" },
    { in: "file://foo.bar/foo/bar", out: "file:///foo.bar/foo/bar" },
    { in: "file:///c:foo/bar", out: "file:///c:foo/bar" },
    { in: "file://localhost/c:foo/bar", out: "file:///c:foo/bar" },
    // Remote paths typically don't expose drives like this
    // Regardless we check this anyway for correctness
    // TODO Check spec
    { in: "file://foo.bar/c:foo/bar", out: "file://foo.bar/c:foo/bar" },
]) {
    test(`Absolute path "${path.in}" should normalise to "${path.out}"`, t => {
        const parsed = parsePath(path.in);
        t.true(isOk(parsed));
        // TODO Something weird happening with generic type inference here
        if (isOk<URL, unknown>(parsed)) {
            t.is(unwrap(parsed).toString(), path.out);
        }
    });
}

for (const path of [
    "foo://bar",
]) {
    test(`Bad path "${path}" should fail to parse`, t => {
        t.true(isErr(parsePath(path)));
    });
}
