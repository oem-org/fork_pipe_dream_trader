// Type created with help from a question i asked on stackoverflow.com
//https://stackoverflow.com/questions/79216606/type-error-in-generic-formdata-extraction

export type FormDataType<T extends object> = {
    [K in keyof T]: T[K] extends string ? T[K] : never;
};
