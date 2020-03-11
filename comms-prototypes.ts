/**
 * The test runner. An API for public consumers such as a CLI, IDE integration, or something crazier.
 * Intent is to fully support watcher scenarios, with file deletions and renames handled gracefully.
 */
interface Runner {
    new (globs: string[]): this;
}

interface Result {
    timing: number;
}

interface AssertionResult extends Result {
    type: string;
}

interface ScenarioResult extends Result {
    assertionResults: AssertionResult[];
}

interface TheoryResult extends Result {
    scenarioResults: ScenarioResult[];
}

/**
 * The test agent. Directed by runner.
 */
interface Agent {
    /**
     * Refresh loaded tests. Called by runner when changes are detected.
     */
    refresh(): Promise<void>;

    /**
     * Run a specific test. May be called multiple times before call completion, but never for an id that is already being run.
     * @param id Unique identifier for a test.
     */
    run(id: string): Promise<TheoryResult>;

    /**
     * Run every test.
     */
    runAll(): AsyncIterable<TheoryResult>;

    /**
     * Instructs agent to dispose of its resources. Once called, the agent will no longer be used.
     * A new instance of the agent may however be created.
     */
    dispose(): Promise<boolean>;
}

