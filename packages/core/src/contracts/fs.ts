// File system contract
// This is an interface for file system interactions
// This is designed to make tests portable across runtimes
// It also encourages the creation of more testable code
// This also makes it possible for emulated file systems interactions to be added, a boon for test performance

export type Path = string & { __PATH: never };

/**
 * Checking for file existence is an anti-pattern (status may change after check), so `exist` and `list` are not available.
 * Folder and file management is automated. Missing folders will be created, unused files will be removed.
 */
export type FileSystemContract = {
    /** Reads contents of a file. */
    read(path: string): Promise<unknown>;
    /** Writes to file. */
    write(path: string, content: unknown): Promise<void>;
}
