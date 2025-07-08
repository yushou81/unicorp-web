<template>
   <Navbar />
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
   
    <div class="container mx-auto px-4">
     
      <!-- Tab栏 -->
      <div class="flex space-x-4 border-b mb-6 justify-center">
        <router-link
          v-for="tab in tabs"
          :key="tab.key"
          :to="tab.to"
          class="px-4 py-2 -mb-px border-b-2 font-semibold transition-all"
          :class="{
            'border-blue-600 text-blue-700 bg-white': isActive(tab.to),
            'border-transparent text-gray-500 hover:text-blue-600': !isActive(tab.to)
          }"
        >
          {{ tab.label }}
        </router-link>
      </div>
      <!-- 子页面内容区域优化 -->
      <div class="mt-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'

const tabs = [
  { key: 'search', label: '项目搜索与对接', to: '/project/dock/search' },
  { key: 'publish', label: '发布新项目', to: '/project/dock/publish' },
  { key: 'my', label: '我的项目管理', to: '/project/dock/my' },
  { key: 'apply', label: '我的项目申请', to: '/project/dock/apply' }
]

const route = useRoute()
function isActive(path: string) {
  return route.path === path
}
</script> 