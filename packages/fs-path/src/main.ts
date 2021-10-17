import { Result, ok, err } from "@theory/util-result";

export type AbsoluteFile = {
    toAbsoluteFileURI(): string,
    withRelative(from: AbsoluteDir): RelativeFile,
    asDir(): AbsoluteDir,
};
export type RelativeFile = {
    toRelativeFileURI(): string,
    withAbsolute(to: AbsoluteDir): AbsoluteFile,
    asDir(): RelativeDir,
};
export type AbsoluteDir = {
    toAbsoluteDirURI(): string,
    withRelative(from: AbsoluteDir): RelativeDir,
    withFile(filename: string): AbsoluteFile,// filename validity check
};
export type RelativeDir = {
    toRelativeDirURI(): string,
    withAbsolute(to: AbsoluteDir): AbsoluteDir,
    withFile(filename: string): RelativeFile,// filename validity check
};

const invalidProtocolError = Symbol("invalid-protocol");
const expectedAbsolutePathError = Symbol("expected-absolute-path");
const expectedRelativePathError = Symbol("expected-relative-path");
type Errors =
    | typeof invalidProtocolError
    | typeof expectedAbsolutePathError
    | typeof expectedRelativePathError
;

type InvalidProtocolError = {
    type: typeof invalidProtocolError,
};

type ExpectedAbsolutePathError = {
    type: typeof expectedAbsolutePathError,
};

type ExpectedRelativePathError = {
    type: typeof expectedRelativePathError,
};

/**
 * Creates an absolute file path instance.
 * @param path Absolute path of file.
 */
export function absoluteFile(path: string|URL): Result<AbsoluteFile, InvalidProtocolError|ExpectedAbsolutePathError> {
    throw '';
}

/**
 * Creates relative file path instance.
 * @param path Relative path of file.
 */
export function relativeFile(path: string): Result<RelativeFile, ExpectedRelativePathError> {
    throw '';
}

/**
 * Creates absolute directory path instance.
 * @param path Absolute path of directory.
 */
export function absoluteDir(path: string|URL): Result<AbsoluteDir, InvalidProtocolError|ExpectedAbsolutePathError> {
    throw '';
}

/**
 * Creates relative directory path instance.
 * @param path Relative path of directory.
 */
export function relativeDir(path: string): Result<RelativeDir, ExpectedRelativePathError> {
    throw '';
}
