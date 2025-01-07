<template>
  <q-card>
    <q-card-section>
      <q-item>
        <q-item-section>
          <q-icon name="fas fa-terminal" />
        </q-item-section>
        <q-item-section>
          <div class="text-h5">Platform</div>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section>
      <q-form class="q-gutter-md" autofocus>
        <q-input v-model="account" filled label="account">
          <template #prepend>
            <q-icon name="user" />
          </template>
        </q-input>
        <q-input v-model="token" filled label="API token" type="password">
          <template #prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>
    <q-btn @click="saveToken">SAVE</q-btn>
  </q-card>
</template>
<script setup lang="ts">
import { Notify } from 'quasar'
import { useTokenStore } from 'src/stores/token-store'
import { apiFetch } from 'src/utils/fetch-utils'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const account = ref()
const token = ref()

const router = useRouter()

const saveToken = async () => {
  const ts = useTokenStore()
  ts.token = token.value
  ts.account = account.value
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
    router.push('Home')
  } else Notify.create('Token Issue')
}
</script>
