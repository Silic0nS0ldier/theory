export const AgentMessageTypes = {
    /** Agent ready */
    READY: "ready",
    /** Acknowledge message handled */
    ACK: "ack",
} as const;

type AgentReadyMessage = {
    readonly type: typeof AgentMessageTypes.READY,
};

type AgentAckMessage = {
    readonly type: typeof AgentMessageTypes.ACK,
};

export type AgentMessages =
    | AgentReadyMessage
    | AgentAckMessage;
