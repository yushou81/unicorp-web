<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
          <span class="text-2xl text-indigo-600">📚</span>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ research.title }}</h3>
            <p class="text-indigo-600 font-medium">{{ research.type }}</p>
          </div>
          <span 
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              research.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ research.isVerified ? '已认证' : '待认证' }}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ research.abstract }}</p>
        <div class="mt-2 flex items-center text-sm text-gray-500 space-x-4">
          <span>发表时间: {{ formatDate(research.publishDate) }}</span>
          <span>发表单位: {{ research.publisher }}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
          <span 
            v-for="author in research.authors" 
            :key="author"
            class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
          >
            {{ author }}
          </span>
        </div>
        <div class="mt-2 flex items-center space-x-2 text-sm text-gray-500">
          <span v-if="research.doi">DOI: {{ research.doi }}</span>
          <span v-if="research.patentNo">专利号: {{ research.patentNo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Research {
  id: number
  title: string
  type: '论文' | '专利' | '著作' | '项目' | string
  abstract: string
  isVerified: boolean
  publishDate: string
  publisher: string
  authors: string[]
  doi?: string
  patentNo?: string
}

interface Props {
  research: Research
}

const props = defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script> 