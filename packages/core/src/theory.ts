interface ITestFunction<TScenarios> {
    (t: any, scenario: TScenarios): Promise<void>|void;
}

interface ITheory<TScenarios extends any> {
    describe(description: string): this;
    skip(): this;
    scenario<TNewScenario>(scenario: TNewScenario) : ITheory<TNewScenario|TScenarios>;
    scenario<TNewScenario>(scenario: TNewScenario) : ITheory<TNewScenario>;
    test(fn: ITestFunction<TScenarios>): void;
}

class Theory<TScenarios extends any = void> implements ITheory<TScenarios> {
    describe(description: string): this {
        throw new Error("Method not implemented.");
    }
    skip(): this {
        throw new Error("Method not implemented.");
    }
    scenario<TNewScenario extends any>(scenario: TNewScenario)
    : TScenarios extends void
        ? ITheory<TNewScenario>
        : ITheory<TNewScenario|TScenarios>
    {
        throw new Error("Method not implemented.");
    }
    test(fn: ITestFunction<TScenarios>): void {
        throw new Error("Method not implemented.");
    }
}

export function theory() {
    return new Theory();
}
