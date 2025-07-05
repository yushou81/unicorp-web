<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { competitionAwardApi } from '@/lib/api/achievement'
import type { CompetitionAwardVO } from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const award = ref<CompetitionAwardVO | null>(null)

const fetchAwardDetail = async () => {
  try {
    loading.value = true
    const response = await competitionAwardApi.getAwardDetail(Number(route.params.id))
    if (response.data) {
      award.value = response.data
    }
  } catch (error) {
    console.error('获取获奖详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAwardDetail()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <div v-else-if="award" class="bg-white rounded-lg shadow-lg p-6">
      <!-- 返回按钮 -->
      <button 
        @click="router.back()"
        class="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
      >
        <span class="mr-2">←</span> 返回
      </button>

      <!-- 标题部分 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">{{ award.competitionName }}</h1>
        <div class="mt-4 flex items-center space-x-4">
          <span 
            :class="award.isVerified ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-600'"
            class="px-2 py-1 rounded text-sm"
          >
            {{ award.isVerified ? '已认证' : '待认证' }}
          </span>
          <span class="text-gray-500">{{ award.awardDate }}</span>
        </div>
      </div>

      <!-- 详情信息 -->
      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">获奖级别</h2>
          <p class="text-gray-600">{{ award.awardLevel }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">主办方</h2>
          <p class="text-gray-600">{{ award.organizer || '暂无信息' }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">团队成员</h2>
          <p class="text-gray-600">{{ award.teamMembers || '暂无信息' }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">获奖描述</h2>
          <p class="text-gray-600 whitespace-pre-line">{{ award.description }}</p>
        </div>

        <div v-if="award.certificateUrl">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">获奖证书</h2>
          <img 
            :src="award.certificateUrl" 
            alt="获奖证书"
            class="max-w-full h-auto rounded-lg shadow"
          >
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600">获奖信息不存在或已被删除</p>
      <button 
        @click="router.back()"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        返回上一页
      </button>
    </div>
  </div>
</template> 