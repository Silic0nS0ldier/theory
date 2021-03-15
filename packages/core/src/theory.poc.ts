import { assertEqual } from "@theory/assertions";
import { describe, decorate } from "@theory/core/decorators";
import { scenario } from "@theory/scenarios";

@describe("Because you just can't trust JS...")
@describe("Decorator-based composition.")
@describe("Theory factory.")
@scenario(1, 2, 3)
@scenario("a", 9, "a9")
export function addition([ a, b, r ]: [ any, any, any ]) {
    assertEqual(a + b, r);
}

export const subtraction = decorate(
    describe("Because you jsut can't trust JS..."),
    describe("Chain-based composition."),
    describe("Theory factory."),
    scenario(1, 2, -1),
    scenario("a", 9, NaN),
).impl(([ a, b, r ]: [ any, any, any ]) => {
    assertEqual(a - b, r);
});

@describe("Because you just can't trust JS...")
@describe("Decorator-based composition.")
@describe("Single theory.")
export function multiplication() {
    assertEqual(1 * 2, 2);
    // @ts-ignore
    assertEqual("a" * 2, NaN);
}

export const division = decorate(
    describe("Because you jsut can't trust JS..."),
    describe("Chain-based composition."),
    describe("Theory factory."),
).impl(() => {
    assertEqual(1 / 2, 0.5);
    // @ts-ignore
    assertEqual("a" / 2, NaN);
});

