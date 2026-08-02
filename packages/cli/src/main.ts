import { isErr, unwrap } from "@theory/util-result";
import { argv } from "node:process";
import { getArgs } from "./args.ts";

const argsResult = getArgs(argv.slice(2));
if (!isErr(argsResult)) {
    const args = unwrap(argsResult);
}
