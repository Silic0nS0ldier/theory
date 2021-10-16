import { err, ok, Result } from "@theory/util-result";

/**
 * Attempts to parse a given path into a URL instance prefixed with the `file://` scheme.
 * @param path Path to parse into URL.
 */
export function parsePath(path: string): Result<URL, unknown> {
    let url: URL;
    try {
        url = new URL(path);
    } catch {
        return err(undefined);
    }

    // Ensure file:// protocol scheme
    if (url.protocol !== "file:") {
        return err(undefined);
    }

    return ok(url);
}