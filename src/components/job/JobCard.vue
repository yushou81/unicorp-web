<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center mb-3">
            <h3 class="font-bold text-xl text-gray-900">{{ job.title }}</h3>
            <span v-if="job.isHot" class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">热门</span>
            <span v-if="job.isNew" class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">新发布</span>
          </div>
          
          <p class="text-blue-600 font-medium mb-3">{{ job.company }}</p>
          
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div class="flex items-center">
              <MapPinIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ job.location }}</span>
            </div>
            <div class="flex items-center">
              <BanknoteIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ job.salary }}</span>
            </div>
            <div class="flex items-center">
              <BriefcaseIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ job.type }}</span>
            </div>
            <div class="flex items-center">
              <GraduationCapIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ job.education }}</span>
            </div>
          </div>
          
          <p class="text-gray-600 mb-4 line-clamp-2">{{ job.description }}</p>
          
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(tag, index) in job.tags" 
              :key="index"
              class="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="flex flex-col items-end space-y-3 ml-4">
          <router-link :to="`/job/${job.id}`">
            <Button size="sm" class="px-5">查看详情</Button>
          </router-link>
          <Button variant="outline" size="sm" @click="onCollect" class="flex items-center">
            <BookmarkIcon class="w-4 h-4 mr-1.5" />
            收藏
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon, BriefcaseIcon, BanknoteIcon, BookmarkIcon, GraduationCapIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  education: string;
  description: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
}

const props = defineProps<{
  job: Job
}>()

const emit = defineEmits(['collect'])

const onCollect = () => {
  emit('collect', props.job.id)
}
</script> 