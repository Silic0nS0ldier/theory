import * as Path from "@theory/fs-path";
import { Discover } from "./discover.js";

/**
 * Copy files and folders.
 * Implicitly includes discover contract.
 */
export type Copy = {
    copyFile(from: Path.AbsoluteFile, to: Path.AbsoluteFile): unknown,
    copyDir(from: Path.AbsoluteDir, to: Path.AbsoluteDir): unknown,
} & Discover;
