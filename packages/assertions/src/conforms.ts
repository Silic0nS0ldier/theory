import { report } from "./report.ts";

const objectType = Symbol("object");
const functionType = Symbol("function");

export const TypeNames = {
    OBJECT: objectType,
    FUNCTION: functionType,
} as const;

type ValueType =
    | typeof objectType
    | typeof functionType
;

type TypeObject = {
    type: typeof objectType,
    properties?: Properties,
};

type TypeFunction = {
    type: typeof functionType,
    properties?: Properties,
    // TODO Newable check, although hard to check for
};

type Properties = Record<string, Spec>;

/**
 * @todo Array
 * @todo Set
 * @todo Map
 * "Class definition" is a function, "class instance" is an object
 */
export type Spec =
    | TypeObject
    | TypeFunction
    | number
    | boolean
    | string
;

/**
 * Asserts that actual conforms to a spec.
 * Similar to `deepEqual` in purpose, but better equiped to deal with exotic structures.
 * @param actual
 * @param spec - A strict spec that the actual must conform to.
 */
export function conforms(actual: unknown, spec: Spec): boolean {
    return report({
        assertion: "conforms",
        passed: specConforms(actual, spec),
        actual,
        expected: spec,
    });
}

// Recursion is kept off the report so a single `conforms` call yields a single record.
function specConforms(actual: unknown, spec: Spec): boolean {
    if (typeof spec === "object") {
        switch (spec.type) {
            case objectType:
                return objectConforms(spec, actual);
            case functionType:
                return functionConforms(spec, actual);
            default:
                // TODO Report error
                return false;
        }
    }
    else {
        // TODO Provide context for error source
        return Object.is(actual, spec);
    }
}

/**
 * Asserts actual is an object that conforms to the spec.
 * @param spec
 * @param actual
 */
function objectConforms(spec: TypeObject, actual: unknown): boolean {
    // Ensure object
    if (typeof actual !== "object") {
        return false;
    }

    // Ensure value
    if (actual === null) {
        return false;
    }

    // Assert property conformance
    return propertiesConform(spec.properties ?? {}, actual);
}

/**
 * Asserts actual is a function that conforms to the spec.
 * @param spec
 * @param actual
 */
function functionConforms(spec: TypeFunction, actual: unknown): boolean {
    // Ensure function
    if (typeof actual !== "function") {
        return false
    }

    // Assert property conformance
    return propertiesConform(spec.properties ?? {}, actual);
}

/**
 * Creates a map from an object (or object like entity) containing its properties.
 * @param actual
 */
function getPropertyMap(actual: object): Map<string, unknown> {
    const keys = Object.keys(actual);
    const propertiesMap = new Map<string, unknown>();

    for (const key of keys) {
        propertiesMap.set(key, (actual as any)[key]);
    }

    return propertiesMap;
}

function propertiesConform(specProperties: Properties, actual: object): boolean {
    const propertyMap = getPropertyMap(actual);

    // Same number of keys
    if (Object.keys(specProperties).length !== propertyMap.size) {
        return false;
    }

    // Iterate over each and validate conformance
    for (const propertyName in specProperties) {
        if (Object.prototype.hasOwnProperty.call(specProperties, propertyName)) {
            if (!specConforms((actual as any)[propertyName], specProperties[propertyName] as Spec)) {
                return false;
            }
        }
    }

    return true;
}
