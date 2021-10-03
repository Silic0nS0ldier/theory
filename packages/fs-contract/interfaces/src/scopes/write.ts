import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { DiscoverContract } from "./discover.js";
import { DeleteContract } from "./delete.js";

/**
 * Write new files.
 * Implicitly includes discover contract.
 */
export type WriteNewContract = {
    writeNew(path: Path.AbsoluteFile, content: WritableStream|string): Result<unknown, unknown>,
} & DiscoverContract;

/**
 * Write to files, overwriting if they already exist.
 * Implicitly includes discover and delete contracts.
 */
export type WriteForceContract = {
    writeForce(path: Path.AbsoluteFile, content: WritableStream|string): Result<unknown, unknown>
} & DiscoverContract & DeleteContract;
