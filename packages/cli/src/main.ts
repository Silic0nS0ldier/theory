import { isErr, unwrap } from "@theory/util-result";
import { getArgs } from "./args.js";

const argsResult = getArgs(process.argv);
if (!isErr(argsResult)) {
    const args = unwrap(argsResult);
}
