import * as Path from "@theory/fs-path";
import { Result } from "@theory/util-result";
import { Discover } from "./discover";

/**
 * Move around files and folders.
 * Implicitly includes discover contract.
 */
export type Move = {
    moveFile(from: Path.AbsoluteFile, to: Path.AbsoluteFile): Result<unknown, unknown>,
    moveDir(from: Path.AbsoluteDir, to: Path.AbsoluteDir): Result<unknown, unknown>,
} & Discover;
