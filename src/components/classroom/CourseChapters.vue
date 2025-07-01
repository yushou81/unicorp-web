<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">课程大纲</h2>
    <div class="space-y-4">
      <div v-for="(chapter, index) in chapters" :key="index" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium text-gray-900">第{{ index + 1 }}章：{{ chapter.title }}</h3>
          <span class="text-sm text-gray-500">{{ chapter.duration }}</span>
        </div>
        <p class="text-gray-600 text-sm">{{ chapter.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Chapter {
  title: string
  description: string
  duration: string
}

const props = defineProps<{
  chapters: Chapter[]
}>()
</script> 