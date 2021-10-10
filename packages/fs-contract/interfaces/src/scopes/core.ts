import { Copy } from "./copy.js";
import { Delete } from "./delete.js";
import { Discover } from "./discover";
import { Move } from "./move.js";
import { Read } from "./read.js";
import { Write, WriteNew } from "./write.js";

/**
 * The core FS contract. All implementations must support this contract slice.
 */
export type Core =
    & Copy
    & Delete
    & Discover
    & Move
    & Read
    & Write
    & WriteNew;
