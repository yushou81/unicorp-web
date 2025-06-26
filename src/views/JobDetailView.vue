<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="bg-white rounded-xl shadow p-8">
        <div class="flex items-center mb-6">
          <div class="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 010 7.75" /></svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ job.title }}</h1>
            <div class="text-gray-500 text-sm">{{ job.company }} · {{ job.location }}</div>
          </div>
        </div>
        <div class="flex items-center space-x-4 mb-6">
          <span class="text-lg text-blue-600 font-semibold">{{ job.salary }}</span>
          <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs">{{ job.type }}</span>
        </div>
        <div class="mb-6">
          <h2 class="font-semibold text-lg mb-2 text-gray-900">职位描述</h2>
          <p class="text-gray-700 whitespace-pre-line">{{ job.description }}</p>
        </div>
        <div class="flex space-x-4">
          <button class="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">投递简历</button>
          <button class="px-6 py-2 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">收藏职位</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const jobId = route.params.id

// 假数据，后续可用API获取
const job = {
  id: jobId,
  title: '前端开发工程师',
  company: '某某科技有限公司',
  location: '北京',
  salary: '15k-25k',
  type: '全职',
  description: `1. 负责公司产品的前端开发工作，参与需求分析与UI实现；\n2. 熟悉Vue/React等主流前端框架，能独立完成模块开发；\n3. 具备良好的沟通能力和团队协作精神。`
}
</script> 