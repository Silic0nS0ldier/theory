import { ITheorySpark, Theory } from "./theory";

interface IConfig {
    agents: [];
}

export function makeTheorySpark<
    TAssertions extends object[]
>(config: {
    agents: unknown[],
    assertions: TAssertions,
}): ITheorySpark<TAssertions> {
    const spark: Partial<ITheorySpark<TAssertions>> = function () {
        return new Theory<TAssertions, undefined>();
    }

    return spark as ITheorySpark<TAssertions>;
}
