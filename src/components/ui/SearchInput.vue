<template>
  <div class="relative">
    <input 
      type="text" 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="w-full px-3 py-2 border border-gray-200 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
    <SearchIcon v-if="!modelValue" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <XIcon 
      v-else 
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" 
      @click="$emit('update:modelValue', '')"
    />
  </div>
</template>

<script setup lang="ts">
import { SearchIcon, XIcon } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: '搜索...'
  }
})

defineEmits(['update:modelValue'])
</script> 