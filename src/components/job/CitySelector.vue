<template>
  <div class="relative city-selector">
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
        class="absolute z-10 w-[500px] mt-1 bg-white border border-gray-300 rounded-md shadow-lg left-0 city-dropdown"
      >
        <!-- 搜索框 -->
        <div class="p-3 border-b border-gray-200">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="搜索城市"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div class="flex max-h-[400px]">
          <!-- 已选城市 -->
          <div v-if="selectedCity" class="w-full p-3 border-b border-gray-200">
            <div class="text-sm text-gray-500 mb-2">已选城市</div>
            <div class="flex flex-wrap gap-2">
              <div 
                class="flex items-center bg-blue-50 text-blue-600 text-sm px-2 py-1 rounded-md"
              >
                {{ selectedCity.label }}
                <button @click="toggleCity(selectedCity)" class="ml-1 text-blue-400 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex max-h-[400px]">
          <!-- 左侧省份列表 -->
          <div class="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div 
              v-for="province in provinces" 
              :key="province.value"
              @click="selectProvince(province)"
              class="px-4 py-2 cursor-pointer text-sm hover:bg-gray-50"
              :class="{'bg-blue-50 text-blue-600': currentProvince?.value === province.value}"
            >
              <div class="flex items-center justify-between">
                <span>{{ province.label }}</span>
                <svg v-if="currentProvince?.value === province.value" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 右侧城市列表 -->
          <div class="w-2/3 overflow-y-auto">
            <div v-if="searchQuery" class="p-3">
              <div class="text-sm text-gray-500 mb-2">搜索结果</div>
              <div class="grid grid-cols-3 gap-2">
                <div 
                  v-for="city in filteredCities" 
                  :key="city.value"
                  @click="toggleCity(city)"
                  class="px-3 py-1 rounded cursor-pointer text-sm transition-colors"
                  :class="isCitySelected(city) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'"
                >
                  {{ city.label }}
                </div>
                <div v-if="filteredCities.length === 0" class="col-span-3 text-sm text-gray-500">
                  没有找到匹配的城市
                </div>
              </div>
            </div>
            <div v-else-if="currentProvince" class="p-3">
              <div class="text-sm text-gray-500 mb-2">{{ currentProvince.label }}</div>
              <div class="grid grid-cols-3 gap-2">
                <div 
                  v-for="city in currentProvince.cities" 
                  :key="city.value"
                  @click="toggleCity(city)"
                  class="px-3 py-1 rounded cursor-pointer text-sm transition-colors"
                  :class="isCitySelected(city) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'"
                >
                  {{ city.label }}
                </div>
              </div>
            </div>
            <div v-else class="p-3">
              <div class="text-sm text-gray-500">请选择省份</div>
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

interface City {
  value: string;
  label: string;
}

interface Province {
  value: string;
  label: string;
  cities: City[];
}

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择城市'
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'change']);

// 组件状态
const isOpen = ref(false);
const searchQuery = ref('');
const currentProvince = ref<Province | null>(null);
// 临时存储选择的值，确认前不会触发change事件
const tempSelectedValue = ref<string>('');

// 省份和城市数据
const provinces = [
  {
    value: '北京市',
    label: '北京市',
    cities: [
      { value: '北京', label: '北京' }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    cities: [
      { value: '上海', label: '上海' }
    ]
  },
  {
    value: '广东省',
    label: '广东省',
    cities: [
      { value: '广州', label: '广州' },
      { value: '深圳', label: '深圳' },
      { value: '东莞', label: '东莞' },
      { value: '佛山', label: '佛山' },
      { value: '珠海', label: '珠海' }
    ]
  },
  {
    value: '江苏省',
    label: '江苏省',
    cities: [
      { value: '南京', label: '南京' },
      { value: '苏州', label: '苏州' },
      { value: '无锡', label: '无锡' },
      { value: '常州', label: '常州' },
      { value: '扬州', label: '扬州' }
    ]
  },
  {
    value: '浙江省',
    label: '浙江省',
    cities: [
      { value: '杭州', label: '杭州' },
      { value: '宁波', label: '宁波' },
      { value: '温州', label: '温州' },
      { value: '嘉兴', label: '嘉兴' },
      { value: '绍兴', label: '绍兴' }
    ]
  },
  {
    value: '四川省',
    label: '四川省',
    cities: [
      { value: '成都', label: '成都' },
      { value: '绵阳', label: '绵阳' },
      { value: '乐山', label: '乐山' },
      { value: '德阳', label: '德阳' },
      { value: '宜宾', label: '宜宾' }
    ]
  },
  {
    value: '湖北省',
    label: '湖北省',
    cities: [
      { value: '武汉', label: '武汉' },
      { value: '宜昌', label: '宜昌' },
      { value: '襄阳', label: '襄阳' },
      { value: '荆州', label: '荆州' },
      { value: '黄石', label: '黄石' }
    ]
  }
];

// 获取所有城市的平面列表
const allCities = computed(() => {
  const cities: City[] = [];
  provinces.forEach(province => {
    province.cities.forEach(city => {
      cities.push(city);
    });
  });
  return cities;
});

// 搜索过滤后的城市列表
const filteredCities = computed(() => {
  if (!searchQuery.value) return [];
  
  return allCities.value.filter(city => 
    city.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 获取已选城市对象
const selectedCity = computed(() => {
  if (!props.modelValue) return null;
  
  return allCities.value.find(city => city.value === props.modelValue) || null;
});

// 判断城市是否被选中
const isCitySelected = (city: City) => {
  return props.modelValue === city.value;
};

// 切换城市选择
const toggleCity = (city: City) => {
  tempSelectedValue.value = city.value;
  emit('update:modelValue', city.value);
};

// 切换下拉框显示状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    // 打开下拉框时，将当前值复制到临时值
    tempSelectedValue.value = props.modelValue;
    
    // 如果有选中的城市，尝试找到对应的省份并选中
    if (props.modelValue) {
      const city = allCities.value.find(c => c.value === props.modelValue);
      if (city) {
        const province = provinces.find(p => 
          p.cities.some(c => c.value === city.value)
        );
        if (province) {
          currentProvince.value = province;
        }
      }
    }
  }
};

// 选择省份
const selectProvince = (province: Province) => {
  currentProvince.value = province;
};

// 清空选择
const clearSelection = () => {
  tempSelectedValue.value = '';
  emit('update:modelValue', '');
};

// 确认选择
const confirmSelection = () => {
  emit('change', props.modelValue);
  closeDropdown();
};

// 关闭下拉框
const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = '';
};

// 计算显示的标签
const selectedLabel = computed(() => {
  if (selectedCity.value) {
    return selectedCity.value.label;
  }
  return '';
});

// 监听搜索查询变化
watch(searchQuery, (newValue) => {
  if (newValue) {
    currentProvince.value = null;
  }
});

// 处理点击外部事件
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const selectorEl = document.querySelector('.city-selector') as HTMLElement;
  if (selectorEl && !selectorEl.contains(target) && isOpen.value) {
    // 点击外部时，取消选择，恢复原始值
    emit('update:modelValue', tempSelectedValue.value);
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