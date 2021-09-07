import test from "ava";
import { isOk } from "@theory/util-result";
import { bindTestContext, getTestContext } from "./test.js";

test("Context can be accessed within registered function", t => {
    function contextAccessor(valid: boolean) {
        const testContext = getTestContext();
        t.is(isOk(testContext), valid);
    }

    // Should be able to access
    const boundContextAccessor = bindTestContext(() => contextAccessor(true));
    boundContextAccessor();

    // Should not be able to access
    contextAccessor(false);
})
