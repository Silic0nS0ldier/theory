import { isErr, isOk } from "@theory/util-result";
import test from "ava";
import { parsePath } from "./parse-path.js";

// Should pass
for (const path of [
    "file://foo/bar"
]) {
    test(path, t => {
        t.true(isOk(parsePath(path)));
    });
}

// Should fail
for (const path of [
    "foo://bar"
]) {
    test(path, t => {
        t.true(isErr(parsePath(path)));
    });
}
