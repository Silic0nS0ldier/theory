import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { DiscoverContract } from "./discover.js";

/**
 * Read files.
 * Implicitly includes discover contract.
 */
export type ReadContract = {
    read(path: Path.AbsoluteFile): Result<ReadToContract, unknown>,
} & DiscoverContract;

/**
 * Encapsulates ways a file can be read.
 */
export type ReadToContract = {
    stream(): ReadableStream,
    string(): string,
};
