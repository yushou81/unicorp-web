<template>
  <div class="sticky top-24 space-y-6">
    <!-- 资源类型 -->
    <FilterCard title="资源类型">
      <CheckboxFilter
        title="类型"
        :options="resourceTypes"
        v-model="filters.resourceTypes"
      />
    </FilterCard>

    <!-- 资源统计 -->
    <FilterCard title="资源统计">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">总共资源</span>
          <span class="font-bold text-blue-600">{{ stats.total }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">可用资源</span>
          <span class="font-bold text-blue-600">{{ stats.available }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">本月新增</span>
          <span class="font-bold text-blue-600">{{ stats.newThisMonth }}</span>
        </div>
      </div>
    </FilterCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FilterCard from '@/components/job/FilterCard.vue'
import CheckboxFilter from '@/components/job/CheckboxFilter.vue'

interface Filters {
  resourceTypes: string[];
}

const props = defineProps({
  resourceTypes: {
    type: Array as () => string[],
    default: () => ['实验设备', '技术文档', '数据集', '教学案例', '课件', '精品课程', '著作权', '专利']
  },
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      available: 0,
      newThisMonth: 0
    })
  }
})

const emit = defineEmits(['update:filters'])

const filters = ref<Filters>({
  resourceTypes: []
})

// 监听筛选条件变化，向父组件发送更新事件
watch(filters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })
</script> 