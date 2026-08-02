let testsStore = [], onlyStore = [];
let passed = 0, failed = 0, skipped = 0;

function start({ title, timeout, resolve }: { title: string, timeout: number, resolve: () => void }) {
    let called = false;
    const end = function (err?) {
        if (called) return;
        called = true;
        clearTimeout(timer);
        if (err instanceof Error) {
            failed++;
            console.log(`❌ ${title}`);
            console.error(err);
        }
        else {
            passed++;
            console.log(`✔ ${title}`);
        }
        resolve();
    }
    const timer = setTimeout(end, timeout, new Error(`Test "${title} timed out after ${timeout}ms`));
    return end;
}

async function execute({ tests, isSerial, timeout }: { tests: [ string, () => void ][], isSerial: boolean, timeout: number }) {
    const results = [];
    for (const [ title, testFn ] of tests) {
        const test = new Promise(async function (resolve) {
            const end = start({ title, timeout, resolve });
            try {
                await Promise.resolve(testFn());
                end();
            }
            catch (err) {
                end(err);
            }
        });
        results.push(isSerial ? await test : test);
    }
    return results;
}

/**
 * Test runner.
 * @param files Files with tests to run.
 * @param isSerial If tests should be run sequentially.
 * @param timeout Test timeout.
 */
export async function run(files: string[], isSerial: boolean = false, timeout: number = 15000) {
    [ testsStore, onlyStore ] = [ [], [] ];
    [ passed, failed, skipped ] = [ 0, 0, 0 ];

    const testScripts = [];

    for (const file of files) {
        testScripts.push(await import(file));
    }

    const results = await execute({ tests: onlyStore.length ? onlyStore : testsStore, isSerial, timeout });

    await Promise.all(results).catch(function () {});

    const total = testsStore.length + onlyStore.length + skipped;
    return { total, failed, passed };
}

/**
 * Skip this test.
 */
export function skip() { skipped++; }

/**
 * Registers a test such that only it, and other 'only' marked tests will be run.
 * @param title Test title.
 * @param testFn Test function.
 */
export function only(title: string, testFn: () => void) { onlyStore.push([ title, testFn ]); }

/**
 * Registers a test.
 * @param title Test title.
 * @param testFn Test function.
 */
export function test(title: string, testFn: () => void) { testsStore.push([ title, testFn ]); }
test.skip = skip;
test.only = only;
export default test;
