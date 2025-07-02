<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
      <h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">发布新项目</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">项目名称</label>
          <input v-model="title" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">项目类型</label>
          <select v-model="type" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="科研">科研</option>
            <option value="人才培养">人才培养</option>
            <option value="创新">创新</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">项目简介</label>
          <textarea v-model="desc" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">联系人</label>
          <input v-model="contact" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" class="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">提交发布</button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const title = ref('')
const type = ref('科研')
const desc = ref('')
const contact = ref('')
const router = useRouter()
function onSubmit() {
  // 这里可接入API
  alert('项目发布成功，等待审核/对接！')
  router.push('/project/list')
}
</script> 