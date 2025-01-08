<template>
  <q-btn @click="test">test api</q-btn>
  <h1>Connection: {{ isConnected ? 'YES' : 'NO' }}</h1>
  <q-btn @click="createStream">stream session</q-btn>
  <q-btn @click="disconnect">disconnect</q-btn>
  <q-list>
    <q-item v-for="(msg, index) in tradeMessages" :key="index">
      <q-item-section side>
        <q-icon name="fas fa-wine-bottle" />
      </q-item-section>
      <q-item-label>{{ msg.symbol }}</q-item-label>
      <q-item-section>{{ msg.price }}</q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import { Notify } from 'quasar'
import { useTokenStore } from 'src/stores/token-store'
import {
  isQuoteMessage,
  isTradeMessage,
  QMtoPriceData,
  TMtoPriceData,
  useWebSocket,
} from 'src/useWebSocket'
import { apiFetch } from 'src/utils/fetch-utils'
import { computed, ref } from 'vue'

const ts = useTokenStore()
const test = async () => {
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
const { disconnect, isConnected, messages, sendMessage } = useWebSocket(
  'wss://ws.tradier.com/v1/markets/events',
)

const tradeMessages = computed(() =>
  messages.value
    .map((x) => {
      if (isTradeMessage(x)) return TMtoPriceData(x)
      if (isQuoteMessage(x)) return QMtoPriceData(x)
      else return null
    })
    .filter((x) => x !== null),
)

type TradierStreamSession = {
  url: string
  sessionid: string
}

const sessionStream = ref<TradierStreamSession>()

const createStream = async () => {
  const session = await apiFetch(`https://api.tradier.com/v1/markets/events/session`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ts.token}`,
      Accept: 'application/json',
    },
  })
  const parsed = await session.json()
  console.assert(typeof parsed.stream !== 'undefined', 'stream object is not present in response.')
  sessionStream.value = parsed.stream as TradierStreamSession
  console.debug({ sessionStream: sessionStream.value })
  console.assert(typeof sessionStream.value.sessionid !== 'undefined', 'session id is undefined.')
  console.debug({ sessionId: sessionStream.value.sessionid })
  sendMessage({
    symbols: ['SPY'],
    sessionid: sessionStream.value!.sessionid,
    linebreak: true,
  })
}
</script>
