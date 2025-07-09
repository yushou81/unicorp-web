<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">
          请输入{{ actionText }}原因
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <textarea 
        v-model="localReason" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        rows="3" 
        placeholder="请输入原因"
      ></textarea>
      <div class="flex justify-end space-x-2">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          取消
        </button>
        <button 
          @click="confirmReason" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  action: {
    type: String as () => 'canceled' | 'terminated' | null,
    default: 'canceled' // 'canceled' | 'terminated'
  },
  reason: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);

const localReason = ref(props.reason);

watch(() => props.reason, (newValue) => {
  localReason.value = newValue;
});

watch(() => props.visible, (newValue) => {
  if (newValue) {
    localReason.value = props.reason;
  }
});

function confirmReason() {
  if (!localReason.value.trim()) {
    alert('请输入原因');
    return;
  }
  emit('confirm', localReason.value);
}

const actionText = computed(() => {
  switch (props.action) {
    case 'canceled': return '取消';
    case 'terminated': return '终止';
    default: return '';
  }
});
</script> 