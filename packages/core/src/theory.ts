import { Spread } from "./array-object-merge.js";

// TAssertions injected are a little whacky, in that methods are tagged as properties
// Would be nice to have these correctly categorised as it will help dev experience
// Failing that, consistency helps
type ExecutionContext<TAssertions extends object[]> = {
    /**
     * Assert an expression or value is strictly true.
     * @param actual Result of an expression or value.
     */
    readonly assert: (actual: unknown, message?: string) => void;
} & Spread<TAssertions>;

interface ITestFunction<TAssertions extends object[], TScenarios> {
    (t: ExecutionContext<TAssertions>, scenario: TScenarios): Promise<void>|void;
}

export interface ITheory<TAssertions extends object[], TScenarios> {
    /**
     * Adds an optional description to the theory.
     * This will be included in certain reports and certain test exploration scenarios.
     * Additional calls will extend the existing description with a space joiner.
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
     * @todo TypeScript is merging the tuple types, hurting type safety. https://github.com/microsoft/TypeScript/issues/38603
     * @param scenario Data to pass to test function.
     * @param description Optional description for scenario.
     */
    scenario<TNewScenario>(scenario: TNewScenario, description?: string): ITheory<TAssertions, TNewScenario|TScenarios>;

    /**
     * Adds a test for the theory, and terminates the theory composition chain.
     * @param fn Test function that will determine if the theory holds.
     */
    test(fn: ITestFunction<TAssertions, TScenarios>): void;
}

export class Theory<TAssertions extends object[], TScenarios> implements ITheory<TAssertions, TScenarios> {
    /** @inheritdoc */
    describe(description: string): this {
        throw new Error("Method not implemented.");
    }

    /** @inheritdoc */
    skip(): this {
        throw new Error("Method not implemented.");
    }

    /** @inheritdoc */
    scenario<TNewScenario>(scenario: TNewScenario, description?: string): ITheory<TAssertions, TNewScenario|TScenarios>
    {
        throw new Error("Method not implemented.");
    }

    /** @inheritdoc */
    test(fn: ITestFunction<TAssertions, TScenarios>): void {
        throw new Error("Method not implemented.");
    }
}

/**
 * A theory spark bound to a configuration.
 */
export interface ITheorySpark<
    TAssertions extends object[],
> {
    /**
     * Theory factory, factory.
     */
    (): ITheory<TAssertions, never>;
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
