import { Notify } from 'quasar'
import { onMounted, onUnmounted, ref } from 'vue'

export type ExchangeCode = 'Q' | 'F' | 'J' | 'K'
export type TradeSymbol = 'SPY' | 'QYLD'
// export type Message = {
//   type: 'trade' | 'quote'
//   symbol: TradeSymbol,
// }
export type TradeMessage = {
  type: 'trade'
  symbol: TradeSymbol
  exch: ExchangeCode
  price: string
  date: string
  cvol: string
  last: string
  size: string
}
export type QuoteMessage = {
  type: 'quote'
  ask: number
  askdate: string
  askexch: ExchangeCode
  asksz: number
  bid: number
  biddate: string
  bidexch: ExchangeCode
  bidsz: number
  symbol: TradeSymbol
}
export type ErrorMessage = {
  error: string
}
export type ConfigMessage = {
  symbols: TradeSymbol[]
  sessionid: string
  linebreak: boolean
}
export type Message = TradeMessage | ErrorMessage | ConfigMessage | QuoteMessage
export const isTradeMessage = (msg: Message): msg is TradeMessage => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (msg as any).type !== 'undefined' && (msg as any).type === 'trade'
}
export const isError = (msg: Message): msg is ErrorMessage => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (msg as any).error !== 'undefined'
}
export const isQuoteMessage = (msg: Message): msg is QuoteMessage => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (msg as any).type !== 'undefined' && (msg as any).type === 'quote'
}
export type PriceData = {
  price: number
  symbol: TradeSymbol
  date: string
}
export const QMtoPriceData = (msg: QuoteMessage): PriceData => ({
  price: (msg.ask + msg.bid) / 2,
  symbol: msg.symbol,
  date: msg.biddate,
})
export const TMtoPriceData = (msg: TradeMessage): PriceData => ({
  price: parseFloat(msg.price),
  symbol: msg.symbol,
  date: msg.date,
})
export function useWebSocket(url: string) {
  const socket = ref<WebSocket | null>(null)
  const messages = ref<Message[]>([])
  const isConnected = ref(false)
  const connect = (): void => {
    socket.value = new WebSocket(url)
    socket.value.onopen = () => {
      isConnected.value = true
      Notify.create('WebSocket Connected')
    }
    socket.value.onmessage = (event: MessageEvent) => {
      const message: Message = JSON.parse(event.data)
      console.debug({ message })
      if (isError(message)) throw new Error(message.error)
      messages.value.push(message)
    }
    socket.value.onclose = () => {
      isConnected.value = false
      Notify.create('WebSocket Disconnected')
    }
  }
  const disconnect = (): void => {
    if (socket.value) {
      socket.value.close()
    }
  }
  const sendMessage = (message: Message): void => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      console.debug({ message })
      socket.value.send(JSON.stringify(message))
    }
  }
  onMounted(() => {
    connect()
  })
  onUnmounted(() => {
    disconnect()
  })
  return {
    disconnect,
    isConnected,
    messages,
    sendMessage,
  }
}
