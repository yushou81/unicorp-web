<template>
  <div>
    <!-- 搜索框 -->
    <div class="mb-3">
      <SearchInput 
        v-model="searchQuery" 
        :placeholder="`搜索${title}...`"
      />
    </div>
    
    <div class="space-y-2 max-h-40 overflow-y-auto">
      <label 
        v-for="option in filteredOptions" 
        :key="option" 
        class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 py-1"
      >
        <input 
          type="checkbox" 
          class="rounded text-blue-600" 
          :value="option" 
          :checked="modelValue.includes(option)"
          @change="toggleOption(option)"
        />
        <span>{{ option }}</span>
      </label>
      
      <div v-if="filteredOptions.length === 0" class="text-gray-500 text-sm py-2 text-center">
        没有找到匹配的{{ title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchInput from '@/components/ui/SearchInput.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => string[],
    required: true
  },
  modelValue: {
    type: Array as () => string[],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  return props.options.filter(option => 
    option.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleOption = (option: string) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(option)
  
  if (index === -1) {
    newValue.push(option)
  } else {
    newValue.splice(index, 1)
  }
  
  emit('update:modelValue', newValue)
}
</script> 