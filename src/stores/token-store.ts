import { defineStore } from 'pinia'
import type { Nullable } from 'src/utils/type-utils'

export interface TokenStoreState {
  token: Nullable<string>
}

export const useTokenStore = defineStore('token', {
  state: () => ({
    token: null,
  }),
  persist: true,
})
