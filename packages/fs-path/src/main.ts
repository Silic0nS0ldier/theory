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
    withFile(filename: Segment): AbsoluteFile,
};
export type RelativeDir = {
    toRelativeDirURI(): string,
    withAbsolute(to: AbsoluteDir): AbsoluteDir,
    withFile(filename: Segment): RelativeFile,
};
export type Segment = {

};

/**
 * Creates an absolute file path instance from a string.
 * Error result will be returned if path ends in a directory seperator.
 * @param path Absolute path of file.
 */
export function absoluteFileFromString(path: string): Result<AbsoluteFile, unknown> {
    throw '';
}

export function relativeFileFromString(path: string): Result<AbsoluteFile, unknown> {
    throw '';
}

export function absoluteDirFromString(path: string): AbsoluteDir {
    throw '';
}

export function relativeDirFromString(path: string): AbsoluteDir {
    throw '';
}

export function segmentFromString(segment: string): Segment {
    throw '';
}

function parsePath(rawPath: string): Result<URL, unknown> {
    try {
        return ok(new URL(rawPath));
    } catch (e) {
        return err(e);
    }
}
