<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <div class="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
          <span class="text-2xl text-yellow-600">🏆</span>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ award.competitionName }}</h3>
            <p class="text-yellow-600 font-medium">{{ award.awardLevel }}</p>
          </div>
          <span 
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              award.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ award.isVerified ? '已认证' : '待认证' }}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ award.description }}</p>
        <div class="mt-2 flex items-center text-sm text-gray-500 space-x-4">
          <span>获奖时间: {{ formatDate(award.awardDate) }}</span>
          <span>颁发单位: {{ award.issuer }}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
          <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            {{ award.category }}
          </span>
          <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            {{ award.level }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Award {
  id: number
  competitionName: string
  awardLevel: string
  description: string
  isVerified: boolean
  awardDate: string
  issuer: string
  category: string
  level: string
}

interface Props {
  award: Award
}

const props = defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script> 