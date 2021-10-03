import { Copy } from "./copy.js";
import { Delete } from "./delete.js";
import { Discover } from "./discover";
import { Move } from "./move.js";
import { Read } from "./read.js";
import { Watch } from "./watch.js";
import { Write, WriteNew } from "./write.js";

/**
 * The full FS contract.
 */
export type Full =
    & Copy
    & Delete
    & Discover
    & Move
    & Read
    & Watch
    & Write
    & WriteNew;
