interface ITestFunction<TScenarios> {
    (t: any, scenario: TScenarios): Promise<void>|void;
}

interface ITheory<TScenarios> {
    /**
     * Adds an optional description to the theory. This will be included in certain reports.
     * @param description Description to append to theory.
     */
    describe(description: string): this;

    /**
     * Used to indicate that the test should be skipped.
     */
    skip(): this;

    /**
     * Adds a scenario for the theory that will be run against the test function.
     * Multiple scenarios may be applied to a single theory, the execution order can and will change.
     * @param scenario Data to pass to test function.
     * @param description Optional description for scenario.
     */
    scenario<TNewScenario>(scenario: TNewScenario, description?: string): ITheory<TNewScenario|NonNullable<TScenarios>>;

    /**
     * Adds a test for the theory, and terminates the theory composition chain.
     * @param fn Test function that will determine if the theory holds.
     */
    test(fn: ITestFunction<TScenarios>): void;
}

class Theory<TScenarios> implements ITheory<TScenarios> {
    describe(description: string): this {
        throw new Error("Method not implemented.");
    }
    skip(): this {
        throw new Error("Method not implemented.");
    }
    scenario<TNewScenario>(scenario: TNewScenario, description?: string): ITheory<TNewScenario|NonNullable<TScenarios>>
    {
        throw new Error("Method not implemented.");
    }
    test(fn: ITestFunction<TScenarios>): void {
        throw new Error("Method not implemented.");
    }
}

/**
 * Starts a theory.
 */
export function theory(): ITheory<undefined> {
    return new Theory<undefined>();
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

export interface TheoryResult extends Result {
    scenarioResults: ScenarioResult[];
}
