import execa from "execa";
import del from "del";
import url from "node:url";
import { argv } from "node:process";

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
    execa.sync(
        "tsc",
        [
        "--outDir", distDir,
        ],
        {
            preferLocal: true,
            localDir: url.fileURLToPath(import.meta.url),
            buffer: false,
            stdio: "inherit",
        },
    );
}

function clean() {
    console.log("Cleaning...");
    del.sync(distDir);
}

function help() {
    //todo
}

function unknown(command) {
    console.error(`Unknown command: ${command}`);
    help();
}

