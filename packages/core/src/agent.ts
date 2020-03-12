import { TheoryResult } from "./theory";

export interface Agent {
    /**
     * Refresh loaded tests. Called by runner when changes are detected.
     * @param files Files to load. Map keys are the unique id associated with a file.
     */
    refresh(files: Map<string, string>): Promise<boolean>;

    /**
     * Run a specific theory's test.
     * May be called multiple times before call completion, but never for an id that is already being run.
     * @param fileId Unique identifier for a file.
     * @param theoryId Unique identifier for a theory.
     * @param scenario Optional number that correlates the scenario which should be tested.
     */
    run(fileId: string, theoryId: string, scenario?: number): Promise<TheoryResult>;

    /**
     * Instructs agent to dispose of its resources. Once called, the agent will no longer be used.
     * A new instance of the agent may however be created.
     */
    dispose(): Promise<boolean>;
}
