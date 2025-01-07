export type Nullable<T> = T | null
export type Hopefully<T> = Promise<Nullable<T>>
