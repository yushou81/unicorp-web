<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div 
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">添加项目进度</h3>
          
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="stage" class="block text-sm font-medium text-gray-700 mb-1">阶段名称</label>
              <input
                id="stage"
                v-model="form.stage"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入阶段名称"
                required
              />
            </div>
            
            <div class="mb-4">
              <label for="content" class="block text-sm font-medium text-gray-700 mb-1">进度内容</label>
              <textarea
                id="content"
                v-model="form.content"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请详细描述当前进度"
                required
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">附件（可选）</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>上传文件</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple @change="handleFileChange" />
                    </label>
                    <p class="pl-1">或拖放文件</p>
                  </div>
                  <p class="text-xs text-gray-500">支持任何类型文件</p>
                </div>
              </div>
              <div v-if="files.length > 0" class="mt-2">
                <p class="text-sm text-gray-500">已选择 {{ files.length }} 个文件</p>
                <ul class="mt-1 text-sm text-gray-500">
                  <li v-for="(file, index) in files" :key="index" class="flex items-center justify-between">
                    <span class="truncate max-w-xs">{{ file.name }}</span>
                    <button 
                      type="button" 
                      @click="removeFile(index)"
                      class="ml-2 text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </form>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button"
            @click="submitForm"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            提交
          </button>
          <button 
            type="button"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  stage: '',
  content: ''
})

const files = ref<File[]>([])

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    for (let i = 0; i < target.files.length; i++) {
      files.value.push(target.files[i])
    }
  }
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

function submitForm() {
  const formData = new FormData()
  formData.append('projectId', props.projectId.toString())
  formData.append('stage', form.value.stage)
  formData.append('content', form.value.content)
  
  files.value.forEach(file => {
    formData.append('files', file)
  })
  
  emit('submit', formData)
  
  // 重置表单
  form.value.stage = ''
  form.value.content = ''
  files.value = []
}
</script>