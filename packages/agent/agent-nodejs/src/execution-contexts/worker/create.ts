import { create } from "./broker/broker.ts";

export function createWorkerExecutionContext() {
    return create();
}
