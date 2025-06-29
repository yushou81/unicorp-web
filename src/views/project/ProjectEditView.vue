<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link
          to="/company/projects"
          class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </router-link>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">编辑项目</h2>
        
        <div class="bg-white rounded-2xl shadow-lg p-8">
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
                  <select 
                    v-model="form.tech" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择技术领域</option>
                    <option value=".NET">.NET</option>
                    <option value="AI">AI</option>
                    <option value="ARM">ARM</option>
                    <option value="Angular">Angular</option>
                    <option value="AWS">AWS</option>
                    <option value="AndroidX">AndroidX</option>
                    <option value="Apache">Apache</option>
                    <option value="Appium">Appium</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">编程语言 *</label>
                  <select 
                    v-model="form.code" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择编程语言</option>
                    <option value="C">C</option>
                    <option value="C++">C++</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="HTML">HTML</option>
                    <option value="MATLAB">MATLAB</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 项目计划书 -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">项目计划书</h3>
              <div>
                <label class="block text-gray-700 mb-2 font-medium">上传项目计划书（PDF格式，留空则不更改）</label>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  @change="onFileChange" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p class="text-sm text-gray-500 mt-1">支持PDF格式，文件大小不超过10MB</p>
                <div v-if="form.planUrl" class="mt-2 text-sm">
                  当前计划书：<a :href="form.planUrl" target="_blank" class="text-blue-600 hover:underline">查看</a>
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

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const form = ref({
  title: '',
  maxMemberCount: 1,
  description: '',
  difficulty: '',
  language: '',
  tech: '',
  code: '',
  planFile: null as File | null,
  planUrl: ''
})

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    form.value.planFile = files[0]
  } else {
    form.value.planFile = null
  }
}

onMounted(async () => {
  const projectId = Number(route.params.id)
  const res = await getProject(projectId)
  // 填充表单数据
  form.value.title = res.data.title
  form.value.maxMemberCount = res.data.maxMemberCount
  form.value.description = res.data.description
  form.value.difficulty = res.data.difficulty || ''
  form.value.language = res.data.language || ''
  form.value.tech = res.data.tech || ''
  form.value.code = res.data.code || ''
  form.value.planUrl = res.data.planUrl || ''
})

async function onSubmit() {
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('title', form.value.title)
    fd.append('maxMemberCount', String(form.value.maxMemberCount))
    fd.append('description', form.value.description)
    fd.append('difficulty', form.value.difficulty)
    fd.append('language', form.value.language)
    fd.append('tech', form.value.tech)
    fd.append('code', form.value.code)
    // 只有选择了新文件才上传，否则不传
    if (form.value.planFile) {
      fd.append('planFile', form.value.planFile)
    }
    
    await updateProject(Number(route.params.id), fd)
    alert('项目修改成功！')
    router.push('/company/projects')
  } catch (e: any) {
    alert('修改失败：' + (e.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}
</script>