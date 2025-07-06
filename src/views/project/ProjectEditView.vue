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
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">编辑合作项目</h2>

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
              项目附件
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <!-- 现有附件列表 -->
              <div v-if="existingAttachments.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">现有附件：</h4>
                <div class="space-y-2">
                  <div v-for="(file, index) in existingAttachments" :key="`existing-${index}`" class="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span class="text-sm text-gray-700">{{ getFileNameFromUrl(file) }}</span>
                    </div>
                    <button
                      type="button"
                      @click="removeExistingFile(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 新上传文件列表 -->
              <div v-if="form.attachments.length > 0" class="space-y-2">
                <h4 class="text-sm font-medium text-gray-700 mb-2">新上传文件：</h4>
                <div v-for="(file, index) in form.attachments" :key="`new-${index}`" class="flex items-center justify-between p-2 bg-gray-50 rounded">
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
              </div>

              <!-- 上传按钮始终显示 -->
              <div class="mt-2">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>继续添加文件</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" multiple />
                </label>
                <p class="text-xs text-gray-500 mt-1">支持 PDF, DOC, DOCX, JPG, PNG 格式，单个文件不超过 10MB</p>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4 pt-6">
            <router-link
              :to="`/project/detail/${projectId}`"
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
              {{ isSubmitting ? '更新中...' : '更新项目' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { uploadFile, updateProject, getProject } from '@/lib/api/project'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const projectId = Number(route.params.projectId)

const form = ref({
  title: '',
  description: '',
  field: '',
  budget: '',
  contact: '',
  attachments: [] as File[],
  projectId: projectId
})

const existingAttachments = ref<string[]>([])
const isSubmitting = ref(false)

// 拉取项目详情
onMounted(async () => {
  try {
    const res = await getProject(projectId)
    if (res.data) {
      const project = res.data
      form.value = {
        title: project.title || '',
        description: project.description || '',
        field: project.field || '',
        budget: project.budget ? String(project.budget) : '',
        contact: project.contact || '',
        attachments: [],
        projectId: projectId
      }
      existingAttachments.value = project.attachments || []
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
  }
})

// 文件上传处理
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

function removeExistingFile(index: number) {
  existingAttachments.value.splice(index, 1)
}

function getFileName(file: File) {
  return file.name
}

function getFileNameFromUrl(url: string) {
  return url.split('/').pop() || '附件'
}

// 保存草稿
async function saveDraft() {
  if (isSubmitting.value) return
  
  // 新增确认弹窗
  if (!window.confirm('确定要保存为草稿吗？')) return
  try {
    isSubmitting.value = true
    
    // 先上传新附件
    let newAttachmentUrls: string[] = []
    for (const file of form.value.attachments) {
      const res = await uploadFile(file)
      if (res.code === 200) {
        newAttachmentUrls.push(res.data.file_url)
      } else {
        throw new Error('文件上传失败: ' + file.name)
      }
    }
    
    // 合并现有附件和新上传的附件
    const allAttachments = [...existingAttachments.value, ...newAttachmentUrls]
    
    // 构建提交数据
    const submitData = {
      projectId,
      title: form.value.title,
      description: form.value.description,
      field: form.value.field,
      budget: Number(form.value.budget),
      contact: form.value.contact,
      attachments: allAttachments,
      status: 'draft'
    }
    
    // 调用更新项目接口
    const res = await updateProject(submitData)
    if (res.data && res.data.projectId) {
      // 保存成功，自动返回上一页
      router.back()
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

// 发布/更新项目
async function submitForm() {
  if (isSubmitting.value) return

  // 新增确认弹窗
  if (!window.confirm('确定要发布/更新该项目吗？')) return

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

  try {
    isSubmitting.value = true
    
    // 先上传新附件
    let newAttachmentUrls: string[] = []
    for (const file of form.value.attachments) {
      const res = await uploadFile(file)
      if (res.code === 200) {
        newAttachmentUrls.push(res.data.file_url)
      } else {
        throw new Error('文件上传失败: ' + file.name)
      }
    }
    
    // 合并现有附件和新上传的附件
    const allAttachments = [...existingAttachments.value, ...newAttachmentUrls]
    
    // 构建提交数据
    const submitData = {
      projectId,
      title: form.value.title,
      description: form.value.description,
      field: form.value.field,
      budget: Number(form.value.budget),
      contact: form.value.contact,
      attachments: allAttachments,
      status: 'pending'
    }
    
    // 调用更新项目接口
    const res = await updateProject(submitData)
    if (res.data && res.data.projectId) {
      // 发布成功，自动返回上一页
      router.back()
    } else {
      throw new Error('项目更新失败')
    }
  } catch (error) {
    console.error('更新项目失败:', error)
    // 可以显示错误提示
  } finally {
    isSubmitting.value = false
  }
}
</script>
