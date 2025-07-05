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
    port: 3000, // 建议使用 3000、5173 等常用前端开发端口
    open: true,
    host: '0.0.0.0',
    proxy: {
      // 代理配置保持不变，因为后端仍然在 8081 端口
      '/api': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})