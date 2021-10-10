# Mutate - Mutation Testing

Stage: Ideation

Metrics like code coverage encourage testing more of your source, but what if those tests aren't meaningful? That is, if a behaviour change is introduced are will that be detected by tests?

This is where mutation testing comes in. Mutation testing involves small automated changes being made to source, and tests run to see if that mutant triggers a test failure. If it doesn't, then odds are the test is weak or the modified area needs to be further inspected (it may be dead code, redundant, etc).

Inspired by [Stryker Mutator](https://stryker-mutator.io/), potentially will be powered by as well.
