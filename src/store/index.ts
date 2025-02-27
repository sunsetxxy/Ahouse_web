// src/stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    setToken(newToken: string) {
      this.token = newToken
      localStorage.setItem('token', newToken)
    }
  }
})

export const useCounterStore = defineStore("counter", {
    state: () => ({
        count: 0,
    }),
    actions: {
        increment() {
            this.count++;
        },
    },
});
