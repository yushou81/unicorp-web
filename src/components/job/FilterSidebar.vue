<template>
  <div class="sticky top-24 space-y-6">
    <!-- 职位类别 -->
    <FilterCard title="职位类别">
      <CheckboxFilter
        title="类别"
        :options="categories"
        v-model="filters.categories"
      />
    </FilterCard>
    
    <!-- 工作地区 -->
    <FilterCard title="工作地区">
      <CheckboxFilter
        title="地区"
        :options="locations"
        v-model="filters.locations"
      />
    </FilterCard>
    
    <!-- 工作类型 -->
    <FilterCard title="工作类型">
      <CheckboxFilter
        title="类型"
        :options="jobTypes"
        v-model="filters.jobTypes"
      />
    </FilterCard>

    <!-- 薪资范围 -->
    <FilterCard title="薪资范围">
      <RadioFilter
        name="salary"
        :options="salaryOptions"
        v-model="filters.salary"
      />
    </FilterCard>

    <!-- 统计数据 -->
    <FilterCard title="招聘统计">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">发布职位</span>
          <span class="font-bold text-blue-600">156</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">合作企业</span>
          <span class="font-bold text-blue-600">42</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">成功就业</span>
          <span class="font-bold text-blue-600">89</span>
        </div>
      </div>
    </FilterCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FilterCard from './FilterCard.vue'
import CheckboxFilter from './CheckboxFilter.vue'
import RadioFilter from './RadioFilter.vue'

interface Filters {
  categories: string[];
  locations: string[];
  jobTypes: string[];
  salary: string;
}

const props = defineProps({
  categories: {
    type: Array as () => string[],
    default: () => ['技术开发', '产品设计', '市场营销', '运营管理', '人力资源']
  },
  locations: {
    type: Array as () => string[],
    default: () => ['北京', '上海', '深圳', '广州', '杭州', '成都', '南京', '武汉', '西安', '重庆']
  },
  jobTypes: {
    type: Array as () => string[],
    default: () => ['实习', '校招', '全职', '兼职', '远程']
  }
})

const emit = defineEmits(['update:filters'])

const filters = ref<Filters>({
  categories: [],
  locations: [],
  jobTypes: [],
  salary: ''
})

// 薪资范围选项
const salaryOptions = [
  { value: '0-5k', label: '5k以下' },
  { value: '5k-10k', label: '5k-10k' },
  { value: '10k-15k', label: '10k-15k' },
  { value: '15k-20k', label: '15k-20k' },
  { value: '20k+', label: '20k以上' }
]

// 监听筛选条件变化，向父组件发送更新事件
watch(filters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })
</script> 