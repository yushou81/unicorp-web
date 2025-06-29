<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div class="container mx-auto px-4">
        <!-- 返回按钮 -->
        <div class="mb-4">
          <button @click="goBack" class="text-blue-600 hover:underline flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">项目人员管理</h2>
        <!-- 切换按钮 -->
        <div class="flex justify-center mb-6">
          <button
            :class="tab === 'members' ? activeTabClass : inactiveTabClass"
            @click="tab = 'members'"
          >已加入人员</button>
          <button
            :class="tab === 'applicants' ? activeTabClass : inactiveTabClass"
            @click="tab = 'applicants'"
          >申请加入人员</button>
        </div>

        <!-- 已加入人员列表 -->
        <div v-if="tab === 'members'">
          <table class="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-sm">
                <th class="px-4 py-2">姓名</th>
                <th class="px-4 py-2">加入时间</th>
                <th class="px-4 py-2">申请理由</th>
                <th class="px-4 py-2">管理</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in members" :key="member.id" class="border-b">
                <td class="px-4 py-2 text-center">{{ member.studentName }}</td>
                <td class="px-4 py-2 text-center">{{ member.joinedAt || '-' }}</td>
                <td class="px-4 py-2 text-center">
                  <span v-if="member.reason">{{ member.reason.slice(0, 30) }}<span v-if="member.reason.length > 30">...</span></span>
                  <span v-else>-</span>
                </td>
                <td class="px-4 py-2 text-center">
                  <button @click="removeMember(member.id)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">移除</button>
                </td>
              </tr>
              <tr v-if="members.length === 0">
                <td colspan="4" class="text-center text-gray-400 py-4">暂无成员</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 申请人列表 -->
        <div v-else>
          <table class="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-sm">
                <th class="px-4 py-2">姓名</th>
                <th class="px-4 py-2">申请时间</th>
                <th class="px-4 py-2">申请理由</th>
                <th class="px-4 py-2">管理</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applicants" :key="app.id" class="border-b">
                <td class="px-4 py-2 text-center">{{ app.studentName }}</td>
                <td class="px-4 py-2 text-center">{{ app.appliedAt || '-' }}</td>
                <td class="px-4 py-2 text-center">
                  <span v-if="app.reason">{{ app.reason.slice(0, 30) }}<span v-if="app.reason.length > 30">...</span></span>
                  <span v-else>-</span>
                </td>
                <td class="px-4 py-2 text-center">
                  <button v-if="app.status === 'pending'" @click="approve(app.id)" class="px-2 py-1 bg-green-500 text-white rounded text-xs mr-2">同意</button>
                  <button v-if="app.status === 'pending'" @click="reject(app.id)" class="px-2 py-1 bg-red-400 text-white rounded text-xs">拒绝</button>
                </td>
              </tr>
              <tr v-if="applicants.length === 0">
                <td colspan="4" class="text-center text-gray-400 py-4">暂无申请人</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getProjectApplications, updateApplicationStatus } from '@/lib/api/project'
  
  const router = useRouter()
  const route = useRoute()
  const tab = ref<'members' | 'applicants'>('members')
  const applicants = ref<any[]>([])
  const members = ref<any[]>([])
  
  const activeTabClass = 'px-6 py-2 bg-blue-600 text-white font-semibold rounded-t-lg border-b-2 border-blue-600'
  const inactiveTabClass = 'px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-t-lg border-b-2 border-transparent hover:bg-blue-100'
  
  async function fetchApplications() {
    const projectId = Number(route.params.id)
    const res = await getProjectApplications(projectId)
    const all = res.data?.records || []
    applicants.value = all.filter((a: any) => a.status === 'pending')
    members.value = all.filter((a: any) => a.status === 'approved')
  }
  
  async function approve(appId: number) {
    await updateApplicationStatus(appId, { status: 'approved' })
    fetchApplications()
  }
  async function reject(appId: number) {
    await updateApplicationStatus(appId, { status: 'rejected' })
    fetchApplications()
  }
  
  // 移除成员（本质上就是把成员状态设为rejected或调用后端移除接口）
  async function removeMember(appId: number) {
    if (confirm('确定要移除该成员吗？')) {
      await updateApplicationStatus(appId, { status: 'rejected' })
      fetchApplications()
    }
  }
  
  function goBack() {
    router.back()
  }
  
  onMounted(fetchApplications)
  </script>