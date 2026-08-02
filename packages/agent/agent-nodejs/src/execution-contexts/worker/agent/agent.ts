// runs in worker
import { setAsyncVariableImplementation } from "@theory/core";
import { AsyncLocalStorageVariable } from "../../../async-context.ts";
import { sendAgentReady } from "./messages.ts";

setAsyncVariableImplementation(AsyncLocalStorageVariable);

sendAgentReady();
