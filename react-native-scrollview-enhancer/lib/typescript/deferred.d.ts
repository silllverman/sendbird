interface Deferred<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
export declare const deferred: <T>() => Deferred<T>;
export {};
//# sourceMappingURL=deferred.d.ts.map