type Directory = Map<string, Directory|File>;

export function createStore() {
    // top level is / (but what about Windows?)
    const store: Directory = new Map();
}
