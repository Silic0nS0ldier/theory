import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { Discover } from "./discover.js";

/**
 * Read files.
 * Implicitly includes discover contract.
 */
export type Read = {
    read(path: Path.AbsoluteFile): Promise<Result<File, unknown>>,
} & Discover;
