import { unitTheory } from "../theory";

export const t1 = unitTheory()
.scenarios({
    s1: ["a"],
    s2: [],
    s3: [1],
})
.test((t, scenario) => {

});

export const t2 = unitTheory()
.scenario(["a"])
.scenario([1])
.scenario([])
.test((t, scenario) => {

});


export const t3 = unitTheory()
.test((t, scenario) => {
    
});

export const t4 = unitTheory()
.test(t => {

});

export const t5 = unitTheory()
.scenario({ foo: "bar" })
.test((t, scenario) => {
    
});
