import { defineStore } from 'pinia'
import type { Nullable } from 'src/utils/type-utils'

export interface TokenStoreState {
  account: Nullable<string>
  token: Nullable<string>
}

export const useTokenStore = defineStore('token', {
  state: () => ({
    account: null,
    token: null,
  }),
  persist: true,
})
