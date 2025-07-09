<template>
  <div class="flex flex-col md:flex-row items-center justify-between py-8 px-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-100 relative">
    <!-- 左侧：头像+身份信息 -->
    <div class="flex items-center space-x-6 flex-1 min-w-0">
      <div class="relative flex items-center space-x-3">
        <img :src="avatar" class="w-28 h-28 rounded-full shadow-2xl border-4 border-white object-cover ring-4 ring-blue-200" />
        <div v-if="verified" class="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow">已认证</div>
      </div>
      <div class="flex flex-col justify-center min-w-0">
        <div class="flex items-center space-x-3 mb-1">
          <span class="text-3xl font-extrabold text-gray-900 truncate">{{ name }}</span>
          <span class="px-3 py-0.5 rounded-full text-sm bg-blue-100 text-blue-700 font-bold tracking-wide">{{ role }}</span>
        </div>
        <div v-if="organization" class="text-gray-500 text-lg font-medium flex items-center space-x-2">
          <span>{{ organization }}</span>
          <span class="text-xs text-gray-400 ml-2">所属组织</span>
        </div>
      </div>
    </div>
    <!-- 中间分割线 -->
    <div class="h-24 w-px bg-blue-100 mx-8 hidden md:block"></div>
    <!-- 右侧：联系方式色块横向排列，编辑按钮单独一行 -->
    <div class="flex flex-col items-center space-y-3 min-w-[220px] w-full md:w-auto mt-6 md:mt-0 mr-12">
      <div class="flex flex-col space-y-2 w-full">
        <div class="flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium flex-1 min-w-0">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z"/></svg>
          {{ phone || '-' }}
        </div>
        <div class="flex items-center px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium flex-1 min-w-0">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.091 7.091a2.25 2.25 0 01-3.182 0L3.409 8.584A2.25 2.25 0 012.75 6.993V6.75"/></svg>
          {{ email || '-' }}
        </div>
      </div>
      <button v-if="editable" @click="handleEdit" class="mt-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition self-end">编辑资料</button>
    </div>
    <!-- 右下角背景logo -->
    <div v-if="organizationLogo" class="pointer-events-none select-none" style="position:absolute;right:2rem;bottom:2rem;z-index:0;">
      <img :src="organizationLogo" class="w-24 h-24 opacity-15" style="object-fit:contain;" />
      <span class="text-xs text-gray-400 mt-1 mr-1 block text-right" style="z-index:1;position:relative;">{{ organization?.includes('学校') ? '学校logo' : '企业logo' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  avatar: string
  name: string
  role: string
  organization?: string
  organizationLogo?: string
  phone?: string
  email?: string
  editable?: boolean
  onEdit?: () => void
  verified?: boolean
}>()

function handleEdit() {
  if (props.onEdit) props.onEdit()
}
</script> 