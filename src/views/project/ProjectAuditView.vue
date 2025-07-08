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
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">项目申请审核</h2>
      <!-- 搜索框 -->
      <div class="flex justify-center mb-6">
        <input
          v-model="keyword"
          @keyup.enter="onSearch"
          type="text"
          placeholder="请输入项目名称/项目编号"
          class="flex-1 max-w-2xl border border-blue-400 rounded-l-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
        />
        <button
          @click="onSearch"
          class="px-8 py-3 rounded-r-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-base shadow"
        >
          查找项目
        </button>
      </div>
      <!-- 筛选栏卡片 -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">按条件筛选项目</h2>
        <div class="space-y-4">
          <div class="flex items-center flex-wrap overflow-x-auto">
            <span class="mr-4 font-medium whitespace-nowrap">项目状态：</span>
            <div class="flex space-x-2">
              <button
                v-for="item in statusOptions"
                :key="item.value"
                @click="selectFilter(item.value)"
                :class="isSelected(item.value) ? activeBtn : inactiveBtn"
                class="mb-2 transition"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 项目表格卡片 -->
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
                <!-- 待审核 -->
                <template v-if="project.status === 'pending'">
                  <router-link :to="`/project/detail/${project.projectId}`">
                    <button class="px-2 py-1 rounded-xl bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">查看详情</button>
                  </router-link>
                  <button @click="reviewProject(project.projectId, 'active')" class="px-2 py-1 rounded-xl bg-green-500 text-white text-xs mr-1 shadow hover:bg-green-600 transition">通过</button>
                  <button @click="reviewProject(project.projectId, 'rejected')" class="px-2 py-1 rounded-xl bg-red-500 text-white text-xs shadow hover:bg-red-600 transition">驳回</button>
                </template>
                <!-- 待合作 -->
                <template v-else-if="project.status === 'active'">
                  <router-link :to="`/project/detail/${project.projectId}`">
                    <button class="px-2 py-1 rounded-xl bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">查看详情</button>
                  </router-link>
                  <button @click="reviewProject(project.projectId, 'terminated')" class="px-2 py-1 rounded-xl bg-red-500 text-white text-xs shadow hover:bg-red-600 transition">终止</button>
                </template>
                <!-- 已合作 -->
                <template v-else-if="project.status === 'matched'">
                  <template v-if="project.contractStatus === 'no_contract'">
                    <span class="px-2 py-1 rounded-xl bg-gray-300 text-gray-600 text-xs">等待发起合同</span>
                  </template>
                  <template v-else-if="project.contractStatus === 'pending'">
                    <span class="px-2 py-1 rounded-xl bg-yellow-300 text-yellow-800 text-xs">等待签署</span>
                  </template>
                  <template v-else-if="project.contractStatus === 'approved'">
                    <button @click="showContract(project.projectId)" class="px-2 py-1 rounded-xl bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">查看合同</button>
                    <button @click="viewFund(project.projectId)" class="px-2 py-1 rounded-xl bg-orange-500 text-white text-xs mr-1 shadow hover:bg-orange-600 transition">查看经费申请</button>
                    <!-- 结项按钮 -->
                    <button
                      v-if="progressMap[project.projectId] && hasPendingClosure(progressMap[project.projectId])"
                      @click="onAgreeClosure(project.projectId)"
                      class="px-2 py-1 rounded-xl bg-purple-600 text-white text-xs shadow hover:bg-purple-700 transition"
                    >同意结项</button>
                  </template>
                  <button @click="reviewProject(project.projectId, 'terminated')" class="px-2 py-1 rounded-xl bg-red-500 text-white text-xs shadow hover:bg-red-600 transition">终止</button>
                </template>
                <!-- 已完成 -->
                <template v-else-if="project.status === 'closed'">
                  <!-- 无操作 -->
                </template>
                <!-- 已驳回、已取消、已终止 -->
                <template v-else-if="['rejected', 'canceled', 'terminated'].includes(project.status)">
                  <button @click="viewReason(project)" class="px-2 py-1 rounded-xl bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
                </template>
              </td>
            </tr>
            <tr v-if="projects.length === 0">
              <td colspan="6" class="text-center text-gray-400 py-6">暂无项目</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="flex justify-center mt-6" v-if="Math.ceil(total / pageSize) > 1">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-3 py-1 mx-1 rounded-xl bg-gray-200 disabled:opacity-50 shadow"
        >
          上一页
        </button>
        <span class="mx-2">第 {{ currentPage }} / {{ Math.max(1, Math.ceil(total / pageSize)) }} 页</span>
        <button
          :disabled="currentPage === Math.ceil(total / pageSize)"
          @click="changePage(currentPage + 1)"
          class="px-3 py-1 mx-1 rounded-xl bg-gray-200 disabled:opacity-50 shadow"
        >
          下一页
        </button>
      </div>
    </div>
    <!-- 输入缘由弹窗美化 -->
    <div v-if="reasonDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-80 animate-fade-in">
        <div class="font-bold text-lg mb-2">
          请输入
          <template v-if="currentAction === 'active'">通过</template>
          <template v-else-if="currentAction === 'rejected'">驳回</template>
          <template v-else-if="currentAction === 'terminated'">终止</template>
          <template v-else-if="currentAction === 'canceled'">撤回</template>
          原因
        </div>
        <textarea v-model="reasonText" class="w-full border rounded-xl p-2 mb-4 shadow-sm" rows="3" placeholder="请输入原因"></textarea>
        <div class="flex justify-end space-x-2">
          <button @click="reasonDialogVisible = false" class="px-4 py-2 bg-gray-300 rounded-xl shadow">取消</button>
          <button @click="confirmReason" class="px-4 py-2 bg-blue-500 text-white rounded-xl shadow">确定</button>
        </div>
      </div>
    </div>
    <!-- 查看缘由弹窗美化 -->
    <div v-if="reasonViewDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-80 animate-fade-in">
        <div class="font-bold text-lg mb-2">原因</div>
        <div class="text-gray-700 mb-4 whitespace-pre-line">{{ reasonText }}</div>
        <div class="flex justify-end">
          <button @click="reasonViewDialogVisible = false" class="px-4 py-2 bg-blue-500 text-white rounded-xl shadow">关闭</button>
        </div>
      </div>
    </div>
    <!-- 合同弹窗美化 -->
    <div v-if="contractDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-fade-in">
        <div class="font-bold mb-4 text-xl text-blue-700 flex items-center justify-between">
          <span>合同详情</span>
          <button @click="contractDialog = false" class="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div v-if="contractLoading" class="text-center py-8">
          <div class="text-gray-500">加载中...</div>
        </div>
        <div v-else-if="currentContract">
          <div class="mb-6">
            <div class="font-semibold text-base mb-2">合同名称：{{ currentContract.contractName || '无' }}</div>
            <div class="mb-4">备注：{{ currentContract.remark || '-' }}</div>
            <div class="mb-4">
              <div class="font-medium mb-2">合同附件：</div>
              <div class="flex flex-wrap gap-2">
                <template v-for="(fileUrl, fileIdx) in (currentContract.contractUrl ? currentContract.contractUrl.split(',') : [])" :key="fileIdx">
                  <div class="flex items-center bg-gray-100 rounded-xl px-3 py-2 shadow-sm">
                    <span class="truncate max-w-[200px] select-all" :title="getOriginalName(fileIdx)">{{ getOriginalName(fileIdx) }}</span>
                    <button @click="handleDownloadFile(fileUrl, fileIdx)" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded-xl text-xs hover:bg-blue-700">下载</button>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="contractDialog = false" class="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition">关闭</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 结项弹窗美化 -->
    <div v-if="showClosureDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-96 animate-fade-in">
        <div class="font-bold text-lg mb-2">结项总结</div>
        <textarea v-model="closureSummary" class="w-full border rounded-xl p-2 mb-4 shadow-sm" rows="4" placeholder="请输入结项总结"></textarea>
        <!-- 附件上传可根据实际需求实现，这里简单输入url -->
        <input v-model="closureAttachments[0]" class="w-full border rounded-xl p-2 mb-4 shadow-sm" placeholder="附件URL（可选）" />
        <div class="flex justify-end space-x-2">
          <button @click="showClosureDialog = false" class="px-4 py-2 bg-gray-300 rounded-xl shadow">取消</button>
          <button @click="submitClosure" class="px-4 py-2 bg-blue-500 text-white rounded-xl shadow">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getProjects, updateProjectStatus, getContracts, getProjectProgressList, closeProject } from '@/lib/api/project'
import { downloadFile } from '@/lib/api/file'

const router = useRouter()
const appStore = useAppStore()

const projects = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const statusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'active', label: '待合作' },
  { value: 'matched', label: '已合作' },
  { value: 'closed', label: '已完成' },
  { value: 'rejected', label: '已驳回' },
  { value: 'canceled', label: '已取消' },
  { value: 'terminated', label: '已终止' }
]

const filter = ref({
  status: 'pending'
})

const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'

const reasonDialogVisible = ref(false)
const reasonViewDialogVisible = ref(false)
const reasonText = ref('')
const currentAction = ref<'active' | 'rejected' | 'terminated' | 'canceled' | null>(null)
const currentProjectId = ref<number | null>(null)

const contractDialog = ref(false)
const contractLoading = ref(false)
const currentContract = ref<any>(null)

const progressMap = ref<Record<number, any[]>>({})
const showClosureDialog = ref(false)
const closureSummary = ref('')
const closureAttachments = ref<string[]>([])
const closureProjectId = ref<number | null>(null)

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
      organizationId: appStore.user?.organizationId
    }
    const res = await getProjects(params)
    let list: any[] = []
    if (Array.isArray(res.data)) {
      total.value = res.data.length
      const start = (page - 1) * pageSize.value
      const end = start + pageSize.value
      list = res.data.slice(start, end)
    } else if (res.data.list) {
      list = res.data.list
      total.value = res.data.total
    } else {
      list = []
      total.value = 0
    }
    // 检查matched项目的合同
    await Promise.all(list.map(async (item) => {
      if (item.status === 'matched') {
        const res = await getContracts(item.projectId) as { data: any[] }
        if (!Array.isArray(res.data) || res.data.length === 0) {
          item.contractStatus = 'no_contract' // 没有合同
        } else {
          // 优先找待签署的合同
          const pendingContract = res.data.find((c: any) => c.status === 'pending');
          const approvedContract = res.data.find((c: any) => c.status === 'approved');
          if (approvedContract) {
            item.contractStatus = 'approved';
            item.contractDetail = approvedContract;
          } else if (pendingContract) {
            item.contractStatus = 'pending';
            item.contractDetail = pendingContract;
          } else {
            // 如果全部被拒绝，依然显示"无合同"，允许重新发起
            item.contractStatus = 'no_contract';
          }
        }
        // 拉取进度
        const progressRes = await getProjectProgressList(item.projectId) as { data: any[] }
        progressMap.value[item.projectId] = progressRes.data || []
      }
    }))
    projects.value = list
    currentPage.value = page

    // 新增：自动拉取所有matched项目的进度
    await Promise.all(list.map(async (item) => {
      if (item.status === 'matched') {
        const progressRes = await getProjectProgressList(item.projectId) as { data: any[] }
        progressMap.value[item.projectId] = progressRes.data || []
      }
    }))
  } catch (e) {
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
    matched: 'text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs',
    closed: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
    rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs',
    canceled: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
    terminated: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs'
  }
  return statusMap[status] || 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs'
}

function getStatusText(status: string): string {
  const map: Record<string, string> = {
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

async function reviewProject(projectId: number, status: 'active' | 'rejected' | 'terminated') {
  currentAction.value = status
  currentProjectId.value = projectId
  reasonText.value = ''
  reasonDialogVisible.value = true
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
      // 可以根据需要提示错误
    } finally {
      reasonDialogVisible.value = false
      await fetchProjects()
    }
  }
}

async function withdrawProject(projectId: number) {
  currentAction.value = 'canceled'
  currentProjectId.value = projectId
  reasonText.value = ''
  reasonDialogVisible.value = true
}

function viewReason(project: any) {
  reasonText.value = project.reason || '暂无缘由'
  reasonViewDialogVisible.value = true
}

async function showContract(projectId: number) {
  contractDialog.value = true
  contractLoading.value = true
  currentContract.value = null
  try {
    const res = await getContracts(projectId) as { data: any[] }
    if (Array.isArray(res.data) && res.data.length > 0) {
      // 只取第一个有效合同
      const valid = res.data.find((c: any) => c.status !== 'rejected')
      if (valid) currentContract.value = valid
    }
  } finally {
    contractLoading.value = false
  }
}

async function fetchProgress(projectId: number) {
  if (progressMap.value[projectId]) return progressMap.value[projectId]
  const res = await getProjectProgressList(projectId) as { data: any[] }
  progressMap.value[projectId] = res.data || []
  return progressMap.value[projectId]
}

function hasPendingClosure(progressList: any[]) {
  return progressList.some(p => p.stage === 'pending')
}

async function onAgreeClosure(projectId: number) {
  if (!window.confirm('是否确定同意结项？')) return
  try {
    await closeProject(projectId, {
      summary: '同意结项',
      attachments: []
    })
    alert('结项成功')
    await fetchProjects()
  } catch (e) {
    alert('结项失败')
  }
}

async function submitClosure() {
  if (!closureProjectId.value) return
  try {
    await closeProject(closureProjectId.value, {
      summary: '同意结项',
      attachments: []
    })
    alert('结项成功')
    showClosureDialog.value = false
    await fetchProjects()
  } catch (e) {
    alert('结项失败')
  }
}

function viewFund(projectId: number) {
  router.push(`/project/${projectId}/fund`)
}

function getOriginalName(idx: number) {
  if (!currentContract.value) return '';
  if (currentContract.value.originalName) {
    const arr = currentContract.value.originalName.split(',');
    return arr[idx] || arr[0] || '附件';
  }
  return currentContract.value.contractUrl.split(',')[idx]?.split('/').pop() || '附件';
}

async function handleDownloadFile(fileUrl: string, idx?: number) {
  let filename = fileUrl.split('/').pop() || '文件';
  // 优先用 originalName
  if (typeof idx === 'number' && getOriginalName(idx)) {
    filename = getOriginalName(idx);
  }
  if (!filename) {
    alert('无法获取文件名');
    return;
  }
  try {
    const fileKey = fileUrl.split('/').pop() || '';
    const blob = await downloadFile(fileKey);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    alert('下载失败');
  }
}

onMounted(() => fetchProjects())
</script> 