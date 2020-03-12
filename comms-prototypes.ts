/**
 * The test runner. An API for public consumers such as a CLI, IDE integration, or something crazier.
 * Intent is to fully support watcher scenarios, with file deletions and renames handled gracefully.
 */
interface Runner {
    new (globs: string[]): this;
}

