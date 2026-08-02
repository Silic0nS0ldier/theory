import type { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import type { Discover } from "./discover.ts";

/**
 * Delete files.
 * Implicitly includes discover contract.
 */
export type Delete = {
    delete(path: Path.AbsoluteDir|Path.AbsoluteFile): Promise<Result<void, unknown>>,
} & Discover;
