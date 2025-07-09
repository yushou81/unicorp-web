<template>
  <div class="space-y-6">
    <!-- 项目名称 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">
        项目名称 <span class="text-red-500">*</span>
      </label>
      <input
        v-model="modelValue.title"
        type="text"
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        placeholder="请输入项目名称"
      />
    </div>

    <!-- 项目描述 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">
        项目描述 <span class="text-red-500">*</span>
      </label>
      <textarea
        v-model="modelValue.description"
        rows="5"
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        placeholder="请详细描述项目内容、目标、技术要求等"
      ></textarea>
    </div>

    <!-- 项目领域 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">
        项目领域 <span class="text-red-500">*</span>
      </label>
      <select
        v-model="modelValue.field"
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      >
        <option value="">请选择项目领域</option>
        <option v-for="field in fields" :key="field" :value="field">{{ field }}</option>
      </select>
    </div>

    <!-- 预算 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">
        项目预算（元）<span class="text-red-500">*</span>
      </label>
      <input
        v-model="modelValue.budget"
        type="number"
        min="0"
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        placeholder="请输入项目预算金额"
      />
    </div>

    <!-- 联系方式 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">
        联系方式 <span class="text-red-500">*</span>
      </label>
      <input
        v-model="modelValue.contact"
        type="text"
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        placeholder="请输入联系人姓名和电话"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// 项目领域选项
const fields = [
  '智能制造',
  '人工智能',
  '大数据',
  '云计算',
  '物联网',
  '区块链',
  '新能源',
  '生物医药',
  '其他'
];
</script> 