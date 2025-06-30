<template>
  <div class="bg-white rounded-2xl shadow-lg p-8 mb-10">
    <h2 class="text-xl font-bold text-blue-700 mb-4">全部岗位申请汇总</h2>
    <div v-if="allApplicationsLoading" class="text-center py-8">加载中...</div>
    <div v-else>
      <div v-if="allApplications.length === 0" class="text-gray-400 text-center py-8">暂无申请人</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm rounded-xl overflow-hidden shadow border border-gray-100">
          <thead>
            <tr class="bg-blue-50 text-blue-800 font-semibold text-center">
              <th class="py-3 px-2">岗位</th>
              <th class="py-3 px-2">姓名</th>
              <th class="py-3 px-2">简历</th>
              <th class="py-3 px-2">申请状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(app, idx) in allApplications" :key="app.id" :class="[idx % 2 === 0 ? 'bg-white' : 'bg-gray-50', 'hover:bg-blue-50 transition']">
              <td class="py-2 px-2 text-center">{{ app.jobTitle || '-' }}</td>
              <td class="py-2 px-2 text-center">{{ app.studentName || app.applicantName || app.userName || '匿名' }}</td>
              <td class="py-2 px-2 text-center">
                <a v-if="app.resumeUrl" :href="app.resumeUrl" target="_blank" class="inline-block px-3 py-1 rounded bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition shadow">下载</a>
                <span v-else class="text-gray-400">无</span>
              </td>
              <td class="py-2 px-2 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <select v-model="applicationStatusMap[app.id]" class="px-2 py-1 border rounded text-xs">
                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                  <button @click="$emit('update-status', app)" class="px-2 py-1 rounded bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition">更新</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  allApplications: Array,
  allApplicationsLoading: Boolean,
  applicationStatusMap: Object,
  statusOptions: Array
})
const emit = defineEmits(['update-status'])
</script> 