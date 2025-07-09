<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">{{ title }}</h3>
    <div class="space-y-4">
      <!-- 发起方类型 -->
      <div v-if="showInitiatorType" class="flex flex-col sm:flex-row sm:items-center">
        <span class="mb-2 sm:mb-0 sm:mr-4 font-medium text-gray-700 sm:w-24">发起方类型：</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in initiatorTypeOptions"
            :key="item.value"
            @click="$emit('select-initiator-type', item.value)"
            :class="[
              'px-4 py-1.5 rounded-md font-medium text-sm transition',
              initiatorType === item.value 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
            ]"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
      
      <!-- 项目领域 -->
      <div v-if="showField" class="flex flex-col sm:flex-row sm:items-center">
        <span class="mb-2 sm:mb-0 sm:mr-4 font-medium text-gray-700 sm:w-24">项目领域：</span>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="item in fieldOptions" 
            :key="item" 
            @click="$emit('select-field', item)" 
            :class="[
              'px-4 py-1.5 rounded-md font-medium text-sm transition',
              isFieldSelected(item)
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
            ]"
          >
            {{ item }}
          </button>
        </div>
      </div>
      
      <!-- 项目状态 -->
      <div v-if="showStatus" class="flex flex-col sm:flex-row sm:items-center">
        <span class="mb-2 sm:mb-0 sm:mr-4 font-medium text-gray-700 sm:w-24">项目状态：</span>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="item in statusOptions" 
            :key="item.value" 
            @click="$emit('select-status', item.value)" 
            :class="[
              'px-4 py-1.5 rounded-md font-medium text-sm transition',
              status === item.value
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
            ]"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
      
      <!-- 自定义筛选条件 -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '按条件筛选'
  },
  showInitiatorType: {
    type: Boolean,
    default: true
  },
  showField: {
    type: Boolean,
    default: true
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  initiatorType: {
    type: String,
    default: ''
  },
  selectedFields: {
    type: Array,
    default: () => ['不限']
  },
  status: {
    type: String,
    default: ''
  },
  initiatorTypeOptions: {
    type: Array,
    default: () => [
      { value: '', label: '全部' },
      { value: 'school', label: '学校' },
      { value: 'enterprise', label: '企业' }
    ]
  },
  fieldOptions: {
    type: Array,
    default: () => ['不限', '智能制造', '人工智能', '大数据', '云计算', '物联网', '区块链', '新能源', '生物医药']
  },
  statusOptions: {
    type: Array,
    default: () => [
      { value: '', label: '全部' },
      { value: 'active', label: '待合作' },
      { value: 'matched', label: '已合作' },
      { value: 'closed', label: '已完成' }
    ]
  }
})

defineEmits(['select-initiator-type', 'select-field', 'select-status'])

function isFieldSelected(field: string): boolean {
  return props.selectedFields.includes(field)
}
</script> 