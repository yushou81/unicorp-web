<template>
  <div class="relative category-selector">
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
        class="absolute z-10 w-[500px] mt-1 bg-white border border-gray-300 rounded-md shadow-lg left-0 category-dropdown"
      >
        <!-- 搜索框 -->
        <div class="p-3 border-b border-gray-200">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="搜索职位分类"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="searchQuery" class="p-3">
          <div class="text-sm text-gray-500 mb-2">搜索结果</div>
          <div class="grid grid-cols-3 gap-2">
            <div 
              v-for="item in filteredCategories" 
              :key="item.value"
              @click="selectCategory(item)"
              class="px-3 py-1 rounded cursor-pointer text-sm transition-colors"
              :class="isSelected(item) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'"
            >
              {{ item.label }}
            </div>
            <div v-if="filteredCategories.length === 0" class="col-span-3 text-sm text-gray-500">
              没有找到匹配的职位分类
            </div>
          </div>
        </div>

        <!-- 多级分类选择 -->
        <div v-else class="flex max-h-[400px] overflow-hidden">
          <!-- 第一级分类 -->
          <div class="w-1/3 border-r border-gray-200 overflow-y-auto max-h-[400px]">
            <div 
              v-for="category in mainCategories" 
              :key="category.value"
              @click="selectMainCategory(category)"
              class="px-4 py-3 cursor-pointer text-sm hover:bg-gray-50 transition-colors border-l-2"
              :class="[
                currentMainCategory?.value === category.value 
                  ? 'border-l-blue-500 bg-blue-50 text-blue-600 font-medium' 
                  : 'border-l-transparent text-gray-700'
              ]"
            >
              {{ category.label }}
            </div>
          </div>
          
          <!-- 第二级分类 -->
          <div v-if="currentMainCategory" class="w-1/3 border-r border-gray-200 overflow-y-auto max-h-[400px]">
            <div 
              v-for="subCategory in currentMainCategory.children" 
              :key="subCategory.value"
              @click="selectSubCategory(subCategory)"
              class="px-4 py-3 cursor-pointer text-sm hover:bg-gray-50 transition-colors border-l-2"
              :class="[
                currentSubCategory?.value === subCategory.value 
                  ? 'border-l-blue-500 bg-blue-50 text-blue-600 font-medium' 
                  : 'border-l-transparent text-gray-700'
              ]"
            >
              {{ subCategory.label }}
            </div>
          </div>
          
          <!-- 第三级分类/具体职位 -->
          <div v-if="currentSubCategory && currentSubCategory.children" class="w-1/3 overflow-y-auto max-h-[400px]">
            <div 
              v-for="job in currentSubCategory.children" 
              :key="job.value"
              @click="selectJob(job)"
              class="px-4 py-3 cursor-pointer text-sm hover:bg-gray-50 transition-colors"
              :class="isSelected(job) ? 'text-blue-500 font-medium' : 'text-gray-700'"
            >
              {{ job.label }}
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="flex justify-between p-3 border-t border-gray-200">
          <button 
            @click="clearSelection" 
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            清空
          </button>
          <button 
            @click="confirmSelection" 
            class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
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

interface Category {
  value: string;
  label: string;
  children?: Category[];
}

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择职位分类'
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'change']);

// 组件状态
const isOpen = ref(false);
const searchQuery = ref('');
const currentMainCategory = ref<Category | null>(null);
const currentSubCategory = ref<Category | null>(null);
// 临时存储选择的值，确认前不会触发change事件
const tempSelectedValue = ref('');

// 职位分类数据 - 三级结构
const mainCategories = [
  { 
    value: 'software', 
    label: '软件开发',
    children: [
      { 
        value: 'backend', 
        label: '后端开发',
        children: [
          { value: 'java', label: 'Java' },
          { value: 'cpp', label: 'C++' },
          { value: 'php', label: 'PHP' },
          { value: 'golang', label: 'Golang' },
          { value: 'security', label: '安全工程师' }
        ]
      },
      { 
        value: 'frontend', 
        label: '前端开发',
        children: [
          { value: 'web', label: 'Web前端' },
          { value: 'hybrid', label: '混合开发' },
          { value: 'js', label: 'JavaScript' },
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' }
        ]
      },
      { 
        value: 'mobile', 
        label: '客户端开发',
        children: [
          { value: 'android', label: 'Android' },
          { value: 'ios', label: 'iOS' },
          { value: 'flutter', label: 'Flutter' },
          { value: 'reactnative', label: 'React Native' }
        ]
      },
      { 
        value: 'testing', 
        label: '测试',
        children: [
          { value: 'autotest', label: '自动化测试' },
          { value: 'performance', label: '性能测试' },
          { value: 'security_test', label: '安全测试' }
        ]
      },
      { 
        value: 'data', 
        label: '数据',
        children: [
          { value: 'data_analysis', label: '数据分析' },
          { value: 'data_mining', label: '数据挖掘' },
          { value: 'data_engineer', label: '数据工程师' }
        ]
      }
    ]
  },
  { 
    value: 'hardware', 
    label: '通信/硬件',
    children: [
      { 
        value: 'communication', 
        label: '通信工程',
        children: [
          { value: 'network', label: '网络工程师' },
          { value: 'wireless', label: '无线通信工程师' }
        ]
      },
      { 
        value: 'hardware_dev', 
        label: '硬件开发',
        children: [
          { value: 'embedded', label: '嵌入式开发' },
          { value: 'circuit', label: '电路设计' }
        ]
      }
    ]
  },
  { 
    value: 'manufacturing', 
    label: '机械/制造',
    children: [
      { 
        value: 'mechanical', 
        label: '机械工程',
        children: [
          { value: 'design', label: '机械设计' },
          { value: 'automation', label: '自动化' }
        ]
      }
    ]
  },
  { 
    value: 'product', 
    label: '产品/项目/运营',
    children: [
      { 
        value: 'product_manager', 
        label: '产品经理',
        children: [
          { value: 'internet_pm', label: '互联网产品经理' },
          { value: 'mobile_pm', label: '移动产品经理' }
        ]
      },
      { 
        value: 'project_manager', 
        label: '项目经理',
        children: [
          { value: 'it_pm', label: 'IT项目经理' },
          { value: 'erp_pm', label: 'ERP项目经理' }
        ]
      }
    ]
  },
  { 
    value: 'finance', 
    label: '金融',
    children: [
      { 
        value: 'investment', 
        label: '投资',
        children: [
          { value: 'stock', label: '股票投资' },
          { value: 'fund', label: '基金' }
        ]
      },
      { 
        value: 'banking', 
        label: '银行',
        children: [
          { value: 'personal_banking', label: '个人银行' },
          { value: 'corporate_banking', label: '企业银行' }
        ]
      }
    ]
  }
];

// 获取所有可选项（用于搜索）
const allOptions = computed(() => {
  const options: Category[] = [];
  
  const extractOptions = (categories: Category[]) => {
    categories.forEach(category => {
      if (category.children) {
        category.children.forEach(subCategory => {
          if (subCategory.children) {
            subCategory.children.forEach(job => {
              options.push(job);
            });
          } else {
            options.push(subCategory);
          }
        });
      } else {
        options.push(category);
      }
    });
  };
  
  extractOptions(mainCategories);
  return options;
});

// 根据搜索过滤分类
const filteredCategories = computed(() => {
  if (!searchQuery.value) return [];
  
  return allOptions.value.filter(item => 
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 判断选项是否已选中
const isSelected = (category: Category) => {
  return tempSelectedValue.value === category.value || props.modelValue === category.value;
};

// 切换下拉框显示状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    // 打开下拉框时，将当前值复制到临时值
    tempSelectedValue.value = props.modelValue;
    // 如果已有选中值，尝试找到并设置对应的分类层级
    if (props.modelValue) {
      findAndSetSelectedPath();
    }
  }
};

// 根据当前选中值找到并设置对应的分类路径
const findAndSetSelectedPath = () => {
  for (const main of mainCategories) {
    if (main.children) {
      for (const sub of main.children) {
        if (sub.children) {
          const job = sub.children.find(job => job.value === props.modelValue);
          if (job) {
            currentMainCategory.value = main;
            currentSubCategory.value = sub;
            return;
          }
        }
        if (sub.value === props.modelValue) {
          currentMainCategory.value = main;
          currentSubCategory.value = null;
          return;
        }
      }
    }
    if (main.value === props.modelValue) {
      currentMainCategory.value = main;
      currentSubCategory.value = null;
      return;
    }
  }
};

// 关闭下拉框
const closeDropdown = () => {
  isOpen.value = false;
};

// 选择主分类
const selectMainCategory = (category: Category) => {
  currentMainCategory.value = category;
  currentSubCategory.value = null;
};

// 选择子分类
const selectSubCategory = (category: Category) => {
  currentSubCategory.value = category;
  
  // 如果没有第三级，直接选择这个子分类
  if (!category.children || category.children.length === 0) {
    selectCategory(category);
  }
};

// 选择具体职位
const selectJob = (job: Category) => {
  selectCategory(job);
};

// 选择任意级别的分类
const selectCategory = (category: Category) => {
  // 只更新临时值和modelValue，不触发change事件
  tempSelectedValue.value = category.value;
  emit('update:modelValue', category.value);
};

// 清空选择
const clearSelection = () => {
  tempSelectedValue.value = '';
  emit('update:modelValue', '');
  currentMainCategory.value = null;
  currentSubCategory.value = null;
  // 不关闭下拉框，等用户点击确认按钮
};

// 确认选择
const confirmSelection = () => {
  // 只在确认时触发change事件
  emit('change', props.modelValue);
  closeDropdown();
};

// 计算显示的标签
const selectedLabel = computed(() => {
  if (!props.modelValue) {
    return '';
  }
  
  const findLabel = (categories: Category[]): string | null => {
    for (const category of categories) {
      if (category.value === props.modelValue) {
        return category.label;
      }
      if (category.children) {
        const label = findLabel(category.children);
        if (label) return label;
      }
    }
    return null;
  };
  
  return findLabel(mainCategories) || '';
});

// 监听搜索查询变化
watch(searchQuery, () => {
  // 清空当前选择的分类层级
  if (searchQuery.value) {
    currentMainCategory.value = null;
    currentSubCategory.value = null;
  }
});

// 处理点击外部事件
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const selectorEl = document.querySelector('.category-selector') as HTMLElement;
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
</style> 