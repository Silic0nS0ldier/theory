import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { argv, execPath, exit } from "node:process";

const command = argv[2];
const distDir = "./dist";

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
    const { status, error } = spawnSync(
        execPath,
        [resolveTsc(), "--outDir", distDir],
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

