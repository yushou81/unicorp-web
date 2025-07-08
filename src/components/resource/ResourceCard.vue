<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center mb-3">
            <h3 class="font-bold text-xl text-gray-900">{{ resource.title }}</h3>
            <span v-if="resource.isHot" class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">热门</span>
            <span v-if="resource.isNew" class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">新资源</span>
          </div>
          
          <p class="text-blue-600 font-medium mb-3">{{ resource.provider }}</p>
          
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div class="flex items-center">
              <FolderIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ resource.category }}</span>
            </div>
            <div class="flex items-center">
              <TagIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ resource.type }}</span>
            </div>
            <div class="flex items-center">
              <MapPinIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ resource.location }}</span>
            </div>
            <div class="flex items-center">
              <span 
                class="px-2 py-0.5 rounded text-xs"
                :class="{
                  'bg-green-50 text-green-600': resource.status === '可用',
                  'bg-yellow-50 text-yellow-600': resource.status === '借出',
                  'bg-red-50 text-red-600': resource.status === '维护中',
                  'bg-blue-50 text-blue-600': resource.status === '可交易'
                }"
              >
                {{ resource.status }}
              </span>
            </div>
          </div>
          
          <p class="text-gray-600 mb-4 line-clamp-2">{{ resource.description }}</p>
          
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(tag, index) in resource.tags" 
              :key="index"
              class="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="flex flex-col items-end space-y-3 ml-4">
          <router-link :to="`/resource/${resource.id}`">
            <Button size="sm" class="px-5">查看详情</Button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon, TagIcon, FolderIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

interface Resource {
  id: number;
  title: string;
  provider: string;
  category: string;
  type: string;
  location: string;
  status: string;
  usage: string;
  description: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
}

const props = defineProps<{
  resource: Resource
}>()

// 不再需要收藏功能
const emit = defineEmits([])
</script> 