<template>
  <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
    <div class="flex items-start space-x-4">
      <!-- 作者头像 -->
      <img
        :src="topic.authorAvatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
        :alt="topic.authorName"
        class="w-12 h-12 rounded-full border border-gray-200"
      />
      
      <div class="flex-1 min-w-0">
        <!-- 话题标题和标签 -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              <router-link
                :to="`/community/topic/${topic.id}`"
                class="hover:text-blue-600 transition"
              >
                {{ topic.title }}
              </router-link>
            </h3>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-sm text-gray-500">{{ topic.categoryName }}</span>
              <span v-if="topic.isSticky" class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">置顶</span>
              <span v-if="topic.isEssence" class="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">精华</span>
            </div>
          </div>
        </div>

        <!-- 话题内容预览 -->
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ topic.content }}</p>

        <!-- 标签 -->
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in topic.tags"
            :key="tag.id"
            class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
          >
            {{ tag.name }}
          </span>
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center space-x-4">
            <span class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ topic.viewCount }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{{ topic.likeCount }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{{ topic.commentCount }}</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span>{{ topic.authorName }}</span>
            <span>{{ formatTime(topic.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TopicVO } from '@/lib/api/community'

interface Props {
  topic: TopicVO
}

defineProps<Props>()

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 