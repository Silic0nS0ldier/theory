import type { Path } from "@theory/core";
import type { Result } from "@theory/util-result";

export class CompilerError {

}

/**
 * API contract for optional compilation step that runs prior to tests being processed.
 * @param entrypoints Matched test files which are to be processed.
 * @param outputDir Output directory where compiled source should be deposited. This is a directory managed by Theory.
 * @todo Explore tooling in large JS projects, determine requirements for source transformations and potential bottlenecks.
 * @todo Compiling everything at once may slow down how quickly tests can begin being processed.
 */
export type CompilerContract = (entrypoints: Path[], outputDir: Path) => Promise<Result<void, CompilerError>>;
