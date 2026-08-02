import type { Core } from "./core.ts";
import type { Watch } from "./watch.ts";

/**
 * The complete FS contract: the core slice plus every optional scope.
 * Implementations that cannot back an optional scope should expose `Core` instead.
 */
export type Full =
    & Core
    & Watch;
