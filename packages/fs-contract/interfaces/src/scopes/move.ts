import * as Path from "@theory/fs-path";

/**
 * Move around files and folders.
 * Implicitly includes discover contract.
 */
export type MoveContract = {
    moveFile(from: Path.AbsoluteFile, to: Path.AbsoluteFile): unknown,
    moveDir(from: Path.AbsoluteDir, to: Path.AbsoluteDir): unknown,
};
