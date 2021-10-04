import * as Path from "@theory/fs-path";
import { Result } from "@theory/util-result";

/**
 * Contract for discovery of file system resources.
 */
export type Discover = {
    // Should returned paths be Path.Absolute*?
    list(path: Path.AbsoluteDir): Promise<Result<unknown[], unknown>>,
};
