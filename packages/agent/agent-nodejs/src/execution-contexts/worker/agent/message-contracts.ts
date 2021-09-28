export const enum AgentMessageTypes {
    /** Agent ready */
    READY = "ready",
    /** Acknowledge message handled */
    ACK = "ack",
};

type AgentReadyMessage = {
    readonly type: AgentMessageTypes.READY,
};

type AgentAckMessage = {
    readonly type: AgentMessageTypes.ACK,
};

export type AgentMessages =
    | AgentReadyMessage
    | AgentAckMessage;
