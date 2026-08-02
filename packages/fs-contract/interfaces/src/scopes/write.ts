import type { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import type { Discover } from "./discover.ts";
import type { Delete } from "./delete.ts";
import type { Copy } from "./copy.ts";
import type { Move } from "./move.ts";

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
