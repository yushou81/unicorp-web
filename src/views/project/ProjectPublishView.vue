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

      <!-- 标题 -->
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">新建合作项目</h2>

      <!-- 表单 -->
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- 项目名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              项目名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="请输入项目名称"
            />
          </div>

          <!-- 项目描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              项目描述 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="6"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="请详细描述项目内容、目标、技术要求等"
            ></textarea>
          </div>

          <!-- 项目领域 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              项目领域 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.field"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">请选择项目领域</option>
              <option value="智能制造">智能制造</option>
              <option value="人工智能">人工智能</option>
              <option value="大数据">大数据</option>
              <option value="云计算">云计算</option>
              <option value="物联网">物联网</option>
              <option value="区块链">区块链</option>
              <option value="新能源">新能源</option>
              <option value="生物医药">生物医药</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <!-- 预算 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              项目预算（元）<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.budget"
              type="number"
              min="0"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="请输入项目预算金额"
            />
          </div>

          <!-- 联系方式 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              联系方式 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.contact"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="请输入联系人姓名和电话"
            />
          </div>

          <!-- 附件上传 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              项目附件 <span class="text-red-500">*</span>
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div v-if="!form.attachments.length" class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>上传文件</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" multiple />
                  </label>
                  <p class="pl-1">或拖拽文件到此处</p>
                </div>
                <p class="text-xs text-gray-500">支持 PDF, DOC, DOCX, JPG, PNG 格式，单个文件不超过 10MB</p>
              </div>
              <div v-else class="space-y-2">
                <div v-for="(file, index) in form.attachments" :key="index" class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm text-gray-700">{{ getFileName(file) }}</span>
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>继续添加文件</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" multiple />
                </label>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4 pt-6">
            <router-link
              to="/project/list"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              取消
            </router-link>
            <button
              type="button"
              :disabled="isSubmitting"
              class="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              @click="saveDraft"
            >
              {{ isSubmitting ? '保存中...' : '保存草稿' }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {{ isSubmitting ? '发布中...' : '发布项目' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { uploadFile, createProject } from '@/lib/api/project'

const router = useRouter()
const appStore = useAppStore()

// 表单数据
const form = ref({
  title: '',
  description: '',
  field: '',
  budget: '',
  contact: '',
  attachments: [] as File[]
})

const isSubmitting = ref(false)

// 方法
async function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    for (const file of Array.from(files)) {
      form.value.attachments.push(file)
    }
  }
}

function removeFile(index: number) {
  form.value.attachments.splice(index, 1)
}

function getFileName(file: File) {
  return file.name
}

async function saveDraft() {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    
    // 先上传所有附件
    let attachmentUrls: string[] = []
    for (const file of form.value.attachments) {
      const res = await uploadFile(file)
      if (res.code === 200) {
        attachmentUrls.push(res.data.file_url)
      } else {
        throw new Error('文件上传失败: ' + file.name)
      }
    }
    
    // 构建草稿数据
    const submitData = {
      title: form.value.title,
      description: form.value.description,
      initiatorType: appStore.user?.role ,
      initiatorId: appStore.user?.id,
      field: form.value.field,
      budget: form.value.budget ? Number(form.value.budget) : undefined,
      contact: form.value.contact,
      attachments: attachmentUrls,
      status: 'draft',
      projectId: undefined
    }
    
    // 调用实际的创建项目接口
    const res = await createProject(submitData)
    if (res?.data?.projectId) {
      // 保存成功，跳转到编辑页
      router.push(`/project/publish`)
    } else {
      throw new Error('草稿保存失败')
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    // 可以显示错误提示
  } finally {
    isSubmitting.value = false
  }
}

async function submitForm() {
  if (isSubmitting.value) return

  if (!form.value.title) {
    alert('请填写项目名称')
    return
  }
  if (!form.value.description) {
    alert('请填写项目描述')
    return
  }
  if (!form.value.field) {
    alert('请选择项目领域')
    return
  }
  if (!form.value.budget) {
    alert('请填写项目预算')
    return
  }
  if (!form.value.contact) {
    alert('请填写联系方式')
    return
  }
  if (!form.value.attachments.length) {
    alert('请上传至少一个附件')
    return
  }

  try {
    isSubmitting.value = true
    
    // 先上传所有附件
    let attachmentUrls: string[] = []
    for (const file of form.value.attachments) {
      const res = await uploadFile(file)
      if (res.code === 200) {
        attachmentUrls.push(res.data.file_url)
      } else {
        throw new Error('文件上传失败: ' + file.name)
      }
    }
    
    // 构建提交数据
    const submitData = {
      title: form.value.title,
      description: form.value.description,
      initiatorType: appStore.user?.role,
      initiatorId: appStore.user?.id,
      field: form.value.field,
      budget: form.value.budget ? Number(form.value.budget) : undefined,
      contact: form.value.contact,
      attachments: attachmentUrls,
      status: 'pending',
      projectId: undefined
    }
    
    // 调用实际的创建项目接口
    const res = await createProject(submitData)
    if (res?.data?.projectId) {
      // 发布成功，跳转到项目列表
      router.push('/project/list')
    } else {
      throw new Error('项目发布失败')
    }
  } catch (error) {
    console.error('发布项目失败:', error)
    // 可以显示错误提示
  } finally {
    isSubmitting.value = false
  }
}
</script>
