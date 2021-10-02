import { DeleteContract } from "./delete.js";
import { DiscoverContract } from "./discover";
import { ModifyContract } from "./modify.js";
import { ReadContract } from "./read.js";
import { WatchContract } from "./watch.js";
import { WriteForceContract, WriteNewContract } from "./write.js";

/**
 * The full FS contract.
 */
export type FullContract =
    & DeleteContract
    & DiscoverContract
    & ModifyContract
    & ReadContract
    & WatchContract
    & WriteNewContract
    & WriteForceContract;
