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
              <tr v-for="member in members" :key="member.userId" class="border-b">
                <td class="px-4 py-2 text-center">{{ member.studentName }}</td>
                <td class="px-4 py-2 text-center">{{ member.joinedAt ? dayjs(member.joinedAt).format('YYYY-MM-DD HH:mm:ss') : '-' }}</td>
                <td class="px-4 py-2 text-center">
                  <a v-if="member.reason" href="javascript:void(0)" class="text-blue-600 underline cursor-pointer" @click="openDialog(member.reason)">查看详情</a>
                  <span v-else>-</span>
                </td>
                <td class="px-4 py-2 text-center">
                  <button @click="removeMember(member.userId, member.projectId)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">移除</button>
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
                <td class="px-4 py-2 text-center">{{ app.appliedAt ? dayjs(app.appliedAt).format('YYYY-MM-DD HH:mm:ss') : '-' }}</td>
                <td class="px-4 py-2 text-center">
                  <a
                    v-if="app.applicationStatement"
                    href="javascript:void(0)"
                    class="text-blue-600 underline cursor-pointer"
                    @click="openDialog(app.applicationStatement)"
                  >查看详情</a>
                  <span v-else>-</span>
                </td>
                <td class="px-4 py-2 text-center">
                  <button v-if="app.status === 'submitted'" @click="approve(app.id)" class="px-2 py-1 bg-green-500 text-white rounded text-xs mr-2">同意</button>
                  <button v-if="app.status === 'submitted'" @click="reject(app.id)" class="px-2 py-1 bg-red-400 text-white rounded text-xs">拒绝</button>
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
    <!-- 弹窗 -->
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button @click="closeDialog" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        <h3 class="text-lg font-bold mb-4">申请表详情</h3>
        <pre class="whitespace-pre-wrap text-gray-800">{{ dialogContent }}</pre>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getProjectApplications, updateApplicationStatus, removeProjectMember } from '@/lib/api/project'
  import dayjs from 'dayjs'
  import { getProjectMembers } from '@/lib/api/project'
  
  const router = useRouter()
  const route = useRoute()
  const tab = ref<'members' | 'applicants'>('members')
  const applicants = ref<any[]>([])
  const members = ref<any[]>([])
  
  const activeTabClass = 'px-6 py-2 bg-blue-600 text-white font-semibold rounded-t-lg border-b-2 border-blue-600'
  const inactiveTabClass = 'px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-t-lg border-b-2 border-transparent hover:bg-blue-100'
  
  // 新增弹窗相关
  const showDialog = ref(false)
  const dialogContent = ref('')

  async function fetchMembers() {
    const projectId = Number(route.params.id)
    const res = await getProjectMembers(projectId)
    members.value = (res.data || []).map((m: any) => ({
      ...m,
      studentName: m.realName || '-',
      joinedAt: m.joinedAt || '-',
      reason: m.applicationStatement || '-',
      userId: m.userId,
      projectId: projectId
    }))
  }
  
  async function fetchApplications() {
    const projectId = Number(route.params.id)
    const res = await getProjectApplications(projectId)
    applicants.value = (res.data || []).filter((a: any) => a.status === 'submitted').map((a: any) => ({
      ...a,
      studentName: a.applicantProfile?.realName || a.applicantProfile?.nickname || '-',
      appliedAt: a.createdAt,
      reason: a.applicationStatement,
    }))
  }
  
  // 监听 tab 变化，切换时拉取对应数据
  watch(tab, (val) => {
    if (val === 'members') {
      fetchMembers()
    } else {
      fetchApplications()
    }
  })

  // 页面初始时根据默认 tab 拉取数据
  onMounted(() => {
    if (tab.value === 'members') {
      fetchMembers()
    } else {
      fetchApplications()
    }
  })
  
  async function approve(appId: number) {
    if (confirm('确定要同意该申请吗？')) {
      await updateApplicationStatus(appId, { status: 'approved' })
      fetchApplications()
    }
  }
  async function reject(appId: number) {
    if (confirm('确定要拒绝该申请吗？')) {
      await updateApplicationStatus(appId, { status: 'rejected' })
      fetchApplications()
    }
  }
  
  // 移除成员（本质上就是把成员状态设为rejected或调用后端移除接口）
  async function removeMember(memberId: number, projectId: number) {
    if (confirm('确定要移除该成员吗？')) {
      await removeProjectMember(memberId, projectId)
      fetchMembers()
    }
  }
  
  function goBack() {
    router.back()
  }
  
  // 打开弹窗
  function openDialog(content: string) {
    dialogContent.value = content
    showDialog.value = true
  }
  
  // 关闭弹窗
  function closeDialog() {
    showDialog.value = false
    dialogContent.value = ''
  }
  </script>