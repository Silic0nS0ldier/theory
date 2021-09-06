// Simplified version of https://github.com/ppayauk/result-ts/blob/main/src/result/index.ts

type Ok<TOk> = [ok: true, result: TOk];
type Err<TErr> = [ok: false, error: TErr];
export type Result<TOk, TErr> = Ok<TOk> | Err<TErr>;

export function ok<TOk, TErr>(result: TOk): Result<TOk, TErr> {
    return [true, result];
}

export function err<TErr, TOk>(error: TErr): Result<TOk, TErr> {
    return [false, error];
}

export function isOk<TOk, TErr>(value: Result<TOk, TErr>): value is Ok<TOk> {
    return value[0];
}

export function isErr<TOk, TErr>(value: Result<TOk, TErr>): value is Err<TErr> {
    return !value[0];
}

export function unwrap<TErr>(value: Err<TErr>): TErr
export function unwrap<TOk>(value: Ok<TOk>): TOk
export function unwrap<TOk, TErr>(value: Result<TOk, TErr>): TOk | TErr {
    return value[1];
}
