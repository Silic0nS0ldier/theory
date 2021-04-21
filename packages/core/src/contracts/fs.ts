// File system contract
// This is an interface for file system interactions
// This is designed to make tests portable across runtimes
// It also encourages the creation of more testable code
// This also makes it possible for emulated file systems interactions to be added, a boon for test performance

// Missing directories will be automatically created
// No 'exists' function, since it is prone to race conditions
// No 'mkdir' function, as the act is arguably an anti-pattern.
// They serve a purpose for a user, but for a program it just leads to redundant mess.
// Some file systems have explored elimination of the concept entirely, leaning into implicit creation (directory lifetime tied to its contents).

export interface FileSystemContract {
    /** Reads contents of a file. */
    read(path: string): Promise<unknown>;
    /** Writes to file. */
    write(path: string, content: unknown): Promise<void>;
    /** Lists immediate children of directory. Empty directories are omitted */
    list(path: string): Promise<string[]>;
    /** Removes a file or directory. */
    remove(path: string): Promise<void>;
}
