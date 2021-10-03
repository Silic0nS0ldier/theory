import * as Path from "@theory/fs-path";
import { Discover } from "./discover";

/**
 * Move around files and folders.
 * Implicitly includes discover contract.
 */
export type Move = {
    moveFile(from: Path.AbsoluteFile, to: Path.AbsoluteFile): unknown,
    moveDir(from: Path.AbsoluteDir, to: Path.AbsoluteDir): unknown,
} & Discover;
