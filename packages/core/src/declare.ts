/**
 * Brand marking a value as a test declaration. Discovery relies on it to tell tests apart from
 * other module exports.
 */
export const testBrand = Symbol("@theory/core/test");

export type TestBody = () => Promise<void>|void;

export type TestMeta = {
    /** Human readable label. Identity remains the module path plus export name. */
    readonly title: string|undefined,
    readonly tags: readonly string[],
    readonly skip: boolean,
    readonly only: boolean,
    readonly timeoutMs: number|undefined,
};

export type Test = {
    readonly [testBrand]: true,
    readonly body: TestBody,
    readonly meta: TestMeta,
};

/** Anything a declaration or modifier accepts. Lets modifiers compose in any order. */
export type TestLike = Test|TestBody;

/**
 * Declares a test. Export the result to register it. Applying it to an existing declaration is a
 * no-op, so it may appear anywhere in a chain of modifiers.
 */
export function test(subject: TestLike): Test {
    if (isTest(subject)) {
        return subject;
    }

    return {
        [testBrand]: true,
        body: subject,
        meta: {
            title: undefined,
            tags: [],
            skip: false,
            only: false,
            timeoutMs: undefined,
        },
    };
}

/**
 * Narrows an arbitrary module export to a test declaration.
 */
export function isTest(value: unknown): value is Test {
    return typeof value === "object"
        && value !== null
        && testBrand in value;
}

function withMeta(subject: TestLike, meta: Partial<TestMeta>): Test {
    const declared = test(subject);

    return {
        [testBrand]: true,
        body: declared.body,
        meta: { ...declared.meta, ...meta },
    };
}

/**
 * Marks a test as skipped. Shaped for a future migration to function decorators.
 */
export function skip(subject: TestLike): Test {
    return withMeta(subject, { skip: true });
}

/**
 * Restricts execution to tests marked `only`. Shaped for a future migration to function decorators.
 */
export function only(subject: TestLike): Test {
    return withMeta(subject, { only: true });
}

/**
 * Attaches a human readable label to a test.
 */
export function title(value: string): (subject: TestLike) => Test {
    return subject => withMeta(subject, { title: value });
}

/**
 * Attaches tags to a test, allowing exports to be filtered.
 */
export function tag(...values: readonly string[]): (subject: TestLike) => Test {
    return subject => {
        const declared = test(subject);

        return withMeta(declared, { tags: [ ...declared.meta.tags, ...values ] });
    };
}

/**
 * Overrides the runner supplied time budget for a test.
 */
export function timeout(ms: number): (subject: TestLike) => Test {
    return subject => withMeta(subject, { timeoutMs: ms });
}
