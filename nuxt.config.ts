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
  modules: ['@nuxt/ui-pro', '@nuxt/icon', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/',
      include: undefined,
      exclude: undefined
    }
  },
  runtimeConfig: {
    public: {
      ajkApiBase: 'https://vip.anjuke.com',
      TRPC_SERVER_URL: process.env.TRPC_SERVER_URL,
      UPGRADE_ACCESS_KEY: process.env.UPGRADE_ACCESS_KEY

    }
  }
})