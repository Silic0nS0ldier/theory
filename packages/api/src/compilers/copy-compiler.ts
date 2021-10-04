import { ok } from "@theory/util-result";
import { CompilerContract, CompilerError } from "../compiler.js";

type Services = {
    fs: unknown,
};

/**
 * A naive test compiler which copies source to the output.
 * @param paths Paths to files or folders that should be copied.
 */
export function createCopyCompiler(paths: unknown[], { fs }: Services): CompilerContract {
    return async function (_, outputDir) {
        for (const path of paths) {
            // TODO Error handling
            // await fs.copy(path, outputDir);
        }

        return ok(undefined);
    };
}
