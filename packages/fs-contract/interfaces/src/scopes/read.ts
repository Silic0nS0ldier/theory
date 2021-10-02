import * as Path from "@theory/fs-path";
import { DiscoverContract } from "./discover.js";

/**
 * Read files.
 * Implicitly includes discover contract.
 */
export type ReadContract = {
    read(path: Path.AbsoluteFile): unknown,
} & DiscoverContract;
