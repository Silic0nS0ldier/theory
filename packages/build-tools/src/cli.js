import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { argv, execPath, exit } from "node:process";

const command = argv[2];
// Only used for cleaning; the build reads `outDir` from the package's tsconfig so that a
// bare `tsc` emits to the same place as `tbt build` rather than beside the sources.
const distDir = "./dist";
const testConfig = "./tsconfig.test.json";

switch (command) {
    case "build": {
        build();
        break;
    }
    case "clean": {
        clean();
        break;
    }
    default: {
        unknown(command);
    }
}

function build() {
    clean();

    console.log("Building...");
    tsc([]);

    // Tests are excluded from the emitted project, so they need a pass of their own.
    if (existsSync(testConfig)) {
        console.log("Checking tests...");
        tsc(["--project", testConfig]);
    }
}

function tsc(args) {
    const { status, error } = spawnSync(
        execPath,
        [resolveTsc(), ...args],
        { stdio: "inherit" },
    );

    if (error) {
        throw error;
    }

    if (status !== 0) {
        exit(status ?? 1);
    }
}

function clean() {
    console.log("Cleaning...");
    rmSync(distDir, { force: true, recursive: true });
}

/** Resolves the `tsc` entry point from the TypeScript version this package depends on. */
function resolveTsc() {
    const require = createRequire(import.meta.url);
    return path.join(path.dirname(require.resolve("typescript/package.json")), "bin", "tsc");
}

function help() {
    //todo
}

function unknown(command) {
    console.error(`Unknown command: ${command}`);
    help();
    exit(1);
}

