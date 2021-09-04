// handles communication between agent (test process) and handler (management process)
import Worker from "web-worker";
import { AgentMessages, AgentMessageTypes } from "../agent/message-contracts.js"

export function create() {
    const agentWorker = new Worker(
        new URL('../agent/agent.js', import.meta.url),
        { type: "module" },
    );

    agentWorker.addEventListener("message", createMessageHandler(
        () => {},
        () => {},
    ));

}

function createMessageHandler(
    ready: () => void,
    unsupported: (message: unknown) => void,
) {
    return function messageHandler(ev: MessageEvent): void {
        const message = JSON.parse(ev.data) as AgentMessages;
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