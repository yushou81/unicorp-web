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
          <h3 class="text-lg font-medium text-gray-900 mb-4">申请项目经费</h3>
          
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">申请金额 (¥)</label>
              <input
                id="amount"
                v-model="form.amount"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入申请金额"
                required
              />
            </div>
            
            <div class="mb-4">
              <label for="purpose" class="block text-sm font-medium text-gray-700 mb-1">用途说明</label>
              <textarea
                id="purpose"
                v-model="form.purpose"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请详细说明经费用途"
                required
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">相关凭证（可选）</label>
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
                  <p class="text-xs text-gray-500">支持PDF、图片等格式</p>
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
            
            <div class="mb-4">
              <div class="rounded-md bg-blue-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3 flex-1 md:flex md:justify-between">
                    <p class="text-sm text-blue-700">
                      剩余预算: ¥{{ remainingBudget }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button"
            @click="submitForm"
            :disabled="isAmountInvalid"
            :class="[
              'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm',
              isAmountInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            ]"
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
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: [Number, String],
    required: true
  },
  remainingBudget: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  amount: '',
  purpose: ''
})

const files = ref<File[]>([])

const isAmountInvalid = computed(() => {
  const amount = Number(form.value.amount)
  return isNaN(amount) || amount <= 0 || amount > props.remainingBudget
})

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
  if (isAmountInvalid.value) return
  
  const formData = new FormData()
  formData.append('projectId', props.projectId.toString())
  formData.append('amount', form.value.amount)
  formData.append('purpose', form.value.purpose)
  
  files.value.forEach(file => {
    formData.append('files', file)
  })
  
  emit('submit', formData)
  
  // 重置表单
  form.value.amount = ''
  form.value.purpose = ''
  files.value = []
}
</script>