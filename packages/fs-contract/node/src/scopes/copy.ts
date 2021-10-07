import { Copy } from "@theory/fs-contract";
import { ok } from "@theory/util-result";
import { promises } from "node:fs";

// TODO Error handling
export const copyFile: Copy['copyFile'] = async (from, to) => {
    await promises.copyFile(
        from.toAbsoluteFileURI(),
        to.toAbsoluteFileURI(),
    );
    return ok(undefined);
}

// TODO Error handling
export const copyDir: Copy['copyDir'] = async (from, to) => {
    await promises.cp(
        from.toAbsoluteDirURI(),
        to.toAbsoluteDirURI(),
        { recursive: true }
    );
    return ok(undefined);
}
