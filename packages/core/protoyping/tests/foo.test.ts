import { test } from "../theory-spark.js";

export const fooBar = test()
    .describe("Lorem impsum test description delor")
    .test(t => {
        
    });

export const fooBarFactory = test()
    .describe("Lorem impsum")
    .describe("test description delor")
    .scenario([ "a1", "b2" ], "delor ipsum scenario description")
    .scenario([ 1, 2 ])
    .test((t, [ a, b ]) => {
        t.assert(a === b);
    });

// "cleaner" export
// quicker test registration
// scope for some preparation
// entirely possible both patterns could be supported
// more natural scoping
// as we supply the inpui, still avoids registry "magic"
// however, it hurts test discovery where scenarios are concerned
export function barOfFoo(_) {
    _
    .describe("Lorem impsum")
    .describe("test description delor")
    .scenario([ "a1", "b2" ], "delor ipsum scenario description")
    .scenario([ 1, 2 ])
    .test((t, [ a, b ]) => {
        t.assert(a === b);
    });
}
