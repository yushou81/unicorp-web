<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">项目合作列表</h2>
        <router-link to="/project/publish">
          <button class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">发布新项目</button>
        </router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.id" class="bg-white rounded-xl shadow p-6 flex flex-col">
          <h3 class="font-semibold text-lg mb-2">{{ project.title }}</h3>
          <div class="text-gray-500 text-sm mb-2">{{ project.type }} · {{ project.status }}</div>
          <p class="text-gray-700 flex-1 mb-4">{{ project.desc }}</p>
          <div class="flex justify-between items-center">
            <router-link :to="`/project/${project.id}`" class="text-blue-600 hover:underline">详情/对接</router-link>
            <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700" v-if="project.recommended">推荐</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const projects = [
  { id: 1, title: '智能制造产学研合作', type: '科研', status: '对接中', desc: '联合推进智能制造领域的产学研深度合作。', recommended: true },
  { id: 2, title: '大数据人才联合培养', type: '人才培养', status: '已立项', desc: '校企共建大数据人才培养基地。', recommended: false },
  { id: 3, title: 'AI创新实验室共建', type: '创新', status: '结项', desc: '共建AI创新实验室，推动科研成果转化。', recommended: false }
]
</script> 