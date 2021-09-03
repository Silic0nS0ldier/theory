// Provides serialisation and deserialisation of messages sent
// between the host (API consumer), worker (responsible for
// coordinating resources off main thread) and the test target
// (e.g. worker, separate NodeJS instance, remote machine)

// Also defines message contracts

// todo symbol association syncing

type MessageId = string & { __MessageId: never };
type FilePath = string & { __FilePath: never };
type TestFnName = string & { __TestFnName: never };
type TestFn = {
    name: TestFnName,
};
type TestFile = {
    path: FilePath,
    tests: TestFn[],
};

const enum MessageType {
    PING = "ping",
    STATUS = "status",
};

/**
 * Utility for determining round-trip time (influences timeout grace period)
 * and as a simple low-overhead health check.
 */
type PingMessage = {
    id: MessageId,
    type: MessageType.PING,
};

/**
 * Utility for inspecting worker status.
 */
type StatusMessage = {
    id: MessageId,
    type: MessageType.STATUS,
};

type Message =
    PingMessage |
    StatusMessage;

export function decodeMessageEvent(e: MessageEvent<any>): Message {
    throw new Error("Not implemented")
}

const t = decodeMessageEvent("test" as any);
switch (t.type) {
    case MessageType.PING: {
        // ping message
    }
}
