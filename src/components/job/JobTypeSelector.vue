<template>
  <div class="relative job-type-selector">
    <!-- 触发按钮 -->
    <button 
      @click="toggleDropdown"
      class="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      :class="{ 'border-blue-500 ring-1 ring-blue-500': isOpen }"
    >
      <span>{{ selectedLabel || placeholder }}</span>
      <svg class="w-5 h-5 ml-2 transition-transform duration-300" 
        :class="{'transform rotate-180': isOpen}"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- 下拉面板 -->
    <transition name="dropdown">
      <div 
        v-show="isOpen" 
        class="absolute z-10 w-40 mt-1 bg-white border border-gray-200 rounded-md shadow-lg left-0 job-type-dropdown"
      >
        <div class="flex flex-col">
          <div 
            v-for="type in jobTypes" 
            :key="type.value"
            @click="selectType(type)"
            class="px-4 py-2 cursor-pointer text-sm transition-colors hover:bg-gray-50"
            :class="isSelected(type) ? 'text-blue-500 font-medium' : 'text-gray-700'"
          >
            {{ type.label }}
            <span v-if="isSelected(type)" class="float-right">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
        
        <!-- 底部操作按钮 -->
        <div class="flex justify-between p-2 border-t border-gray-200">
          <button 
            @click="clearSelection" 
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            清空
          </button>
          <button 
            @click="confirmSelection" 
            class="px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            确定
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface JobType {
  value: string;
  label: string;
}

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择职位类型'
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'change']);

// 组件状态
const isOpen = ref(false);
const tempSelectedValue = ref('');

// 职位类型数据
const jobTypes: JobType[] = [
  { value: 'full_time', label: '全职' },
  { value: 'part_time', label: '兼职' },
  { value: 'internship', label: '实习' },
  { value: 'remote', label: '远程' }
];

// 已选职位类型
const selectedType = computed(() => {
  return jobTypes.find(type => type.value === tempSelectedValue.value || type.value === props.modelValue);
});

// 判断职位类型是否已选中
const isSelected = (type: JobType) => {
  return tempSelectedValue.value === type.value || props.modelValue === type.value;
};

// 切换下拉框显示状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    // 打开下拉框时，将当前值复制到临时值
    tempSelectedValue.value = props.modelValue;
  }
};

// 关闭下拉框
const closeDropdown = () => {
  isOpen.value = false;
};

// 选择职位类型
const selectType = (type: JobType) => {
  tempSelectedValue.value = type.value;
  emit('update:modelValue', type.value);
};

// 清空选择
const clearSelection = () => {
  tempSelectedValue.value = '';
  emit('update:modelValue', '');
  closeDropdown();
};

// 确认选择
const confirmSelection = () => {
  emit('change', props.modelValue);
  closeDropdown();
};

// 计算显示的标签
const selectedLabel = computed(() => {
  if (!props.modelValue) {
    return '';
  }
  
  const type = jobTypes.find(type => type.value === props.modelValue);
  return type ? type.label : '';
});

// 处理点击外部事件
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const selectorEl = document.querySelector('.job-type-selector') as HTMLElement;
  if (selectorEl && !selectorEl.contains(target) && isOpen.value) {
    // 点击外部时，取消选择，恢复原始值
    emit('update:modelValue', props.modelValue);
    isOpen.value = false;
  }
};

// 组件挂载和卸载时添加/移除事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* 自定义样式 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 