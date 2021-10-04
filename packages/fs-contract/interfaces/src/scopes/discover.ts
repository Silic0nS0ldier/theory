import * as Path from "@theory/fs-path";
import { Result } from "@theory/util-result";

/**
 * Contract for discovery of file system resources.
 */
export type Discover = {
    list(path: Path.AbsoluteDir): Result<unknown[], unknown>,
};
