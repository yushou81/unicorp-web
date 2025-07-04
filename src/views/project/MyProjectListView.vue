<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div class="container mx-auto px-4">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <button
            @click="router.back()"
            class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
        </div>
  
        <!-- 标题 -->
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">项目合作管理</h2>
  
        <!-- 搜索框 -->
        <div class="flex justify-center mb-6">
          <input
            v-model="keyword"
            @keyup.enter="onSearch"
            type="text"
            placeholder="请输入项目名称/项目编号"
            class="flex-1 max-w-2xl border border-blue-400 rounded-l-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          />
          <button
            @click="onSearch"
            class="px-8 py-3 rounded-r-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-base"
          >
            查找项目
          </button>
        </div>
  
        <!-- 筛选栏 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">按条件筛选项目</h2>
          <div class="space-y-4">
            <!-- 项目状态 -->
            <div class="flex items-center flex-wrap overflow-x-auto">
              <span class="mr-4 font-medium whitespace-nowrap">项目状态：</span>
              <div class="flex space-x-2">
                <button
                  v-for="item in statusOptions"
                  :key="item.value"
                  @click="selectFilter(item.value)"
                  :class="isSelected(item.value) ? activeBtn : inactiveBtn"
                  class="mb-2"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 操作按钮 -->
        <div class="flex justify-end mb-6">
          <router-link to="/project/publish">
            <button class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-base">
              发布新项目
            </button>
          </router-link>
        </div>
  
  
        <!-- 项目表格 -->
        <div class="bg-white rounded-2xl shadow-lg p-4">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2">项目名称</th>
                <th class="px-4 py-2">发起方</th>
                <th class="px-4 py-2">项目领域</th>
                <th class="px-4 py-2">状态</th>
                <th class="px-4 py-2">联系方式</th>
                <th class="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.projectId" class="border-b hover:bg-blue-50 transition">
                <td class="px-4 py-2 text-center">
                  <router-link :to="`/project/detail/${project.projectId}`" class="text-blue-600 hover:text-blue-800 font-medium">
                    {{ project.title }}
                  </router-link>
                </td>
                <td class="px-4 py-2 text-center">
                  <span class="text-blue-600">{{ project.organizationName || '-' }}</span>
                </td>
                <td class="px-4 py-2 text-center">{{ project.field || '-' }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="getStatusClass(project.status)">
                    {{ getStatusText(project.status) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-center">{{ project.contact }}</td>
                <td class="px-4 py-2 text-center">
                  <router-link :to="`/project/detail/${project.projectId}`">
                    <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">
                      查看详情
                    </button>
                  </router-link>
                  <!-- draft: 编辑、取消 -->
                  <button v-if="project.status === 'draft'" @click="editProject(project.projectId)" class="px-2 py-1 rounded-md bg-yellow-500 text-white text-xs mr-1 shadow hover:bg-yellow-600 transition">编辑</button>
                  <button v-if="project.status === 'draft'" @click="cancelProject(project.projectId)" class="px-2 py-1 rounded-md bg-orange-500 text-white text-xs shadow hover:bg-orange-600 transition">取消</button>
                  <!-- pending: 查看申请、取消 -->
                  <button v-if="project.status === 'pending'" @click="cancelProject(project.projectId)" class="px-2 py-1 rounded-md bg-orange-500 text-white text-xs shadow hover:bg-orange-600 transition">取消</button>
                  <!-- active: 查看申请、终止 -->
                  <button v-if="project.status === 'active'" @click="viewApplication(project.projectId)" class="px-2 py-1 rounded-md bg-indigo-500 text-white text-xs mr-1 shadow hover:bg-indigo-600 transition">查看申请</button>
                  <button v-if="project.status === 'active'" @click="terminateProject(project.projectId)" class="px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 transition">终止</button>
                  <!-- matched: 查看合同、终止 -->
                  <button v-if="project.status === 'matched'" @click="viewContract(project.projectId)" class="px-2 py-1 rounded-md bg-green-700 text-white text-xs mr-1 shadow hover:bg-green-800 transition">查看合同</button>
                  <button v-if="project.status === 'matched'" @click="terminateProject(project.projectId)" class="px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 transition">终止</button>
                  <!-- rejected: 查看拒绝缘由 -->
                  <button v-if="project.status === 'rejected'" @click="viewReason(project)" class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
                  <!-- canceled: 查看取消原因 -->
                  <button v-if="project.status === 'canceled'" @click="viewReason(project)" class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
                  <!-- terminated: 查看终止原因 -->
                  <button v-if="project.status === 'terminated'" @click="viewReason(project)" class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
                  <!-- 申请合作按钮保留 -->
                  <button 
                    v-if="canApply(project)"
                    @click="applyProject(project.projectId)" 
                    class="px-2 py-1 rounded-md bg-green-500 text-white text-xs shadow hover:bg-green-600 transition"
                  >
                    申请合作
                  </button>
                </td>
              </tr>
              <tr v-if="projects.length === 0">
                <td colspan="6" class="text-center text-gray-400 py-6">暂无项目</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- 分页 -->
        <div class="flex justify-center mt-6">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            上一页
          </button>
          <span class="mx-2">第 {{ currentPage }} / {{ Math.ceil(total / pageSize) }} 页</span>
          <button
            :disabled="currentPage === Math.ceil(total / pageSize)"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>
  
     
  
      
  
      
  
      <!-- 查看原因弹窗 -->
      <div v-if="reasonViewDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <div class="font-bold text-lg mb-2">原因</div>
          <div class="text-gray-700 mb-4 whitespace-pre-line">{{ reasonText }}</div>
          <div class="flex justify-end">
            <button @click="reasonViewDialogVisible = false" class="px-4 py-2 bg-blue-500 text-white rounded">关闭</button>
          </div>
        </div>
      </div>
  
      <!-- 输入原因弹窗 -->
      <div v-if="reasonDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <div class="font-bold text-lg mb-2">
            请输入
            <template v-if="currentAction === 'canceled'">取消</template>
            <template v-else-if="currentAction === 'terminated'">终止</template>
            原因
          </div>
          <textarea v-model="reasonText" class="w-full border rounded p-2 mb-4" rows="3" placeholder="请输入原因"></textarea>
          <div class="flex justify-end space-x-2">
            <button @click="reasonDialogVisible = false" class="px-4 py-2 bg-gray-300 rounded">取消</button>
            <button @click="confirmReason" class="px-4 py-2 bg-blue-500 text-white rounded">确定</button>
          </div>
        </div>
      </div>
  
      <!-- 申请列表弹窗 -->
      <div v-if="showApplicationModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">项目申请列表</h3>
          <div v-if="applicationList.length === 0" class="text-gray-500">暂无申请</div>
          <table v-else class="min-w-full mb-4">
            <thead>
              <tr>
                <th class="px-2 py-1">申请人</th>
                <th class="px-2 py-1">所属组织</th>
                <th class="px-2 py-1">申请时间</th>
                <th class="px-2 py-1">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applicationList" :key="app.applicationId">
                <td class="px-2 py-1">{{ app.applicantName || app.applicantId }}</td>
                <td class="px-2 py-1">{{ app.organizationName || '-' }}</td>
                <td class="px-2 py-1">{{ dayjs(app.createdAt).format('YYYY-MM-DD HH:mm') }}</td>
                <td class="px-2 py-1">
                  <button @click="viewApplicationInfo(app)" class="text-blue-600 mr-2">查看详情</button>
                  <button v-if="app.status === 'pending'" @click="confirmApprove(app)" class="text-green-600 mr-2">同意</button>
                  <button v-if="app.status === 'pending'" @click="confirmReject(app)" class="text-red-600">拒绝</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-end">
            <button @click="showApplicationModal = false" class="px-4 py-2 bg-gray-300 rounded">关闭</button>
          </div>
        </div>
      </div>
  
      <!-- 申请信息弹窗 -->
      <div v-if="showApplicationInfoModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">申请说明</h3>
          <div v-if="selectedApplication">
            <div class="text-gray-700 whitespace-pre-line">{{ selectedApplication.message || '无说明' }}</div>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="showApplicationInfoModal = false" class="px-4 py-2 bg-blue-500 text-white rounded">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'
  import { getProjects, updateProjectStatus, getProjectApplications, reviewApplication } from '@/lib/api/project'
  import dayjs from 'dayjs'
  
  const router = useRouter()
  const appStore = useAppStore()
  
  // 数据
  const projects = ref<any[]>([])
  const keyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  
  // 筛选项
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'draft', label: '未提交' },
    { value: 'pending', label: '待审核' },
    { value: 'active', label: '待合作' },
    { value: 'matched', label: '已合作' },
    { value: 'closed', label: '已完成' },
    { value: 'rejected', label: '已驳回' },
    { value: 'canceled', label: '已取消' },
    { value: 'terminated', label: '已终止' }
  ]
  
  const filter = ref({
    status: ''
  })
  
  const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
  const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'
  
  // 申请相关
  const showApplyModal = ref(false)
  const applyMessage = ref('')
  const currentProjectId = ref<number | null>(null)
  const currentAction = ref<'canceled' | 'terminated' | null>(null)
  
  // 智能推荐相关
  const showRecommendModal = ref(false)
  const showCycleModal = ref(false)
  
  // 原因相关
  const reasonDialogVisible = ref(false)
  const reasonText = ref('')
  const reasonViewDialogVisible = ref(false)
  
  // 申请列表相关
  const showApplicationModal = ref(false)
  const applicationList = ref<any[]>([])
  const selectedApplication = ref<any>(null)
  const showApplicationInfoModal = ref(false)
  
  // 方法
  function selectFilter(value: string) {
    filter.value.status = value
    currentPage.value = 1
    fetchProjects(1)
  }
  
  function isSelected(value: string): boolean {
    return filter.value.status === value
  }
  
  async function fetchProjects(page = currentPage.value) {
    try {
      const params = {
        page,
        pageSize: pageSize.value,
        keyword: keyword.value,
        status: filter.value.status || undefined,
        initiatorId: appStore.user?.id
      }
      console.log('请求参数', params)
      const res = await getProjects(params)
      // 兼容后端直接返回数组的情况
      if (Array.isArray(res.data)) {
        projects.value = res.data
        total.value = res.data.length
      } else if (res.data.list) {
        projects.value = res.data.list
        total.value = res.data.total
      } else {
        projects.value = []
        total.value = 0
      }
      currentPage.value = page
    } catch (error) {
      console.error('获取项目列表失败:', error)
      projects.value = []
      total.value = 0
    }
  }
  
  function changePage(page: number) {
    currentPage.value = page
    fetchProjects(page)
  }
  
  function onSearch() {
    currentPage.value = 1
    fetchProjects(1)
  }
  
  function getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
      active: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
      closed: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
      rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs'
  }
  
  function getStatusText(status: string): string {
    const map: Record<string, string> = {
      draft: '未提交',
      pending: '待审核',
      active: '待合作',
      matched: '已合作',
      closed: '已完成',
      rejected: '已驳回',
      canceled: '已取消',
      terminated: '已终止'
    }
    return map[status] || status
  }
  
  function canApply(project: any): boolean {
    // 判断是否可以申请合作
    const userType = appStore.user?.role
    const projectInitiatorType = project.initiatorType
    
    // 如果用户是学校，只能申请企业项目；如果用户是企业，只能申请学校项目
    if (userType === 'TEACHER' && projectInitiatorType === 'enterprise') return true
    if (userType === 'EN_TEACHER' && projectInitiatorType === 'school') return true
    
    return false
  }
  
  function applyProject(projectId: number) {
    currentProjectId.value = projectId
    applyMessage.value = ''
    showApplyModal.value = true
  }
  
  async function submitApply() {
    try {
      // 这里需要调用申请合作的API
      console.log('申请合作:', {
        projectId: currentProjectId.value,
        message: applyMessage.value
      })
      
      showApplyModal.value = false
      // 可以显示成功提示
    } catch (error) {
      console.error('申请失败:', error)
    }
  }
  
  // 操作按钮相关方法（空实现，后续可补充具体逻辑）
  function editProject(projectId: number) {
    // 跳转到编辑页面
    router.push(`/project/edit/${projectId}`)
  }
  function cancelProject(projectId: number) {
    currentAction.value = 'canceled'
    currentProjectId.value = projectId
    reasonText.value = ''
    reasonDialogVisible.value = true
  }
  function terminateProject(projectId: number) {
    currentAction.value = 'terminated'
    currentProjectId.value = projectId
    reasonText.value = ''
    reasonDialogVisible.value = true
  }
  function viewApplication(projectId: number) {
    getProjectApplications(projectId)
      .then(res => {
        applicationList.value = res.data || []
        showApplicationModal.value = true
      })
      .catch(() => {
        alert('获取申请列表失败')
      })
  }
  function viewContract(projectId: number) {
    // TODO: 查看合同
    console.log('查看合同', projectId)
  }
  function viewReason(project: any) {
    reasonText.value = project.reason || '暂无原因'
    reasonViewDialogVisible.value = true
  }
  
  async function confirmReason() {
    if (!reasonText.value || !reasonText.value.trim()) {
      alert('请输入原因')
      return
    }
    if (currentProjectId.value && currentAction.value) {
      try {
        await updateProjectStatus(currentProjectId.value, currentAction.value, reasonText.value)
      } catch (e) {
        alert('操作失败')
      } finally {
        reasonDialogVisible.value = false
        fetchProjects()
      }
    }
  }
  
  function getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || '附件'
  }
  
  function viewApplicationInfo(application: any) {
    selectedApplication.value = application
    showApplicationInfoModal.value = true
  }
  
  function confirmApprove(app: any) {
    if (window.confirm('确定要同意该申请吗？')) {
      reviewApplication(app.projectId, app.applicationId, { status: 'approved' })
        .then(() => {
          alert('已同意')
          applicationList.value = applicationList.value.map(a =>
            a.applicationId === app.applicationId ? { ...a, status: 'approved' } : a
          )
        })
        .catch(() => {
          alert('操作失败')
        })
    }
  }
  
  function confirmReject(app: any) {
    if (window.confirm('确定要拒绝该申请吗？')) {
      reviewApplication(app.projectId, app.applicationId, { status: 'rejected' })
        .then(() => {
          alert('已拒绝')
          applicationList.value = applicationList.value.map(a =>
            a.applicationId === app.applicationId ? { ...a, status: 'rejected' } : a
          )
        })
        .catch(() => {
          alert('操作失败')
        })
    }
  }
  
  onMounted(fetchProjects)
  </script>