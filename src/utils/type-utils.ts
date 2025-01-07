export type Nullable<T> = T | null
export type Hopefully<T> = Promise<Nullable<T>>
export type Override<T, U> = Omit<T, keyof U> & U
