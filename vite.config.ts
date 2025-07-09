import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 移除 nodePolyfills 导入
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], // 移除 nodePolyfills 插件
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // 移除 crypto 别名，因为它可能依赖于 nodePolyfills
    },
  },
  server: {
    port: 8082,
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http:192.168.58.96:8081',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  define: {
    // 为浏览器提供global对象
    global: 'window',
  },
}) 