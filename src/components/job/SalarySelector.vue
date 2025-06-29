<template>
  <div class="relative salary-selector">
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
        class="absolute z-10 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg left-0 salary-dropdown"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">{{ formattedSalaryRange }}</span>
            <button 
              v-if="tempMinSalary !== null || tempMaxSalary !== null"
              @click="clearSelection"
              class="text-sm text-blue-600 hover:underline"
            >
              重置
            </button>
          </div>
          
          <!-- 薪资输入框 -->
          <div class="flex items-center gap-2 mb-4">
            <input 
              type="number" 
              v-model="minSalaryInput"
              class="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="最低"
              min="0"
              @change="updateFromInput"
            />
            <span class="text-gray-400">-</span>
            <input 
              type="number" 
              v-model="maxSalaryInput"
              class="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="最高"
              min="0"
              @change="updateFromInput"
            />
            <span class="text-xs text-gray-500">k/月</span>
          </div>
          
          <div class="relative pt-5 mb-4">
            <div class="h-1 bg-gray-200 rounded-full">
              <div 
                class="absolute h-1 bg-blue-500 rounded-full" 
                :style="{ left: `${salaryLeftPercent}%`, width: `${salaryRangePercent}%` }"
              ></div>
            </div>
            
            <!-- 最小值滑块 -->
            <input 
              type="range"
              min="0"
              max="50"
              step="1"
              v-model="salaryMinIndex"
              class="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
              :style="{ zIndex: 1 }"
            />
            
            <!-- 最大值滑块 -->
            <input 
              type="range"
              min="0"
              max="50"
              step="1"
              v-model="salaryMaxIndex"
              class="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
              :style="{ zIndex: 2 }"
            />
            
            <!-- 显示当前选择的薪资范围值 -->
            <div class="flex justify-between mt-2 text-xs text-gray-500">
              <span>0k</span>
              <span>200k</span>
            </div>
          </div>
          
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="(range, index) in salaryRanges" 
              :key="index"
              @click="selectSalaryRange(index)"
              class="px-2 py-1 text-center rounded cursor-pointer text-xs transition-colors"
              :class="isSalaryRangeSelected(index) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'"
            >
              {{ range.label }}
            </div>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  placeholder: {
    type: String,
    default: '请选择薪资范围'
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'update:max', 'change']);

// 组件状态
const isOpen = ref(false);
const tempMinSalary = ref<number | null>(null);
const tempMaxSalary = ref<number | null>(null);
const minSalaryInput = ref<string>('');
const maxSalaryInput = ref<string>('');

// 薪资范围选项
const salaryRanges = [
  { value: [0, 5], label: '5k以下' },
  { value: [5, 10], label: '5k-10k' },
  { value: [10, 15], label: '10k-15k' },
  { value: [15, 20], label: '15k-20k' },
  { value: [20, 30], label: '20k-30k' },
  { value: [30, 50], label: '30k-50k' },
  { value: [50, 100], label: '50k-100k' },
  { value: [100, 200], label: '100k以上' }
];

// 薪资滑块
const salaryMinIndex = ref(0);
const salaryMaxIndex = ref(50);

// 切换下拉框显示状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    // 打开下拉框时，将当前值复制到临时值
    tempMinSalary.value = props.modelValue;
    tempMaxSalary.value = props.max;
    updateSalarySliders();
    
    // 更新输入框值
    minSalaryInput.value = tempMinSalary.value !== null ? tempMinSalary.value.toString() : '';
    maxSalaryInput.value = tempMaxSalary.value !== null ? tempMaxSalary.value.toString() : '';
  }
};

// 关闭下拉框
const closeDropdown = () => {
  isOpen.value = false;
};

// 清空选择
const clearSelection = () => {
  tempMinSalary.value = null;
  tempMaxSalary.value = null;
  emit('update:modelValue', null);
  emit('update:max', null);
  salaryMinIndex.value = 0;
  salaryMaxIndex.value = 50;
  minSalaryInput.value = '';
  maxSalaryInput.value = '';
};

// 确认选择
const confirmSelection = () => {
  emit('change', { min: props.modelValue, max: props.max });
  closeDropdown();
};

// 计算薪资滑块位置
const salaryLeftPercent = computed(() => {
  return (Number(salaryMinIndex.value) / 50) * 100;
});

const salaryRangePercent = computed(() => {
  return ((Number(salaryMaxIndex.value) - Number(salaryMinIndex.value)) / 50) * 100;
});

// 计算实际薪资值
const minSalaryValue = computed(() => {
  return Math.floor(Number(salaryMinIndex.value) / 50 * 200);
});

const maxSalaryValue = computed(() => {
  return Math.floor(Number(salaryMaxIndex.value) / 50 * 200);
});

// 格式化单个薪资值
const formatSalaryValue = (value: number) => {
  return `${value}k`;
};

// 格式化薪资范围显示
const formattedSalaryRange = computed(() => {
  if (tempMinSalary.value === null && tempMaxSalary.value === null) {
    return '不限';
  }
  
  const min = tempMinSalary.value !== null ? tempMinSalary.value : 0;
  const max = tempMaxSalary.value !== null ? tempMaxSalary.value : 0;
  
  if (tempMinSalary.value !== null && tempMaxSalary.value !== null) {
    return `${formatSalaryValue(min)}-${formatSalaryValue(max)}`;
  } else if (tempMinSalary.value !== null) {
    return `${formatSalaryValue(min)}以上`;
  } else {
    return `${formatSalaryValue(max)}以下`;
  }
});

// 判断薪资范围是否被选中
const isSalaryRangeSelected = (index: number) => {
  if (tempMinSalary.value === null && tempMaxSalary.value === null) return false;
  
  const range = salaryRanges[index].value;
  const min = tempMinSalary.value !== null ? tempMinSalary.value : 0;
  const max = tempMaxSalary.value !== null ? tempMaxSalary.value : 0;
  
  return min === range[0] && max === range[1];
};

// 选择预设薪资范围
const selectSalaryRange = (index: number) => {
  const range = salaryRanges[index].value;
  tempMinSalary.value = range[0];
  tempMaxSalary.value = range[1];
  
  // 特殊处理5k以下的情况
  if (index === 0) { // 5k以下
    // 调整滑块最大值
    salaryMinIndex.value = 0;
    salaryMaxIndex.value = Math.floor(5 / 200 * 50);
    minSalaryInput.value = '0';
    maxSalaryInput.value = '5';
  } else {
    updateSalarySliders();
    // 更新输入框值
    minSalaryInput.value = range[0].toString();
    maxSalaryInput.value = range[1].toString();
  }
  
  emit('update:modelValue', tempMinSalary.value);
  emit('update:max', tempMaxSalary.value);
};

// 更新滑块位置
const updateSalarySliders = () => {
  if (tempMinSalary.value !== null && tempMaxSalary.value !== null) {
    salaryMinIndex.value = Math.floor((tempMinSalary.value / 200) * 50);
    salaryMaxIndex.value = Math.floor((tempMaxSalary.value / 200) * 50);
  } else {
    salaryMinIndex.value = 0;
    salaryMaxIndex.value = 50;
  }
};

// 从输入框更新薪资值
const updateFromInput = () => {
  const min = minSalaryInput.value ? parseInt(minSalaryInput.value) : null;
  const max = maxSalaryInput.value ? parseInt(maxSalaryInput.value) : null;
  
  if (min !== null && max !== null && min >= max) {
    // 确保最小值小于最大值
    tempMinSalary.value = min;
    tempMaxSalary.value = min + 1000;
  } else {
    tempMinSalary.value = min;
    tempMaxSalary.value = max;
  }
  
  emit('update:modelValue', tempMinSalary.value);
  emit('update:max', tempMaxSalary.value);
  updateSalarySliders();
};

// 监听滑块变化
watch([salaryMinIndex, salaryMaxIndex], () => {
  if (Number(salaryMinIndex.value) > Number(salaryMaxIndex.value) - 5) {
    // 确保最小值不大于最大值，并且两者之间有一定距离
    salaryMinIndex.value = Math.max(0, Number(salaryMaxIndex.value) - 5);
  }
  
  // 计算实际薪资值
  const min = minSalaryValue.value;
  const max = maxSalaryValue.value;
  
  tempMinSalary.value = min;
  tempMaxSalary.value = max;
  emit('update:modelValue', min);
  emit('update:max', max);
  
  // 更新输入框值
  minSalaryInput.value = min.toString();
  maxSalaryInput.value = max.toString();
});

// 计算显示的标签
const selectedLabel = computed(() => {
  if (props.modelValue === null && props.max === null) {
    return '';
  }
  
  const min = props.modelValue !== null ? props.modelValue : 0;
  const max = props.max !== null ? props.max : 0;
  
  if (props.modelValue !== null && props.max !== null) {
    return `${formatSalaryValue(min)}-${formatSalaryValue(max)}`;
  } else if (props.modelValue !== null) {
    return `${formatSalaryValue(min)}以上`;
  } else {
    return `${formatSalaryValue(max)}以下`;
  }
});

// 处理点击外部事件
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const selectorEl = document.querySelector('.salary-selector') as HTMLElement;
  if (selectorEl && !selectorEl.contains(target) && isOpen.value) {
    // 点击外部时，取消选择，恢复原始值
    emit('update:modelValue', tempMinSalary.value);
    emit('update:max', tempMaxSalary.value);
    isOpen.value = false;
  }
};

// 组件挂载和卸载时添加/移除事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  updateSalarySliders();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 暴露组件方法
defineExpose({
  closeDropdown,
  toggleDropdown,
  clearSelection
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

input[type="range"] {
  -webkit-appearance: none;
  height: 20px;
  margin: 0;
  background: transparent;
  pointer-events: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  margin-top: -8px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

/* 最小值滑块样式 */
input[type="range"]:nth-child(1)::-webkit-slider-thumb {
  background: #3b82f6;
}

input[type="range"]:nth-child(1)::-moz-range-thumb {
  background: #3b82f6;
}

/* 最大值滑块样式 */
input[type="range"]:nth-child(2)::-webkit-slider-thumb {
  background: #3b82f6;
}

input[type="range"]:nth-child(2)::-moz-range-thumb {
  background: #3b82f6;
}
</style> 