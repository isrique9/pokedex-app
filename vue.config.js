// vite.config.js (Vue 3)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/pokedex-app/', // <--- MUITO IMPORTANTE: use o nome do seu repo aqui
})