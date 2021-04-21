import { FileSystemContract } from "./contracts/fs.js";

export type TestMeta = Map<Symbol, unknown>;

export type TestContext = {
    // hooks for isolated file system
    // both temporary and persistent
    // temporary to be used by file system dependent code (not assertions)
    // persistent to be used by assertions for things like snapshots and similarity specs
    // approach should consider fs mocking
    // some targets won't have fs access, should raise error
    // ideally error produced on attempting to access fs logic (less places to check)
    readonly internal: {
        readonly fs: FileSystemContract,
    },
    readonly fs: FileSystemContract,
};

export type TestFn = (t: TestContext) => void;

export type Test = TestFn & {
    meta?: TestMeta,
};
