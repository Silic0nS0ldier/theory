// runs in worker
/// <reference lib="webworker" />

import { sendAgentReady } from "./messages.js";

sendAgentReady();
