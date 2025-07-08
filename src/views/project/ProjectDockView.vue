<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
      </div>
      <div class="flex flex-col items-center justify-center">
        <!-- 标题区美化 -->
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight text-center">项目对接</h1>
        <div class="w-24 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 rounded-full mb-2"></div>
        <div class="text-lg text-gray-500 mb-12 text-center">一站式校企项目对接与管理</div>
        <!-- 菜单卡片区 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 w-full max-w-3xl">
          <div
            v-for="item in menuList"
            :key="item.key"
            class="group cursor-pointer bg-white bg-opacity-80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center border border-transparent hover:border-blue-400 hover:-translate-y-1 hover:scale-105"
            @click="goToPage(item.key)"
          >
            <div class="text-4xl mb-4 transition-transform duration-300 group-hover:scale-125">
              {{ item.icon }}
            </div>
            <div class="text-2xl font-bold text-blue-700 mb-2">{{ item.label }}</div>
            <div class="text-gray-500 text-base text-center">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const menuList = [
  { key: 'search', label: '项目搜索与对接', icon: '🔍', desc: '查找并对接优质项目' },
  { key: 'publish', label: '发布新项目', icon: '🚀', desc: '快速发布你的创新项目' },
  { key: 'my', label: '我的项目管理', icon: '📋', desc: '管理和跟进你的所有项目' },
  { key: 'apply', label: '我的项目申请', icon: '📝', desc: '查看和管理你的申请记录' }
]

function goToPage(key: string) {
  if (key === 'search') {
    router.push('/project/search')
  } else if (key === 'publish') {
    router.push('/project/publish')
  } else if (key === 'my') {
    router.push('/project/my')
  } else if (key === 'apply') {
    router.push('/my-project-applications')
  }
}
</script> 