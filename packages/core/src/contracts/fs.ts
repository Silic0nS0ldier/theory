// File system contract
// This is an interface for file system interactions
// This is designed to make tests portable across runtimes
// It also encourages the creation of more testable code
// This also makes it possible for emulated file systems interactions to be added, a boon for test performance

import { Result } from "@theory/util-result";

export type Path = string & { __PATH: never };

// Path information for predictable rename/copy/move behaviour.
export type RenameItem = {
    /** Full path to subject (file or folder/namespace). */
    path: Path,
    /** Portion of path to preserve. If not set, nothing is preserved. */
    suffix?: Path,
};

/**
 * Checking for file existence is an anti-pattern (status may change after check), so `exist` and `list` are not available.
 * Folder and file management is automated. Missing folders will be created, unused files will be removed.
 */
export type FileSystemContract = {
    /** Reads contents of a file. */
    read(path: Path): Promise<Result<unknown, unknown>>;
    /** Writes to file. */
    write(path: Path, content: unknown): Promise<Result<void, unknown>>;
    /** Copies file or folder (namespace) to specified target. */
    copy(from: RenameItem, to: Path): Promise<Result<void, unknown>>;
    /** Moves file or folder (namespace) to specified target. */
    move(from: RenameItem, to: Path): Promise<Result<void, unknown>>;
}
