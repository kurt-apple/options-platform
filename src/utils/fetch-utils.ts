import type { Hopefully, Nullable } from './type-utils'

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type CoolerRequestInit = {
  method?: RequestMethod
  keepalive?: boolean
  headers?: HeadersInit
  body?: Nullable<BodyInit>
  redirect?: RequestRedirect
  integrity?: string
  signal?: Nullable<AbortSignal>
  credentials?: RequestCredentials
  mode?: RequestMode
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  window?: null
}
export const apiFetch = (url: string, config: CoolerRequestInit) => {
  return fetch(url, config)
}
export const apiGet = <T>(url: string): Promise<T> => {
  return apiFetch(url, { method: 'GET' }) as Promise<T>
}
export const apiPost = <T>(url: string): Promise<T> => {
  return apiFetch(url, { method: 'POST' }) as Promise<T>
}

const _fetch = async <T>(url: string, method: RequestMethod = 'GET', payload?: T) => {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response
}
export const typedFetch = async <T, R = never>(
  url: string,
  method: RequestMethod = 'GET',
  payload?: R,
): Hopefully<T> => {
  let response = null
  try {
    response = await _fetch(url, method, payload)
  } catch (error: unknown) {
    console.error(error)
    return null
  }
  if (response === null) return null
  const json = await response.json()
  if (!Array.isArray(json)) return json as T
  else throw new Error(`Expected Singular Object, Received Array`)
}
// TODO: make this DRY and beautiful
