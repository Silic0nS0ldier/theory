import type { Result } from "@theory/util-result";

/** @todo */
export class CompilerError {

}

/**
 * API contract for optional compilation step that runs prior to tests being processed.
 * Sharding is handled separately, and is configurable.
 * @param entrypoints Matched test files which are to be processed.
 * @param outputDir Output directory where compiled source should be deposited. This is a directory managed by Theory.
 */
export type CompilerContract = (entrypoints: unknown[], outputDir: unknown) => Promise<Result<void, CompilerError>>;
