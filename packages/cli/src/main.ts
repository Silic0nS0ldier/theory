import { isErr, unwrap } from "@ppaya/result-ts";
import { getArgs } from "./args.js";

const argsResult = getArgs(process.argv);
if (!isErr(argsResult)) {
    const args = unwrap(argsResult);
}
