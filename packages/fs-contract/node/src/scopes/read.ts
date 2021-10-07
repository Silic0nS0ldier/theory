import { Read } from "@theory/fs-contract";
import { ok } from "@theory/util-result";
import { File } from "../ponyfills/file.js";
import { createReadStream } from "node:fs";
import { blob } from "node:stream/consumers";

// TODO Error handling
export const read: Read['read'] = async (path) => {
    const pathLike = path.toAbsoluteFileURI();
    const fileData = await blob(createReadStream(pathLike));
    const file = new File([fileData], pathLike, {  });
    return ok(file);
}
