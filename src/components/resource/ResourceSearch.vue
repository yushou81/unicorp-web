<template>
  <div class="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg">
    <form @submit.prevent="handleSearch">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <SearchInput
            placeholder="搜索资源名称、提供方或描述..."
            v-model="searchParams.keyword"
          />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <select
            v-model="searchParams.resourceType"
            class="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500"
          >
            <option value="" class="text-gray-500">所有资源类型</option>
            <option v-for="type in resourceTypes" :key="type" :value="type" class="bg-white text-gray-700">
              {{ type }}
            </option>
          </select>
          <Button type="submit" class="w-full">搜索</Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import SearchInput from '@/components/ui/SearchInput.vue'

const props = defineProps<{
  resourceTypes: string[];
}>()

const emit = defineEmits(['search'])

const searchParams = ref({
  keyword: '',
  resourceType: ''
})

const handleSearch = () => {
  emit('search', { 
    ...searchParams.value
  })
}
</script> 