// 1. copy files to temporary directory
// 2. compile if needed
// 3. dispatch jobs to test agents

// Creates a handler, this handes most interactions
function createHandler(): Handler {

}

type Handler = {};

// copy test source to temporary location for execution
// a given generation won't be affected by file system changes
function pinGeneration(handler: Handler): Generation {

}

// ends a generation, cleaning up artefacts
function unpinGeneration(generation: Generation) {

}

type Generation = {};

// run some tests on a given generation
function runTests(generation: Generation, testReferences: TestReference[]) {

}

type TestReference = {};
