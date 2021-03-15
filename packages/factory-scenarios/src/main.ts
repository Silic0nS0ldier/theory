// scenario decorator
// params should be guided by function param types
export function scenario(...args: unknown[]): FunctionDecorator<ITheoryImpl> {

    return () => {};
}