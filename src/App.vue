<template>
  <div id="app">
    <Loading :loading="appStore.isLoading" />
    <router-view />
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import Loading from '@/components/ui/Loading.vue'

const appStore = useAppStore()
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style> 