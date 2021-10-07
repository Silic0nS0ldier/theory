import { Read } from "@theory/fs-contract";
import { err } from "@theory/util-result";

// Store for mocked FS
export function createRead(store: unknown): Read['read'] {
    return async function read(path) {
        return err("not implemented");
    }
}