import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { Discover } from "./discover.js";

/**
 * Read files.
 * Implicitly includes discover contract.
 */
export type Read = {
    read(path: Path.AbsoluteFile): Result<ReadAs, unknown>,
} & Discover;

/**
 * Encapsulates ways a file can be read.
 */
export type ReadAs = {
    stream(): ReadableStream,
    string(): string,
};
