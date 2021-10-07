import { Full } from "@theory/fs-contract";
import { copyDir, copyFile } from "./scopes/copy.js";
import { read } from "./scopes/read.js";

// Implementation of FS contract for NodeJS APIs
export const fs: Full = {
    read,
    copyDir,
    copyFile,
};
