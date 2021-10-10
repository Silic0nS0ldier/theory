# Hijack - Redirection for Effectful Builtin APIs

Stage: Ideation

Sometimes you need to test code which uses builtin APIs which have side effects, which may compromise test reliability. This project aims to provide primatives with which effectful builtin APIs can be isolated within a given test scope.

This is intended as a last resort for external libraries which directly use these effectful APIs, indirect usage via abstractions (e.g. passing along services) that can be efficienty mocked is recommended where possible.
