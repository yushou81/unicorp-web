import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      crypto: 'crypto-browserify',
    },
  },
  server: {
    port: 8081,
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http:// 192.168.1.2:8081',
        changeOrigin: true,
        ws: true,
      },
    },
  },
}) 