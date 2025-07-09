<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">上传合同附件</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 mb-4">
        <div v-if="files.length === 0" class="space-y-2">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <div class="text-sm text-gray-600">
            <label for="contract-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
              <span>上传合同附件</span>
              <input id="contract-upload" type="file" class="sr-only" @change="onFileChange" multiple />
            </label>
            <p class="pl-1">或拖拽文件到此处</p>
          </div>
          <p class="text-xs text-gray-500">支持 PDF, DOC, DOCX，单个文件不超过 10MB</p>
        </div>
        
        <div v-else class="space-y-2">
          <div class="mb-2">
            <div v-for="(file, idx) in files" :key="idx" class="flex items-center text-sm mb-1 bg-white p-2 rounded-md shadow-sm">
              <span class="truncate max-w-[180px] text-left" :title="file.name">{{ file.name }}</span>
              <button @click="removeFile(idx)" class="ml-2 text-red-500 hover:text-red-700" title="移除">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <label for="contract-upload-more" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
            <span>继续添加文件</span>
            <input id="contract-upload-more" type="file" class="sr-only" @change="onFileChange" multiple />
          </label>
        </div>
      </div>
      
      <div class="mb-4">
        <label for="remark" class="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
        <textarea
          id="remark"
          v-model="remark"
          rows="2"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="备注信息"
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-2">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          取消
        </button>
        <button 
          @click="submit"
          :disabled="files.length === 0"
          :class="files.length === 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          class="px-4 py-2 text-white rounded-md transition-colors text-sm font-medium"
        >
          上传
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const files = ref<File[]>([]);
const remark = ref('');

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    for (let i = 0; i < target.files.length; i++) {
      files.value.push(target.files[i]);
    }
  }
}

function removeFile(index: number) {
  files.value.splice(index, 1);
}

function submit() {
  if (files.value.length === 0) return;
  
  emit('submit', {
    files: files.value,
    remark: remark.value
  });
  
  // 清空数据
  files.value = [];
  remark.value = '';
}
</script> 