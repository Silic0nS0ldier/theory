type OptionalPropertyNames<T> =
    { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
    { [P in K]: L[P] | Exclude<R[P], undefined> };

// NOTE Number keys are deliberatly discarded (assert1 would be stupid)
type Id<T> = T extends infer U
    ? { readonly [K in keyof U as `assert${Capitalize<string & K>}`]: U[K] }
    : never;

type SpreadTwo<TFirstObject, TSecondObject> = Id<
    & Pick<TFirstObject, Exclude<keyof TFirstObject, keyof TSecondObject>>
    & Pick<TSecondObject, Exclude<keyof TSecondObject, OptionalPropertyNames<TSecondObject>>>
    & Pick<TSecondObject, Exclude<OptionalPropertyNames<TSecondObject>, keyof TFirstObject>>
    & SpreadProperties<TFirstObject, TSecondObject, OptionalPropertyNames<TSecondObject> & keyof TFirstObject>
>;

export type Spread<TObjects extends readonly [...any]> = TObjects extends [infer TFirstObject, ...infer TRemainingObjects] ?
    SpreadTwo<TFirstObject, Spread<TRemainingObjects>> : unknown