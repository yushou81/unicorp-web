<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div class="container mx-auto px-4">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <button
            @click="goBack"
            class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
        </div>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">编辑项目</h2>
          <div v-if="loading" class="text-center py-10 text-gray-400">加载中...</div>
          <div v-else class="bg-white rounded-2xl shadow-lg p-8">
            <form @submit.prevent="onSubmit" enctype="multipart/form-data">
              <!-- 基本信息 -->
              <div class="mb-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">基本信息</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-gray-700 mb-2 font-medium">项目名称 *</label>
                    <input 
                      v-model="form.title" 
                      type="text" 
                      required 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入项目名称"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 mb-2 font-medium">计划人数 *</label>
                    <input 
                      v-model.number="form.maxMemberCount" 
                      type="number" 
                      min="1" 
                      required 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入计划人数"
                    />
                  </div>
                </div>
                <div class="mt-6">
                  <label class="block text-gray-700 mb-2 font-medium">项目描述 *</label>
                  <textarea 
                    v-model="form.description" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="请详细描述项目内容、目标和要求"
                  ></textarea>
                </div>
              </div>
              <!-- 项目属性 -->
              <div class="mb-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">项目属性</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-gray-700 mb-2 font-medium">项目难度 *</label>
                    <select 
                      v-model="form.difficulty" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">请选择项目难度</option>
                      <option value="基础/Basic">基础/Basic</option>
                      <option value="进阶/Advanced">进阶/Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 mb-2 font-medium">支持语言 *</label>
                    <select 
                      v-model="form.language" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">请选择支持语言</option>
                      <option value="中文&English">中文&English</option>
                      <option value="中文">中文</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 mb-2 font-medium">技术领域 *</label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="item in techOptions"
                        :key="item"
                        type="button"
                        @click="toggleTech(item)"
                        :class="form.tech.includes(item) ? activeBtn : inactiveBtn"
                      >{{ item }}</button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-700 mb-2 font-medium">编程语言 *</label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="item in codeOptions"
                        :key="item"
                        type="button"
                        @click="toggleCode(item)"
                        :class="form.code.includes(item) ? activeBtn : inactiveBtn"
                      >{{ item }}</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 项目计划书 -->
              <div class="mb-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">项目计划书</h3>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">上传项目计划书（PDF格式）*</label>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    @change="onFileChange" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p class="text-sm text-gray-500 mt-1">支持PDF格式，文件大小不超过10MB</p>
                  <div v-if="form.projectProposalUrl" class="mt-2">
                    <a :href="form.projectProposalUrl" target="_blank" class="text-blue-600 underline">已上传的项目计划书（点击查看）</a>
                  </div>
                </div>
              </div>
              <!-- 提交按钮 -->
              <div class="flex justify-center">
                <button 
                  type="submit" 
                  :disabled="submitting" 
                  class="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ submitting ? '保存中...' : '保存修改' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getProject, updateProject } from '@/lib/api/project'
  import { uploadFile } from '@/lib/api/file'
  
  const route = useRoute()
  const router = useRouter()
  const loading = ref(true)
  const submitting = ref(false)
  const projectId = Number(route.params.id)
  
  const form = ref({
    title: '',
    maxMemberCount: 1,
    description: '',
    difficulty: '',
    language: '',
    tech: [] as string[],
    code: [] as string[],
    planFile: null as File | null,
    projectProposalUrl: ''
  })
  
  const techOptions = ['.NET', 'AI', 'ARM', 'Angular', 'AWS', 'AndroidX', 'Apache', 'Appium']
  const codeOptions = ['C', 'C++', 'Java', 'Python', 'Go', 'JavaScript', 'HTML', 'MATLAB']
  
  const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
  const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'
  
  function goBack() {
    router.back()
  }
  
  function toggleTech(item: string) {
    const idx = form.value.tech.indexOf(item)
    if (idx > -1) {
      form.value.tech.splice(idx, 1)
    } else {
      form.value.tech.push(item)
    }
  }
  
  function toggleCode(item: string) {
    const idx = form.value.code.indexOf(item)
    if (idx > -1) {
      form.value.code.splice(idx, 1)
    } else {
      form.value.code.push(item)
    }
  }
  
  function onFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      form.value.planFile = files[0]
    } else {
      form.value.planFile = null
    }
  }
  
  onMounted(async () => {
    try {
      const res = await getProject(projectId)
      // 兼容后端字段
      form.value.title = res.data.title || ''
      form.value.maxMemberCount = res.data.planMemberCount || 1
      form.value.description = res.data.description || ''
      form.value.difficulty = res.data.difficulty || ''
      // 语言字段兼容数组和字符串
      if (Array.isArray(res.data.supportLanguages)) {
        form.value.language = res.data.supportLanguages.join('&')
      } else {
        form.value.language = res.data.supportLanguages || ''
      }
      form.value.tech = res.data.techFields || []
      form.value.code = res.data.programmingLanguages || []
      form.value.projectProposalUrl = res.data.projectProposalUrl || ''
    } catch (e: any) {
      alert('加载项目信息失败: ' + (e.message || '未知错误'))
      router.push('/company/projects')
    } finally {
      loading.value = false
    }
  })
  
  async function onSubmit() {
    if (submitting.value) return
  
    if (!form.value.title || !form.value.description || !form.value.difficulty || !form.value.language) {
      alert('请填写所有必填项')
      return
    }
    if (form.value.tech.length === 0) {
      alert('请选择至少一个技术领域')
      return
    }
    if (form.value.code.length === 0) {
      alert('请选择至少一个编程语言')
      return
    }
    submitting.value = true
    try {
      let fileUrl = form.value.projectProposalUrl
      // 如果重新上传了文件，则先上传
      if (form.value.planFile) {
        const fileFd = new FormData()
        fileFd.append('file', form.value.planFile)
        const fileRes = await uploadFile(fileFd)
        fileUrl = fileRes.data.file_url
      }
      // 组装数据
      const projectData = {
        title: form.value.title,
        planMemberCount: form.value.maxMemberCount,
        description: form.value.description,
        difficulty: form.value.difficulty,
        supportLanguages: form.value.language ? form.value.language.split('&') : [],
        techFields: form.value.tech,
        programmingLanguages: form.value.code,
        projectProposalUrl: fileUrl
      }
      await updateProject(projectId, projectData)
      alert('项目更新成功')
      router.push('/company/projects')
    } catch (e: any) {
      alert('更新失败: ' + (e.message || '未知错误'))
      console.error('更新项目失败:', e)
    } finally {
      submitting.value = false
    }
  }
  </script>