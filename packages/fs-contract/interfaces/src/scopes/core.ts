import type { Copy } from "./copy.ts";
import type { Delete } from "./delete.ts";
import type { Discover } from "./discover.ts";
import type { Move } from "./move.ts";
import type { Read } from "./read.ts";
import type { Write, WriteNew } from "./write.ts";

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
