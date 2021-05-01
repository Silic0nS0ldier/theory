import { AssertionError } from "./assertion-error.js";
import { is } from "./is.js";

export const enum TypeNames {
    OBJECT = "object",
    FUNCTION = "function",
};

type TypeObject = {
    type: TypeNames.OBJECT,
    properties?: Properties,
};

type TypeFunction = {
    type: TypeNames.FUNCTION,
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
export type Spec = TypeObject
    |TypeFunction
    |number
    |boolean
    |string;

/**
 * Asserts that actual conforms to a spec.
 * Similar to `deepEqual` in purpose, but better equiped to deal with exotic structures.
 * @param spec - A strict spec that the actual must conform to.
 * @param actual 
 */
export function conforms(spec: Spec, actual: unknown) {
    if (typeof spec === "object") {
        switch (spec.type) {
            case TypeNames.OBJECT:
                return objectConforms(spec, actual);
            case TypeNames.FUNCTION:
                return functionConforms(spec, actual);
            default:
                throw new Error();
        }
    }
    else {
        // TODO Provide context for error source
        is(spec, actual);
    }
}

/**
 * Asserts actual is an object that conforms to the spec.
 * @param spec 
 * @param actual 
 */
function objectConforms(spec: TypeObject, actual: unknown) {
    // Ensure object
    if (typeof actual !== "object") {
        throw new AssertionError();
    }
    
    // Ensure value
    if (actual === null) {
        throw new AssertionError();
    }

    // Assert property conformance
    propertiesConform(spec.properties ?? {}, actual);
}

/**
 * Asserts actual is a function that conforms to the spec.
 * @param spec 
 * @param actual 
 */
function functionConforms(spec: TypeFunction, actual: unknown) {
    // Ensure function
    if (typeof actual !== "function") {
        throw new AssertionError();
    }

    // Assert property conformance
    propertiesConform(spec.properties ?? {}, actual);
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

function propertiesConform(specProperties: Properties, actual: object) {
    const propertyMap = getPropertyMap(actual);

    // Same number of keys
    is(Object.keys(specProperties).length, propertyMap.size);

    // Iterate over each and validate conformance
    for (const propertyName in specProperties) {
        if (Object.prototype.hasOwnProperty.call(specProperties, propertyName)) {
            conforms(specProperties[propertyName], (actual as any)[propertyName]);
        }
    }
}
