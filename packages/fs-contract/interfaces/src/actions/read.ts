import { Result } from "@theory/util-result";
import { Path } from "../main.js";

export type Read = (path: Path) => Promise<Result<unknown, unknown>>;