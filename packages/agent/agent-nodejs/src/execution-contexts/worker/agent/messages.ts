import { AgentMessages, AgentMessageTypes } from "./message-contracts.js";

function sendToBroker(message: AgentMessages) {
    self.postMessage(JSON.stringify(message));
}

export function sendAgentReady() {
    sendToBroker({
        type: AgentMessageTypes.READY,
    });
}