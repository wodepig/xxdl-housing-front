// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
  },
  compatibilityDate: '2024-11-01',
  // srcDir: 'app',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui-pro',
    '@nuxt/icon',
    'nuxt-auth-utils'
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  runtimeConfig: {
    session:{
      password: process.env.NUXT_SESSION_PASSWORD || '',
      cookie:{
        sameSite: 'none',
        secure: true
      }
    },
    public: {
      ajkApiBase: 'https://vip.anjuke.com',
      TRPC_SERVER_URL: process.env.TRPC_SERVER_URL,
      UPGRADE_ACCESS_KEY: process.env.UPGRADE_ACCESS_KEY

    }
  }
})