import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { Discover } from "./discover.js";
import { Delete } from "./delete.js";
import { Copy } from "./copy.js";
import { Move } from "./move.js";

/**
 * Write new files.
 * Implicitly includes discover contract.
 */
export type WriteNew = {
    writeNew(path: Path.AbsoluteFile, content: WritableStream|string): Promise<Result<void, unknown>>,
} & Discover;

/**
 * Write to files.
 * Implicitly includes discover, delete, copy, and move contracts.
 */
export type Write = {
    writeForce(path: Path.AbsoluteFile, content: WritableStream|string): Promise<Result<void, unknown>>,
} & WriteNew & Discover & Delete & Copy & Move;
