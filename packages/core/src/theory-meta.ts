// Assertions are imported
export interface ITheoryContext {
    // logger
}

type TheoryyMeta = Map<unknown, unknown>;

function getOrCreateMeta(impl: ITheoryImpl): TheoryyMeta {
    if (!impl.theoryMeta) {
        impl.theoryMeta = new Map();
    }

    return impl.theoryMeta;
}

interface ITheoryImpl {
    (t: ITheoryContext): void;
    theoryMeta?: TheoryyMeta;
}

interface FunctionDecoratorContext {
    kind: "function";
}

interface FunctionDecorator<T> {
    (target: T, context: FunctionDecoratorContext): T | void;
}

/**
 * Function decorators ponyfill tailored for manual usage.
 * Adheres to spec proposed in [github.com/tc39/proposal-decorators/EXTENSIONS.md](https://github.com/tc39/proposal-decorators/commit/5d755cf295c203ecbb7c5172da3cb737a96efa1d#function-decorators-and-annotations)
 * @param decorators Decorators to apply.
 */
export function decorate(
    ...decorators: FunctionDecorator<ITheoryImpl>[]
): { impl: (impl: ITheoryImpl) => ITheoryImpl } {

    function decorateImpl(impl: ITheoryImpl): ITheoryImpl {
        for (const decorator of decorators) {
            const res = decorator(impl, { kind: "function" });
            if (res) {
                // TODO warn if theory meta set
                impl = res;
            }
        }

        return impl;
    }

    return { impl: decorateImpl };
}

// describe decorator
export function describe(desc: string): FunctionDecorator<ITheoryImpl> {
    return target => {
        const meta = getOrCreateMeta(target);
        let description = meta.get("description");
        if (Array.isArray(description)) {
            description.push(desc);
        } else {
            description = [desc];
        }
        meta.set("description", description);
    };
}

// skip decorator
export const skip: FunctionDecorator<ITheoryImpl> = (target) => {
    const meta = getOrCreateMeta(target);
    meta.set("skip", true);
}
