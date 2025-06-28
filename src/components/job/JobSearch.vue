<template>
  <div class="bg-white rounded-lg shadow-lg p-4 flex flex-wrap gap-3 items-center">
    <div class="flex-1 min-w-[240px]">
      <div class="relative">
        <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          v-model="keyword"
          placeholder="搜索职位名称、公司或关键词"
          class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>
    </div>
    
    <select 
      v-model="location" 
      class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
    >
      <option value="" class="text-gray-900">所有地区</option>
      <option v-for="loc in locations" :key="loc" :value="loc" class="text-gray-900">{{ loc }}</option>
    </select>
    
    <select 
      v-model="jobType" 
      class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
    >
      <option value="" class="text-gray-900">所有类型</option>
      <option v-for="type in jobTypes" :key="type" :value="type" class="text-gray-900">{{ type }}</option>
    </select>
    
    <Button @click="search" class="bg-blue-600 hover:bg-blue-700 py-3 px-6">
      <SearchIcon class="w-5 h-5 mr-2" />
      搜索
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  locations: {
    type: Array as () => string[],
    default: () => ['北京', '上海', '深圳', '广州', '杭州']
  },
  jobTypes: {
    type: Array as () => string[],
    default: () => ['实习', '校招', '全职', '兼职']
  }
})

const emit = defineEmits(['search'])

const keyword = ref('')
const location = ref('')
const jobType = ref('')

const search = () => {
  emit('search', {
    keyword: keyword.value,
    location: location.value,
    jobType: jobType.value
  })
}
</script> 