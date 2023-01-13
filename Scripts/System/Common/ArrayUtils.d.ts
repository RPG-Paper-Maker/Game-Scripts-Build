declare class ArrayUtils {
    constructor();
    static removeAt(array: any[], index: number): void;
    static removeElement<T>(array: T[], value: T): void;
}
export { ArrayUtils };
