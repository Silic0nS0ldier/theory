// Depending on how this evolves, it may have use outside of Theory

/**
 * File system contract
 * This is an interface for file system interactions.
 * This is designed to make tests portable across runtimes.
 * It also encourages the creation of more testable code.
 * This also makes it possible for emulated file systems interactions to be added, a boon for test
 * performance.
 * @todo Decide on path management approach (string-like or something else)
 * @todo Divide up contract surface by capabilities (e.g. read/write)
 * @todo Investigate existing FS APIs to determine if and how scale optimisations can be made (e.g. file streaming, partial read)
 * @todo Error types (not enough space, blocked by permissions, too long path)
 * @todo How should copy/move handle subject not existing or being an empty folder tree?
 */

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

// Below are FS contract slices, shortcut types for consumers
// Intent is to create a system where API contracts can be kept minimal
// Some slices have very limited functionalty, this is not for security but rather to
// discourage/prevent API misuse that would hamper performance or otherwise mislead as to consumer
// requirements.

// Read single file
// Limited contract, acts as a helper type for deferred file reads
type ReadSingleFSContract = () => unknown;

// Read and discover files
type ReadFSContract = {
    read(path: Path): unknown,
    // and deferred
    tbdSingle(): ReadSingleFSContract,
} & DiscoverFSContract;

// Discover files
type DiscoverFSContract = {
    // discovery API TBD, these are normally limited via dir conventions
    // may be that discovery is constrained to namespaces vs. folders (more portable concept)
};

// Watch (for changes) and discover files
type WatchFSContract = {
    // watcher creation functions
    tbd(): WatcherFSContract,
} & DiscoverFSContract;

// Active watcher, naive
// Limited contract, acts as a helper for naive trigger
type WatcherNaiveFSContract = {
    // need to figure out addition and removal of listeners
};

// Active watcher and discover files
type WatcherFSContract = {
    // naive watcher creation TBD
    tbdNaive(): WatcherNaiveFSContract,
    // creation of filtered watchers?
} & DiscoverFSContract;

// Write (new files)
// Limited contract, acts as helper type for contract fulfillment
type WriteNaiveFSContract = () => unknown;

// Write and discover files
type WriteFSContract = {
    write(): unknown,
    tbdNaive(): WriteNaiveFSContract,
} & DiscoverFSContract;

// Delete and discover files
type DeleteFSContract = {
    delete(): unknown,
} & DiscoverFSContract;
