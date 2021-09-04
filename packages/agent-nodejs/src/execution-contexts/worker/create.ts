import { create } from "./broker/broker.js";

export function createWorkerExecutionContext() {
    return create();
}