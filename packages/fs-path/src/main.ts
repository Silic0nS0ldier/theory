import { Result, ok, err } from "@theory/util-result";

export type AbsoluteFile = {
    readonly url: URL,
    toAbsoluteFileURI(): string,
    withRelative(from: AbsoluteDir): RelativeFile,
    asDir(): AbsoluteDir,
};
export type RelativeFile = {
    readonly url: URL,
    toRelativeFileURI(): string,
    withAbsolute(to: AbsoluteDir): AbsoluteFile,
    asDir(): RelativeDir,
};
export type AbsoluteDir = {
    readonly url: URL,
    toAbsoluteDirURI(): string,
    withRelative(from: AbsoluteDir): RelativeDir,
    withFile(filename: Segment): AbsoluteFile,
};
export type RelativeDir = {
    readonly url: URL,
    toRelativeDirURI(): string,
    withAbsolute(to: AbsoluteDir): AbsoluteDir,
    withFile(filename: Segment): RelativeFile,
};
export type Segment = {

};

export function absoluteFileFromString(path: string): Result<AbsoluteFile, unknown> {

}

export function absoluteDirFromString(path: string): AbsoluteDir {

}

export function segmentFromString(segment: string): Segment {

}

function parsePath(rawPath: string): Result<URL, unknown> {
    try {
        return ok(new URL(rawPath));
    } catch (e) {
        return err(e);
    }
}
