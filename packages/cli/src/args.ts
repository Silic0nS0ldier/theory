import { parseArgs } from "node:util";
import { err, ok, type Result } from "@theory/util-result";

type GenericError = {};

type Args = {
    watch: boolean,
    help: boolean,
};

export function getArgs(argv: string[]): Result<Args, GenericError> {
    try {
        const { values } = parseArgs({
            args: argv,
            options: {
                watch: {
                    short: "w",
                    type: "boolean",
                    default: false,
                },
                help: {
                    short: "h",
                    type: "boolean",
                    default: false,
                },
            },
        });

        return ok({
            watch: values.watch ?? false,
            help: values.help ?? false,
        });
    }
    catch {
        return err({});
    }
}
