<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
      </div>

      <!-- 标题 -->
      <h1 class="text-2xl font-bold text-gray-900 mb-6">创建项目</h1>

      <!-- 表单卡片 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- 表单字段 -->
          <ProjectFormFields v-model="form" />

          <!-- 附件上传区域 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">项目附件</label>
            <FileUploadArea
              :new-files="form.attachments"
              @add-files="addFiles"
              @remove-new="removeFile"
            />
          </div>

          <!-- 提交按钮区 -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              @click="router.back()"
            >
              取消
            </button>
            <button
              type="button"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              @click="saveDraft"
            >
              {{ isSubmitting ? '保存中...' : '保存草稿' }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ isSubmitting ? '创建中...' : '创建项目' }}
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
import ProjectFormFields from '@/components/project/ProjectFormFields.vue'
import FileUploadArea from '@/components/project/FileUploadArea.vue'

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

// 文件处理方法
function addFiles(files: File[]) {
  form.value.attachments.push(...files)
}

function removeFile(index: number) {
  form.value.attachments.splice(index, 1)
}

// 保存草稿
async function saveDraft() {
  if (isSubmitting.value) return
  
  if (!window.confirm('确定要保存为草稿吗？')) return
  
  try {
    isSubmitting.value = true
    
    // 先上传附件
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
      field: form.value.field,
      budget: Number(form.value.budget),
      contact: form.value.contact,
      attachments: attachmentUrls,
      status: 'draft'
    }
    
    // 调用创建项目接口
    const res = await createProject(submitData)
    if (res.data && res.data.projectId) {
      // 保存成功，跳转到项目列表页
      router.push('/project/my')
    } else {
      throw new Error('草稿保存失败')
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    alert('保存草稿失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 创建项目
async function submitForm() {
  if (isSubmitting.value) return

  if (!window.confirm('确定要创建该项目吗？')) return

  // 表单验证
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
    
    // 先上传附件
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
      field: form.value.field,
      budget: Number(form.value.budget),
      contact: form.value.contact,
      attachments: attachmentUrls,
      status: 'pending'
    }
    
    // 调用创建项目接口
    const res = await createProject(submitData)
    if (res.data && res.data.projectId) {
      // 创建成功，跳转到项目列表页
      router.push('/project/my')
    } else {
      throw new Error('项目创建失败')
    }
  } catch (error) {
    console.error('创建项目失败:', error)
    alert('创建项目失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script> 