import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { DiscoverContract } from "./discover.js";

/**
 * Read files.
 * Implicitly includes discover contract.
 * @todo Should we have a single `read()` call which returns an object with `toString` and `toStream` methods?
 */
export type ReadContract = {
    readAsStream(path: Path.AbsoluteFile): Result<ReadableStream, unknown>,
    readAsString(path: Path.AbsoluteFile): Result<string, unknown>,
} & DiscoverContract;
