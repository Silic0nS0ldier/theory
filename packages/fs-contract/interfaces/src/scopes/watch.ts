import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { Discover } from "./discover.js";

/**
 * Watch for changes.
 * Implicitly includes discover contract.
 */
export type Watch = {
    /**
     * Watch a given directory or file.
     * @param path Directory or file to watch.
     * @param handler Handler for watcher. This is called once, and controls watcher lifetime.
     * @todo Recursion? When would we want to listen only to the top level vs. specific files?
     * @todo Multiple paths. How well does this map to existing API, would such functionality to too high level?
     */
    watch(
        path: Path.AbsoluteDir|Path.AbsoluteFile,
        handler: (events: AsyncIterator<unknown, unknown, unknown>,
    ) => Promise<unknown>): Result<WatchController, unknown>,
} & Discover;

// Active watcher
type WatchController = {
    stop(): Promise<void>,
};
