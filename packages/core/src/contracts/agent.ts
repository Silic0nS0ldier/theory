// Agent contract
// This is an interface for theory agent interactions

const enum EventIds {
    RESULT,
};

type Events = {
    type: EventIds.RESULT,
    payload: {},
};

export interface AgentContract {
    /**
     * Instructs agent to run some test files.
     * @todo What about targetted runs? Where we are looking to run only a specific test case.
     * @param paths Paths of test files.
     * @param generation Generation files belong to. Used to ensure reporting is valid.
     */
    run(paths: Set<string>, generation: number): void;

    /**
     * Agent events. These should be persisted until read.
     */
    readonly events: AsyncIterable<Events>;
}
