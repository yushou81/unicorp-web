<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4 max-w-3xl">
      <div class="bg-white rounded-xl shadow p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ project.title }}</h2>
        <div class="text-gray-500 text-sm mb-4">{{ project.type }} · {{ project.status }}</div>
        <p class="text-gray-700 mb-6">{{ project.desc }}</p>
        <div class="mb-6">
          <h3 class="font-semibold text-lg mb-2">项目进度</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li v-for="step in project.progress" :key="step.name">
              <span :class="step.done ? 'text-green-600' : 'text-gray-400'">●</span>
              {{ step.name }} <span v-if="step.date" class="ml-2 text-xs text-gray-400">({{ step.date }})</span>
            </li>
          </ul>
        </div>
        <div class="mb-6">
          <h3 class="font-semibold text-lg mb-2">合同与结项</h3>
          <div v-if="project.contract">
            <span class="text-green-600">已签订合同</span> | 合同编号：{{ project.contract }}
          </div>
          <div v-else>
            <span class="text-yellow-600">合同待签订</span>
          </div>
          <div v-if="project.closed" class="mt-2 text-green-700">项目已结项</div>
        </div>
        <div class="flex space-x-4">
          <router-link :to="`/project/${project.id}/fund`">
            <button class="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">经费管理</button>
          </router-link>
          <button class="px-6 py-2 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">进度更新</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const project = {
  id: route.params.id,
  title: '智能制造产学研合作',
  type: '科研',
  status: '对接中',
  desc: '联合推进智能制造领域的产学研深度合作。',
  progress: [
    { name: '立项申请', done: true, date: '2024-05-01' },
    { name: '合同签订', done: false },
    { name: '项目执行', done: false },
    { name: '结项', done: false }
  ],
  contract: null,
  closed: false
}
</script> 