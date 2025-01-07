<template>
  <h1>lol hi</h1>
  <h1>{{ answer }}</h1>
  <q-btn @click="test">test api</q-btn>
</template>
<script setup lang="ts">
import { Notify } from 'quasar'
import { useTokenStore } from 'src/stores/token-store'
import { apiFetch } from 'src/utils/fetch-utils'

const answer = 2 + 2
const test = async () => {
  const ts = useTokenStore()
  // TODO: make a fetch to get account balance as a test to see if token is correct
  const acct = await apiFetch(`https://api.tradier.com/v1/accounts/${ts.account}/balances`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ts.token}`,
      Accept: 'application/json',
    },
  })
  if (acct !== null) {
    console.debug({ acct })
  } else Notify.create('Token Issue')
}
</script>
