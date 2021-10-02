import { Result } from "@theory/util-result";
import * as Path from "@theory/fs-path";
import { DeleteContract } from "./delete.js";
import { DiscoverContract } from "./discover.js";
import { WriteForceContract, WriteNewContract } from "./write.js";

/**
 * Modify existing files.
 * Implicitly includes discover, write and delete contracts.
 */
export type ModifyContract = {
    append(path: Path.AbsoluteFile, ): Result<unknown, unknown>,
    prepend(path: Path.AbsoluteFile, ): Result<unknown, unknown>,
} & DiscoverContract & WriteForceContract & WriteNewContract & DeleteContract;