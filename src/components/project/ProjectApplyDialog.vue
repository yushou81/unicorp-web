<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">申请参与项目</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="mb-4">
        <label for="apply-message" class="block text-sm font-medium text-gray-700 mb-1">申请说明</label>
        <textarea 
          id="apply-message"
          v-model="message" 
          rows="4" 
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          placeholder="请简要说明您的申请理由、相关经验或能力等"
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
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          提交申请
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: [Number, String],
    default: ''
  }
});

const emit = defineEmits(['close', 'submit']);

const message = ref('');

watch(() => props.visible, (newValue) => {
  if (newValue) {
    message.value = '';
  }
});

function submit() {
  if (!message.value.trim()) {
    alert('请输入申请说明');
    return;
  }
  
  emit('submit', {
    projectId: props.projectId,
    message: message.value
  });
  
  message.value = '';
}
</script> 