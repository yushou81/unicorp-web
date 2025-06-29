<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div class="container mx-auto px-4 max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <div class="mb-6">
          <button @click="goBack" class="text-blue-600 hover:underline flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">项目申请表</h2>
        <form @submit.prevent="submitApplication" class="space-y-6">
          <div>
            <label class="block font-medium mb-1">自我介绍 <span class="text-red-500">*</span></label>
            <textarea v-model="form.intro" required class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div>
            <label class="block font-medium mb-1">申请理由 <span class="text-red-500">*</span></label>
            <textarea v-model="form.reason" required class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div>
            <label class="block font-medium mb-1">专业技能/特长 <span class="text-red-500">*</span></label>
            <input v-model="form.skills" required placeholder="如：Java, Python, 团队协作" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1">每周可投入时间 <span class="text-red-500">*</span></label>
            <input v-model="form.time" required placeholder="如：10小时" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1">联系方式 <span class="text-red-500">*</span></label>
            <input v-model="form.contact" required placeholder="邮箱或手机号" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1">其他补充说明</label>
            <textarea v-model="form.extra" class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <button type="submit" class="w-full py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition">提交申请</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { applyForProject } from '@/lib/api/project'
  
  const router = useRouter()
  const route = useRoute()
  const projectId = Number(route.params.id)
  
  const form = ref({
    intro: '',
    reason: '',
    skills: '',
    time: '',
    contact: '',
    extra: ''
  })
  
  function goBack() {
    router.back()
  }
  
  async function submitApplication() {
    try {
      await applyForProject(projectId, {
        intro: form.value.intro,
        reason: form.value.reason,
        skills: form.value.skills,
        time: form.value.time,
        contact: form.value.contact,
        extra: form.value.extra
      })
      alert('申请已提交！')
      router.push('/project/search') // 跳转回项目列表或其他页面
    } catch (e: any) {
      alert('提交失败：' + (e.message || '未知错误'))
    }
  }
  </script>