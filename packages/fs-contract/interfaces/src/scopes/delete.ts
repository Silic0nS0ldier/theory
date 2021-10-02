import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { DiscoverContract } from "./discover.js";

/**
 * Delete files.
 * Implicitly includes discover contract.
 */
export type DeleteContract = {
    delete(path: Path.AbsoluteDir|Path.AbsoluteFile): Result<unknown, unknown>,
} & DiscoverContract;
