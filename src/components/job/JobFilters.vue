<template>
  <div class="bg-white rounded-lg shadow-sm mb-6">
    <!-- 筛选类型标签 -->
    <div class="border-b">
      <div class="flex items-center px-4">
        <div 
          v-for="(filter, index) in filterTypes" 
          :key="index"
          class="px-4 py-3 cursor-pointer relative"
          :class="activeFilterType === filter.value ? 'text-blue-600 font-medium' : 'text-gray-600'"
          @click="activeFilterType = filter.value"
        >
          {{ filter.label }}
          <div v-if="activeFilterType === filter.value" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
        </div>
      </div>
    </div>
    
    <!-- 已选筛选条件 -->
    <div v-if="hasActiveFilters" class="flex items-center px-4 py-3 border-b">
      <div class="text-gray-500 mr-2">已选条件:</div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="(item, index) in activeFilters" 
          :key="index"
          class="flex items-center bg-blue-50 text-blue-600 text-sm px-2 py-1 rounded-md"
        >
          {{ item.label }}
          <button @click="removeFilter(item)" class="ml-1 text-blue-400 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <button @click="clearFilters" class="text-blue-600 text-sm hover:underline">清空</button>
      </div>
    </div>
    
    <!-- 教育背景筛选 -->
    <div v-if="activeFilterType === 'education'" class="p-4">
      <div class="grid grid-cols-4 gap-4">
        <div 
          v-for="edu in educationOptions" 
          :key="edu.value"
          @click="toggleEducation(edu)"
          class="px-3 py-2 text-center rounded cursor-pointer text-sm transition-colors"
          :class="selectedEducation.includes(edu.value) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'"
        >
          {{ edu.label }}
        </div>
      </div>
    </div>
    
    <!-- 工作经验筛选 -->
    <div v-if="activeFilterType === 'experience'" class="p-4">
      <div class="grid grid-cols-4 gap-4">
        <div 
          v-for="exp in experienceOptions" 
          :key="exp.value"
          @click="toggleExperience(exp)"
          class="px-3 py-2 text-center rounded cursor-pointer text-sm transition-colors"
          :class="selectedExperience.includes(exp.value) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'"
        >
          {{ exp.label }}
        </div>
      </div>
    </div>
    
    <!-- 薪资范围筛选 -->
    <div v-if="activeFilterType === 'salary'" class="p-4">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">{{ formattedSalaryRange }}</span>
          <button 
            v-if="selectedSalary"
            @click="selectedSalary = null"
            class="text-sm text-blue-600 hover:underline"
          >
            重置
          </button>
        </div>
        
        <div class="relative pt-5">
          <div class="h-1 bg-gray-200 rounded-full">
            <div 
              class="absolute h-1 bg-blue-500 rounded-full" 
              :style="{ left: `${salaryLeftPercent}%`, width: `${salaryRangePercent}%` }"
            ></div>
          </div>
          
          <input 
            type="range"
            min="0"
            max="50"
            step="1"
            v-model="salaryMinIndex"
            class="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
            :style="{ zIndex: 1 }"
          />
          
          <input 
            type="range"
            min="0"
            max="50"
            step="1"
            v-model="salaryMaxIndex"
            class="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
            :style="{ zIndex: 2 }"
          />
        </div>
        
        <div class="grid grid-cols-5 gap-2">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface FilterItem {
  value: string;
  label: string;
  type?: string;
}

// 筛选类型
const filterTypes = [
  { value: 'education', label: '学历要求' },
  { value: 'experience', label: '工作经验' },
  { value: 'salary', label: '薪资范围' }
]

const activeFilterType = ref('education')

// 教育背景选项
const educationOptions = [
  { value: 'highSchool', label: '高中及以下' },
  { value: 'associate', label: '大专' },
  { value: 'bachelor', label: '本科' },
  { value: 'master', label: '硕士' },
  { value: 'phd', label: '博士' },
  { value: 'any', label: '不限' }
]

// 工作经验选项
const experienceOptions = [
  { value: 'noExperience', label: '应届生' },
  { value: '1-3', label: '1-3年' },
  { value: '3-5', label: '3-5年' },
  { value: '5-10', label: '5-10年' },
  { value: '10+', label: '10年以上' },
  { value: 'any', label: '不限' }
]

// 薪资范围选项
const salaryRanges = [
  { value: [0, 5000], label: '5k以下' },
  { value: [5000, 10000], label: '5k-10k' },
  { value: [10000, 15000], label: '10k-15k' },
  { value: [15000, 20000], label: '15k-20k' },
  { value: [20000, 30000], label: '20k-30k' },
  { value: [30000, 50000], label: '30k-50k' },
  { value: [50000, 100000], label: '50k-100k' },
  { value: [100000, 999999], label: '100k以上' }
]

// 定义 props
const props = defineProps({
  education: {
    type: Array as () => string[],
    default: () => []
  },
  experience: {
    type: Array as () => string[],
    default: () => []
  },
  salary: {
    type: Object as () => [number, number] | null,
    default: null
  }
})

// 定义 emit
const emit = defineEmits([
  'update:education',
  'update:experience',
  'update:salary',
  'filter-change'
])

// 已选择的筛选条件
const selectedEducation = ref<string[]>(props.education || [])
const selectedExperience = ref<string[]>(props.experience || [])
const selectedSalary = ref<[number, number] | null>(props.salary)

// 薪资滑块
const salaryMinIndex = ref(0)
const salaryMaxIndex = ref(50)

// 监听 props 变化
watch(() => props.education, (newVal) => {
  selectedEducation.value = newVal || []
}, { deep: true })

watch(() => props.experience, (newVal) => {
  selectedExperience.value = newVal || []
}, { deep: true })

watch(() => props.salary, (newVal) => {
  selectedSalary.value = newVal
  updateSalarySliders()
}, { deep: true })

// 监听滑块变化
watch([salaryMinIndex, salaryMaxIndex], () => {
  if (Number(salaryMinIndex.value) > Number(salaryMaxIndex.value)) {
    // 确保最小值不大于最大值
    salaryMinIndex.value = salaryMaxIndex.value
  }
  
  // 计算实际薪资值
  const min = Math.floor(Number(salaryMinIndex.value) / 50 * 200000)
  const max = Math.floor(Number(salaryMaxIndex.value) / 50 * 200000)
  
  selectedSalary.value = [min, max]
  emit('update:salary', selectedSalary.value)
  emitFilterChange()
})

// 更新滑块位置
const updateSalarySliders = () => {
  if (selectedSalary.value) {
    const [min, max] = selectedSalary.value
    salaryMinIndex.value = Math.floor(min / 200000 * 50)
    salaryMaxIndex.value = Math.floor(max / 200000 * 50)
  } else {
    salaryMinIndex.value = 0
    salaryMaxIndex.value = 50
  }
}

// 计算薪资滑块位置
const salaryLeftPercent = computed(() => {
  return (Number(salaryMinIndex.value) / 50) * 100
})

const salaryRangePercent = computed(() => {
  return ((Number(salaryMaxIndex.value) - Number(salaryMinIndex.value)) / 50) * 100
})

// 格式化薪资范围显示
const formattedSalaryRange = computed(() => {
  if (!selectedSalary.value) {
    return '不限'
  }
  
  const [min, max] = selectedSalary.value
  
  const formatSalary = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}w`
    }
    return `${(value / 1000).toFixed(0)}k`
  }
  
  return `${formatSalary(min)} - ${formatSalary(max)}`
})

// 判断薪资范围是否被选中
const isSalaryRangeSelected = (index: number) => {
  if (!selectedSalary.value) return false
  
  const range = salaryRanges[index].value
  const [selectedMin, selectedMax] = selectedSalary.value
  
  return selectedMin === range[0] && selectedMax === range[1]
}

// 选择预设薪资范围
const selectSalaryRange = (index: number) => {
  const range = salaryRanges[index].value
  selectedSalary.value = [range[0], range[1]]
  updateSalarySliders()
  emit('update:salary', selectedSalary.value)
  emitFilterChange()
}

// 切换教育背景
const toggleEducation = (education: FilterItem) => {
  const index = selectedEducation.value.indexOf(education.value)
  if (index === -1) {
    selectedEducation.value.push(education.value)
  } else {
    selectedEducation.value.splice(index, 1)
  }
  emit('update:education', selectedEducation.value)
  emitFilterChange()
}

// 切换工作经验
const toggleExperience = (experience: FilterItem) => {
  const index = selectedExperience.value.indexOf(experience.value)
  if (index === -1) {
    selectedExperience.value.push(experience.value)
  } else {
    selectedExperience.value.splice(index, 1)
  }
  emit('update:experience', selectedExperience.value)
  emitFilterChange()
}

// 所有活跃的筛选条件
const activeFilters = computed(() => {
  const filters: FilterItem[] = []
  
  // 添加教育背景筛选
  selectedEducation.value.forEach(value => {
    const education = educationOptions.find(option => option.value === value)
    if (education) {
      filters.push({
        value,
        label: education.label,
        type: 'education'
      })
    }
  })
  
  // 添加工作经验筛选
  selectedExperience.value.forEach(value => {
    const experience = experienceOptions.find(option => option.value === value)
    if (experience) {
      filters.push({
        value,
        label: experience.label,
        type: 'experience'
      })
    }
  })
  
  // 添加薪资范围筛选
  if (selectedSalary.value) {
    filters.push({
      value: 'salary',
      label: formattedSalaryRange.value,
      type: 'salary'
    })
  }
  
  return filters
})

// 是否有活跃的筛选条件
const hasActiveFilters = computed(() => {
  return activeFilters.value.length > 0
})

// 移除筛选条件
const removeFilter = (filter: FilterItem) => {
  if (filter.type === 'education') {
    const index = selectedEducation.value.indexOf(filter.value)
    if (index !== -1) {
      selectedEducation.value.splice(index, 1)
      emit('update:education', selectedEducation.value)
    }
  } else if (filter.type === 'experience') {
    const index = selectedExperience.value.indexOf(filter.value)
    if (index !== -1) {
      selectedExperience.value.splice(index, 1)
      emit('update:experience', selectedExperience.value)
    }
  } else if (filter.type === 'salary') {
    selectedSalary.value = null
    emit('update:salary', null)
    updateSalarySliders()
  }
  
  emitFilterChange()
}

// 清空所有筛选条件
const clearFilters = () => {
  selectedEducation.value = []
  selectedExperience.value = []
  selectedSalary.value = null
  
  emit('update:education', [])
  emit('update:experience', [])
  emit('update:salary', null)
  
  updateSalarySliders()
  emitFilterChange()
}

// 发送筛选条件变化事件
const emitFilterChange = () => {
  emit('filter-change', {
    education: selectedEducation.value,
    experience: selectedExperience.value,
    salary: selectedSalary.value
  })
}

// 组件初始化
onMounted(() => {
  updateSalarySliders()
})
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  height: 20px;
  margin: 0;
  background: transparent;
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
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style> 