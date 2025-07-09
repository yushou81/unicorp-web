<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">经费申请</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <div>
          <label for="fund-amount" class="block text-sm font-medium text-gray-700 mb-1">金额（元）</label>
          <input 
            id="fund-amount"
            v-model="amount" 
            type="number" 
            min="0" 
            step="0.01" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="请输入金额" 
          />
        </div>
        
        <div>
          <label for="fund-purpose" class="block text-sm font-medium text-gray-700 mb-1">用途</label>
          <input 
            id="fund-purpose"
            v-model="purpose" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="请输入经费用途" 
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">附件（可选）</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
            <input id="fund-upload" type="file" class="sr-only" @change="onFileChange" multiple />
            <label for="fund-upload" class="cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-sm">上传附件</label>
            <div v-if="uploading" class="text-xs text-gray-500 mt-1">上传中...</div>
            
            <div v-if="attachments.length > 0" class="mt-2 space-y-1">
              <div v-for="(file, idx) in attachments" :key="idx" class="flex items-center text-xs bg-white p-2 rounded-md shadow-sm">
                <span class="truncate max-w-[180px] text-left" :title="file.name">{{ file.name }}</span>
                <button @click="removeAttachment(idx)" class="ml-2 text-red-500 hover:text-red-700" title="移除">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label for="fund-remark" class="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
          <textarea 
            id="fund-remark"
            v-model="remark" 
            rows="2" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="备注"
          ></textarea>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 mt-6">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          取消
        </button>
        <button 
          @click="submit"
          :disabled="!isValid || uploading"
          :class="!isValid || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          class="px-4 py-2 text-white rounded-md transition-colors text-sm font-medium"
        >
          提交
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const amount = ref('');
const purpose = ref('');
const attachments = ref<{name: string; url: string}[]>([]);
const remark = ref('');
const uploading = ref(false);

const isValid = computed(() => {
  return amount.value.trim() !== '' && 
         !isNaN(Number(amount.value)) && 
         Number(amount.value) > 0 && 
         purpose.value.trim() !== '';
});

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    uploading.value = true;
    
    // 模拟上传文件的过程
    setTimeout(() => {
      for (let i = 0; i < target.files!.length; i++) {
        const file = target.files![i];
        // 在实际应用中，这里应该是真正的文件上传逻辑
        attachments.value.push({
          name: file.name,
          url: URL.createObjectURL(file) // 临时URL，实际应用中应该是服务器返回的URL
        });
      }
      uploading.value = false;
    }, 1000);
  }
}

function removeAttachment(index: number) {
  attachments.value.splice(index, 1);
}

function submit() {
  if (!isValid.value || uploading.value) return;
  
  emit('submit', {
    amount: Number(amount.value),
    purpose: purpose.value,
    attachments: attachments.value.map(a => a.url),
    remark: remark.value
  });
  
  // 清空表单
  amount.value = '';
  purpose.value = '';
  attachments.value = [];
  remark.value = '';
}
</script> 