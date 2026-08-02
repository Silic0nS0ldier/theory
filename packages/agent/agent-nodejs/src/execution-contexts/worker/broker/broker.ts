// handles communication between agent (test process) and handler (management process)
import { extname } from "node:path";
import { Worker } from "node:worker_threads";
import { type AgentMessages, AgentMessageTypes } from "../agent/message-contracts.ts";

export function create() {
    // Matches this module's own extension so the agent resolves from source and from `dist` alike.
    const agentWorker = new Worker(
        new URL(`../agent/agent${extname(import.meta.filename)}`, import.meta.url),
    );

    agentWorker.on("message", createMessageHandler(
        () => {},
        () => {},
    ));

}

function createMessageHandler(
    ready: () => void,
    unsupported: (message: unknown) => void,
) {
    return function messageHandler(data: string): void {
        const message = JSON.parse(data) as AgentMessages;
        switch (message.type) {
            case AgentMessageTypes.READY:
                return ready();
            case AgentMessageTypes.ACK:
                return;
            default:
                return unsupported(message);
        }
    }
}
