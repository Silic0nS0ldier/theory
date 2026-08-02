import { Full } from "@theory/fs-contract";
import { copyDir, copyFile } from "./scopes/copy.ts";
import { read } from "./scopes/read.ts";

// Implementation of FS contract for NodeJS APIs
export const fs: Full = {
    read,
    copyDir,
    copyFile,
};
