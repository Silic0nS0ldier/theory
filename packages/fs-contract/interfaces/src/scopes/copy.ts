import * as Path from "@theory/fs-path";

/**
 * Copy files and folders.
 * Implicitly includes discover contract.
 */
export type CopyContract = {
    copyFile(from: Path.AbsoluteFile, to: Path.AbsoluteFile): unknown,
    copyDir(from: Path.AbsoluteDir, to: Path.AbsoluteDir): unknown,
};
