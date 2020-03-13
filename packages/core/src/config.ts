import { ITheorySpark, Theory } from "./theory";

interface IConfig {
    agents: [];
}

export function makeTheorySpark(config: IConfig): ITheorySpark {
    return function () {
        return new Theory<undefined>();
    }
}
