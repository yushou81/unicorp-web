<template>
  <div class="relative">
    <!-- 触发按钮 -->
    <button 
      @click="toggleDropdown"
      class="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      :class="{ 'border-blue-500 ring-1 ring-blue-500': isOpen }"
    >
      <span>{{ selectedLabel || placeholder }}</span>
      <svg class="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- 下拉面板 -->
    <div 
      v-if="isOpen" 
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
      :class="{ 'min-w-[300px] right-0': width === 'wide', 'min-w-[500px] right-0': width === 'extra-wide' }"
      v-click-outside="closeDropdown"
    >
      <!-- 搜索框 (可选) -->
      <div v-if="searchable" class="p-2 border-b border-gray-200">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          :placeholder="searchPlaceholder"
        />
      </div>

      <!-- 选项内容 -->
      <div class="max-h-60 overflow-y-auto p-2">
        <slot :filtered-options="filteredOptions" :toggle-option="toggleOption" :is-selected="isSelected"></slot>
      </div>

      <!-- 底部操作按钮 -->
      <div v-if="showFooter" class="flex justify-between p-2 border-t border-gray-200">
        <button 
          @click="clearSelection" 
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          清空
        </button>
        <button 
          @click="closeDropdown" 
          class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, PropType } from 'vue';

// 定义组件属性
const props = defineProps({
  options: {
    type: Array as () => any[],
    default: () => []
  },
  modelValue: {
    type: [Array, String, Number] as unknown as PropType<string[] | string | number>,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: 'normal' // normal, wide, extra-wide
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'change']);

// 组件状态
const isOpen = ref(false);
const searchQuery = ref('');

// 使用全局注册的点击外部指令

// 切换下拉框显示状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 关闭下拉框
const closeDropdown = () => {
  isOpen.value = false;
};

// 清空选择
const clearSelection = () => {
  if (props.multiple) {
    emit('update:modelValue', []);
  } else {
    emit('update:modelValue', '');
  }
  emit('change', props.multiple ? [] : '');
};

// 过滤选项
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  
  return props.options.filter(option => {
    const label = typeof option === 'object' ? option[props.labelKey] : option;
    return label.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// 判断选项是否被选中
const isSelected = (option: any) => {
  const value = typeof option === 'object' ? option[props.valueKey] : option;
  
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value);
  } else {
    return props.modelValue === value;
  }
};

// 切换选项选中状态
const toggleOption = (option: any) => {
  const value = typeof option === 'object' ? option[props.valueKey] : option;
  
  if (props.multiple) {
    const newValue = [...(Array.isArray(props.modelValue) ? props.modelValue : [])];
    const index = newValue.indexOf(value);
    
    if (index === -1) {
      newValue.push(value);
    } else {
      newValue.splice(index, 1);
    }
    
    emit('update:modelValue', newValue);
    emit('change', newValue);
  } else {
    emit('update:modelValue', value);
    emit('change', value);
    closeDropdown();
  }
};

// 计算显示的标签
const selectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue) && props.modelValue.length > 0) {
    if (props.modelValue.length === 1) {
      const selectedOption = props.options.find(option => {
        const optionValue = typeof option === 'object' ? option[props.valueKey] : option;
        return optionValue === (props.modelValue as string[])[0];
      });
      return selectedOption ? (typeof selectedOption === 'object' ? selectedOption[props.labelKey] : selectedOption) : '';
    } else {
      return `已选 ${props.modelValue.length} 项`;
    }
  } else if (!props.multiple && props.modelValue) {
    const selectedOption = props.options.find(option => {
      const optionValue = typeof option === 'object' ? option[props.valueKey] : option;
      return optionValue === props.modelValue;
    });
    return selectedOption ? (typeof selectedOption === 'object' ? selectedOption[props.labelKey] : selectedOption) : '';
  }
  return '';
});

// 监听搜索查询变化
watch(searchQuery, () => {
  // 可以在这里添加额外的搜索逻辑
});

// 暴露组件方法
defineExpose({
  closeDropdown,
  toggleDropdown,
  clearSelection
});
</script>

<style scoped>
.max-h-60 {
  max-height: 15rem;
}
</style> 