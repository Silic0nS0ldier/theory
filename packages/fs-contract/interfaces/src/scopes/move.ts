import * as Path from "@theory/fs-path";
import type { Result } from "@theory/util-result";
import type { Discover } from "./discover.ts";

/**
 * Move around files and folders.
 * Implicitly includes discover contract.
 */
export type Move = {
    moveFile(from: Path.AbsoluteFile, to: Path.AbsoluteFile): Promise<Result<void, unknown>>,
    moveDir(from: Path.AbsoluteDir, to: Path.AbsoluteDir): Promise<Result<void, unknown>>,
} & Discover;
