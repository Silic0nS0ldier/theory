import process from "node:process";
import { takeCoverage } from "node:v8";

// Worker pools terminate their children with a signal, which skips node's exit time coverage
// dump and would silently drop everything those children executed.
for (const signal of [ "SIGTERM", "SIGINT", "SIGHUP" ]) {
    process.on(signal, () => {
        takeCoverage();
        process.exit(128 + (signal === "SIGINT" ? 2 : signal === "SIGHUP" ? 1 : 15));
    });
}
