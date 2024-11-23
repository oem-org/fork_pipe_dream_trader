export type FormDataType<T extends object> = {
    [K in keyof T]: T[K] extends string ? T[K] : never;
};
