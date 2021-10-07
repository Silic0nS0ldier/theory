/// <reference lib="dom" />
import { Blob } from "node:buffer";

// @ts-expect-error Blob doesn't yet properly implement streams.
class FilePonyfill extends Blob implements File {
    lastModified: number;
    name: string;
    webkitRelativePath: string;

    constructor(fileBits: (string|NodeJS.ArrayBufferView|Blob)[], fileName: string, options?: FilePropertyBag) {
        super(fileBits as any, options);
        this.name = fileName;
        this.lastModified = 0;
        this.webkitRelativePath = "Unsupported";
    }
}

type FileMiddleground = {
    new(fileBits: (string|NodeJS.ArrayBufferView|Blob)[], fileName: string, options?: FilePropertyBag): File,
};

const FilePonyfillCast: FileMiddleground = FilePonyfill as unknown as FileMiddleground;

export { FilePonyfillCast as File };
