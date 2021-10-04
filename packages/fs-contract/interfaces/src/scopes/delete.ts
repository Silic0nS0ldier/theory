import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { Discover } from "./discover.js";

/**
 * Delete files.
 * Implicitly includes discover contract.
 */
export type Delete = {
    delete(path: Path.AbsoluteDir|Path.AbsoluteFile): Promise<Result<void, unknown>>,
} & Discover;
