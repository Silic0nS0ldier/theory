import { parentPort } from "node:worker_threads";
import { type AgentMessages, AgentMessageTypes } from "./message-contracts.ts";

function sendToBroker(message: AgentMessages) {
    if (!parentPort) {
        throw new Error("Agent messages can only be sent from within a worker thread.");
    }

    parentPort.postMessage(JSON.stringify(message));
}

export function sendAgentReady() {
    sendToBroker({
        type: AgentMessageTypes.READY,
    });
}
