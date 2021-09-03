import test from "ava";
import XWorker from "web-worker";

test("worker", async t => {
    const w = new XWorker(new URL('./worker.js', import.meta.url), { type: "module" });
    await new Promise(resolve => {
        w.addEventListener("message", ev => {
            t.is(ev.data, "test");
            resolve(null);
        });
    });
});
