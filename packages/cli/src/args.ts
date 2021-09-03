import { parse } from "ts-command-line-args";
import { err, ok, Result } from "@ppaya/result-ts";

type GenericError = {};

type Args = {
    watch: boolean,
    help: boolean,
};

export function getArgs(argv: string[]): Result<Args, GenericError> {
    try {
        return ok(parse<Args>({
            watch: {
                alias: "w",
                defaultValue: false,
                type: Boolean,
            },
            help: {
                alias: "h",
                defaultValue: false,
                type: Boolean,
            }
        }, {
            argv,
            // TODO Send to a logger
            logger: console,
            // baseCommand: "...",
            helpArg: "help",
        }));
    }
    catch (error) {
        return err({});
    }
}
