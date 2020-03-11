import { theory } from "./theory";

export const t1 = theory()
.scenario(["a"])
.scenario([])
.scenario([1])
.test((t, scenario) => {

});

export const t2 = theory()
.scenario(["a"])
.scenario([1])
.scenario([])
.test((t, scenario) => {

});


export const t3 = theory()
.test(t => {

});

export const t4 = theory()
.scenario({ foo: "bar" })
.test((t, scenario) => {
    
});


// Configuration file provides a plugin system, and by extension the test() instance
// This allows plugins to offer type information to compostion API

// Will need to think about function `this` value.
// Difficult/impossible to completely isolate tests.
// Yet another reason for the randomisation logic plan, and complete runtime isolation runs.

// All this should be 100% compatible with Deno.