<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 标题 -->
      <h2 class="text-3xl font-bold text-gray-800 mb-8">我的项目管理</h2>

      <!-- 搜索框 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            v-model="keyword"
            @keyup.enter="onSearch"
            type="text"
            placeholder="请输入项目名称/项目编号"
            class="flex-1 border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            @click="onSearch"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            查找项目
          </button>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">按条件筛选项目</h3>
        <div>
          <!-- 项目状态 -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-gray-700 font-medium">项目状态：</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in statusOptions"
                :key="item.value"
                @click="selectFilter(item.value)"
                :class="isSelected(item.value) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目表格 -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发起方</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目领域</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系方式</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <ProjectListItem
                v-for="project in projects"
                :key="project.projectId"
                :project="project"
                :can-apply="canApply(project)"
                :all-contracts-rejected="allContractsRejected(project.projectId)"
                :has-approved-contract="hasApprovedContract(project.projectId)"
                :has-pending-contract="hasPendingContract(project.projectId)"
                :apply-finish="applyFinishMap[String(project.projectId)]"
                @edit="editProject"
                @cancel="cancelProject"
                @view-application="viewApplication"
                @start-contract="startContract"
                @terminate="terminateProject"
                @apply-finish="onApplyFinish"
                @fund-apply="openFundApplyDialog"
                @refresh="refreshProjects"
                @view-reason="viewReason"
                @apply="applyProject"
              />
              <tr v-if="projects.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">暂无项目</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          共 {{ total }} 条记录
        </div>
        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="px-4 py-2 text-sm font-medium text-gray-700">第 {{ currentPage }} / {{ Math.ceil(total / pageSize) }} 页</span>
          <button
            :disabled="currentPage === Math.ceil(total / pageSize)"
            @click="changePage(currentPage + 1)"
            class="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 查看原因弹窗 -->
    <ProjectReasonDialog
      :visible="reasonViewDialogVisible"
      :title="'原因'"
      :content="reasonText"
      @close="reasonViewDialogVisible = false"
    />

    <!-- 输入原因弹窗 -->
    <ProjectReasonInputDialog
      :visible="reasonDialogVisible"
      :action="currentAction"
      :reason="reasonText"
      @close="reasonDialogVisible = false"
      @confirm="confirmReason"
    />

    <!-- 申请列表弹窗 -->
    <ProjectApplicationDialog
      :visible="showApplicationModal"
      :applications="applicationList"
      @close="showApplicationModal = false"
      @view-info="viewApplicationInfo"
      @approve="confirmApprove"
      @reject="confirmReject"
    />

    <!-- 申请信息弹窗 -->
    <ProjectApplicationInfoDialog
      :visible="showApplicationInfoModal"
      :application="selectedApplication"
      @close="showApplicationInfoModal = false"
    />

    <!-- 发起合同弹窗 -->
    <div v-if="showNoContractDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">当前还未发起合同</h3>
          <button @click="cancelInitiateContract" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="text-gray-700 mb-6">是否现在发起合同？</div>
        <div class="flex justify-end space-x-3">
          <button @click="cancelInitiateContract" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium">取消</button>
          <button @click="confirmInitiateContract" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">去发起合同</button>
        </div>
      </div>
    </div>

    <!-- 合同上传弹窗 -->
    <ContractUploadDialog
      :visible="showUploadContractDialog"
      @close="cancelUploadContract"
      @submit="handleContractUpload"
    />

    <!-- 有效合同弹窗 -->
    <div v-if="showValidContractsDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-4 transform transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">合同详情</h3>
          <button @click="closeValidContractsDialog" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-for="contract in validContracts" :key="contract.contractId" class="mb-6 pb-4 border-b border-gray-200">
          <div class="mb-2">
            <span class="text-gray-500 text-sm">名称：</span>
            <span class="font-medium text-gray-900">{{ contract.contractName || '无' }}</span>
          </div>
          <div class="mb-2">
            <span class="text-gray-500 text-sm">备注：</span>
            <span class="text-gray-700">{{ contract.remark || '-' }}</span>
          </div>
          <div>
            <div class="text-gray-500 text-sm mb-2">附件：</div>
            <div class="flex flex-wrap gap-2">
              <template v-for="(fileUrl, fileIdx) in contract.contractUrl.split(',')" :key="fileIdx">
                <div class="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                  <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="truncate max-w-[200px] text-sm text-gray-700" :title="fileUrl.split('/').pop()">
                    {{ fileUrl.split('/').pop() }}
                  </span>
                  <button @click="handleDownloadFile(fileUrl)" class="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">下载</button>
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button @click="closeValidContractsDialog" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium">关闭</button>
        </div>
      </div>
    </div>

    <!-- 经费申请弹窗 -->
    <FundApplyDialog
      :visible="showFundApplyDialog"
      @close="cancelFundApply"
      @submit="submitFundApply"
    />

    <!-- 经费申请详情弹窗 -->
    <div v-if="showFundDetailDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-4 transform transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">经费申请记录</h3>
          <button @click="closeFundDetailDialog" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="fundDetailList.length === 0" class="text-gray-500 py-4 text-center">暂无经费申请记录</div>
        <table v-else class="min-w-full mb-4">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用途</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">附件</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in fundDetailList" :key="item.fundId" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.amount }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.purpose }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.remark || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <template v-if="item.attachments && item.attachments.length">
                  <a
                    v-for="(url, idx) in item.attachments"
                    :key="url"
                    :href="url"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 underline mr-1"
                  >附件{{ idx + 1 }}</a>
                </template>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(item.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getStatusText(item.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="flex justify-end">
          <button @click="closeFundDetailDialog" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getProjects, updateProjectStatus, getProjectApplications, reviewApplication, getContracts, createContract, addProjectProgress, applyForFund, getClosure, getProjectProgressList, getProjectFundRecords } from '@/lib/api/project'
import { uploadFile, downloadFile } from '@/lib/api/file'

// 导入组件
import ProjectListItem from '@/components/project/ProjectListItem.vue'
import ProjectReasonDialog from '@/components/project/ProjectReasonDialog.vue'
import ProjectReasonInputDialog from '@/components/project/ProjectReasonInputDialog.vue'
import ProjectApplicationDialog from '@/components/project/ProjectApplicationDialog.vue'
import ProjectApplicationInfoDialog from '@/components/project/ProjectApplicationInfoDialog.vue'
import ContractUploadDialog from '@/components/project/ContractUploadDialog.vue'
import FundApplyDialog from '@/components/project/FundApplyDialog.vue'

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

// 申请相关
const showApplyModal = ref(false)
const applyMessage = ref('')
const currentProjectId = ref<number | null>(null)
const currentAction = ref<'canceled' | 'terminated' | null>(null)

// 原因相关
const reasonDialogVisible = ref(false)
const reasonText = ref('')
const reasonViewDialogVisible = ref(false)

// 申请列表相关
const showApplicationModal = ref(false)
const applicationList = ref<any[]>([])
const selectedApplication = ref<any>(null)
const showApplicationInfoModal = ref(false)

// 发起合同相关
const showNoContractDialog = ref(false)
const pendingProjectId = ref<number | null>(null)

// 合同上传相关
const showUploadContractDialog = ref(false)
const uploadFileUrls = ref<{ name: string; url: string }[]>([])
const uploadRemark = ref('')

// 有效合同相关
const showValidContractsDialog = ref(false)
const validContracts = ref<any[]>([])

const contractMap = ref<Record<number, boolean>>({})

const finishProjectMap = ref<Record<number, boolean>>({})

const allContractsSignedMap = ref<Record<number, boolean>>({})

// 经费申请相关
const showFundApplyDialog = ref(false)
const fundApplyProjectId = ref<number | null>(null)
const fundAmount = ref('')
const fundPurpose = ref('')
const fundAttachments = ref<{ name: string; url: string }[]>([])
const fundRemark = ref('')
const fundUploading = ref(false)

const applyFinishMap = ref<Record<string, boolean>>({})

// 经费申请详情相关变量
const showFundDetailDialog = ref(false)
const fundDetailList = ref<any[]>([])

const contractsMap = ref<Record<number, any[]>>({})

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
    await updateContractMap()
    await updateAllContractsSignedMap()
    await updateApplyFinishMap()
    await nextTick()
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
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    matched: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
    terminated: 'bg-gray-100 text-gray-800'
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
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

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
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

// 操作按钮相关方法
function editProject(projectId: number) {
  // 跳转到编辑页面
  router.push(`/project/dock/edit/${projectId}`)
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

function viewReason(project: any) {
  reasonText.value = project.reason || '暂无原因'
  reasonViewDialogVisible.value = true
}

async function confirmReason(reason: string) {
  if (!reason.trim()) {
    alert('请输入原因')
    return
  }
  
  reasonText.value = reason
  
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

function confirmInitiateContract() {
  if (pendingProjectId.value) {
    router.push(`/project/${pendingProjectId.value}/contract/initiate`)
    showNoContractDialog.value = false
    pendingProjectId.value = null
  }
}

function cancelInitiateContract() {
  showNoContractDialog.value = false
  pendingProjectId.value = null
}

async function handleContractUpload(data: { files: File[], remark: string }) {
  if (!pendingProjectId.value || data.files.length === 0) return;

  try {
    // 上传文件
    const uploadedFiles: { name: string; url: string }[] = [];
    for (const file of data.files) {
      const formData = new FormData();
      formData.append('file', file);
      const res: any = await uploadFile(formData);
      const url = res.data.url || res.data.file_url;
      if (url) uploadedFiles.push({ name: file.name, url });
    }

    // 1. 获取项目申请列表
    const res = await getProjectApplications(pendingProjectId.value);
    const applications = res.data || [];
    // 2. 找到已通过的申请
    const approvedApp = applications.find(app => app.status === 'approved');
    if (!approvedApp) {
      alert('未找到已通过的合作方，无法上传合同');
      return;
    }
    const receiverId = approvedApp.applicantId;

    // 获取项目名称
    const project = projects.value.find((p: any) => p.projectId === pendingProjectId.value);
    const contractName = project ? (project.title + '合同') : '合同';

    // 3. 上传合同
    await createContract(pendingProjectId.value, {
      contractName,
      contractUrl: uploadedFiles.map(f => f.url).join(','),
      receiverId,
      remark: data.remark
    });
    
    showUploadContractDialog.value = false;
    pendingProjectId.value = null;
    fetchProjects();
  } catch (error) {
    console.error('合同上传失败:', error);
    alert('合同上传失败');
  }
}

function cancelUploadContract() {
  showUploadContractDialog.value = false
  pendingProjectId.value = null
}

async function handleDownloadFile(fileUrl: string) {
  try {
    const filename = fileUrl.split('/').pop()
    if (!filename) {
      alert('无法获取文件名')
      return
    }
    const blob = await downloadFile(filename)
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (err) {
    alert('下载失败')
  }
}

function hasContract(projectId: number) {
  return contractMap.value[projectId] === true
}

async function updateContractMap() {
  for (const project of projects.value) {
    const res = await getContracts(project.projectId) as { data: any[] }
    const contracts = res.data || []
    contractMap.value[project.projectId] = Array.isArray(contracts) && contracts.length > 0
    contractsMap.value[project.projectId] = contracts
  }
}

function startContract(projectId: number) {
  pendingProjectId.value = projectId
  showUploadContractDialog.value = true
}

// 判断所有合同都已签署
async function allContractsSigned(projectId: number): Promise<boolean> {
  const res = await getContracts(projectId) as { data: any[] }
  const contracts = res.data || []
  // 至少有一个合同，且全部为approved
  return contracts.length > 0 && contracts.every((c: any) => c.status === 'approved')
}

async function canShowFinishBtn(projectId: number): Promise<boolean> {
  // 已缓存则直接返回
  if (finishProjectMap.value[projectId] !== undefined) return finishProjectMap.value[projectId]
  // 判断所有合同都签署
  const signed = await allContractsSigned(projectId)
  finishProjectMap.value[projectId] = signed
  return signed
}

async function onApplyFinish(projectId: number) {
  if (!window.confirm('确定要申请结项吗？')) return
  try {
    await addProjectProgress(projectId, { stage: 'pending', content: '申请结项', attachments: [] })
    alert('申请结项已提交')
    refreshProjects()
  } catch (e) {
    alert('申请失败')
  }
}

async function updateAllContractsSignedMap() {
  for (const project of projects.value) {
    if (project.status === 'matched') {
      const res = await getContracts(project.projectId) as { data: any[] }
      const contracts = res.data || []
      allContractsSignedMap.value[project.projectId] = contracts.length > 0 && contracts.every((c: any) => c.status === 'approved')
    } else {
      allContractsSignedMap.value[project.projectId] = false
    }
  }
}

function openFundApplyDialog(projectId: number) {
  fundApplyProjectId.value = projectId
  showFundApplyDialog.value = true
}

function cancelFundApply() {
  showFundApplyDialog.value = false
  fundApplyProjectId.value = null
}

async function submitFundApply(data: { amount: number, purpose: string, attachments: string[], remark: string }) {
  if (!fundApplyProjectId.value) return;
  
  try {
    await applyForFund(fundApplyProjectId.value, {
      amount: data.amount,
      purpose: data.purpose,
      attachments: data.attachments,
      remark: data.remark
    });
    
    alert('经费申请已提交');
    showFundApplyDialog.value = false;
    fundApplyProjectId.value = null;
  } catch (e) {
    alert('申请失败');
  }
}

function refreshProjects() {
  fetchProjects()
}

async function updateApplyFinishMap() {
  applyFinishMap.value = {}
  const matchedProjects = projects.value.filter(p => p.status === 'matched')
  for (const project of matchedProjects) {
    try {
      const res = await getProjectProgressList(project.projectId) as { data: any[] }
      // 判断是否有"申请结项"进度
      const hasApplyFinish = Array.isArray(res.data) && res.data.some(
        prog => prog.content?.includes('申请结项')
      )
      applyFinishMap.value[String(project.projectId)] = hasApplyFinish
    } catch (e) {
      applyFinishMap.value[String(project.projectId)] = false
    }
  }
}

async function openFundDetailDialog(projectId: number) {
  try {
    const res = await getProjectFundRecords(projectId)
    fundDetailList.value = res.data || []
    showFundDetailDialog.value = true
  } catch (e) {
    alert('获取经费申请记录失败')
  }
}

function closeFundDetailDialog() {
  showFundDetailDialog.value = false
  fundDetailList.value = []
}

function closeValidContractsDialog() {
  showValidContractsDialog.value = false
  validContracts.value = []
}

function allContractsRejected(projectId: number): boolean {
  const contracts = contractsMap.value[projectId] || []
  return contracts.length > 0 && contracts.every((c: any) => c.status === 'rejected')
}

function hasApprovedContract(projectId: number): boolean {
  const contracts = contractsMap.value[projectId] || []
  return contracts.some((c: any) => c.status === 'approved')
}

function hasPendingContract(projectId: number): boolean {
  const contracts = contractsMap.value[projectId] || []
  return contracts.some((c: any) => c.status === 'pending')
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.shadow-hover {
  transition: all 0.2s ease-in-out;
}

.shadow-hover:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}
</style>