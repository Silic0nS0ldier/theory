import * as Path from "@theory/fs-path";
import { Result } from "@theory/util-result";
import { Discover } from "./discover";

/**
 * Move around files and folders.
 * Implicitly includes discover contract.
 */
export type Move = {
    moveFile(from: Path.AbsoluteFile, to: Path.AbsoluteFile): Promise<Result<void, unknown>>,
    moveDir(from: Path.AbsoluteDir, to: Path.AbsoluteDir): Promise<Result<void, unknown>>,
} & Discover;
