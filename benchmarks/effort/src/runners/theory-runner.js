import { readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { AsyncLocalStorageVariable } from "@theory/agent-nodejs";
import { bindTestContext, isTest, setAsyncVariableImplementation } from "@theory/core";

// Minimal stand-in for the Theory CLI, which is not yet complete. See README.
setAsyncVariableImplementation(AsyncLocalStorageVariable);

const workDir = process.argv[2];
const files = readdirSync(workDir)
    .filter(name => name.endsWith(".test.js"))
    .sort();

let passed = 0;
let failed = 0;

for (const file of files) {
    const module = await import(pathToFileURL(path.join(workDir, file)).href);

    for (const [ name, value ] of Object.entries(module)) {
        if (!isTest(value) || value.meta.skip) {
            continue;
        }

        const records = await bindTestContext(value)();

        if (records.length > 0 && records.every(record => record.passed)) {
            passed += 1;
        } else {
            failed += 1;
            console.log(`fail ${file} > ${value.meta.title ?? name}`);
        }
    }
}

console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed === 0 ? 0 : 1;
