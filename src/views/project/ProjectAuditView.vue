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
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">项目审核</h2>
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
                <!-- 待审核 -->
                <template v-if="project.status === 'pending'">
                  <router-link :to="`/project/detail/${project.projectId}`">
                    <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">查看详情</button>
                  </router-link>
                  <button @click="reviewProject(project.projectId, 'active')" class="px-2 py-1 rounded-md bg-green-500 text-white text-xs mr-1 shadow hover:bg-green-600 transition">通过</button>
                  <button @click="reviewProject(project.projectId, 'rejected')" class="px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 transition">驳回</button>
                </template>
                <!-- 待合作 -->
                <template v-else-if="project.status === 'active'">
                  <router-link :to="`/project/detail/${project.projectId}`">
                    <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">查看详情</button>
                  </router-link>
                  <button @click="reviewProject(project.projectId, 'terminated')" class="px-2 py-1 rounded-md bg-gray-500 text-white text-xs shadow hover:bg-gray-600 transition">终止</button>
                </template>
                <!-- 已合作 -->
                <template v-else-if="project.status === 'matched'">
                  <router-link :to="`/project/contract/${project.projectId}`">
                    <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">查看合同</button>
                  </router-link>
                  <button @click="reviewProject(project.projectId, 'terminated')" class="px-2 py-1 rounded-md bg-gray-500 text-white text-xs shadow hover:bg-gray-600 transition">终止</button>
                </template>
                <!-- 已完成 -->
                <template v-else-if="project.status === 'closed'">
                  <!-- 无操作 -->
                </template>
                <!-- 已驳回、已取消、已终止 -->
                <template v-else-if="['rejected', 'canceled', 'terminated'].includes(project.status)">
                  <button @click="viewReason(project)" class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
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
          class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
        >
          上一页
        </button>
        <span class="mx-2">第 {{ currentPage }} / {{ Math.max(1, Math.ceil(total / pageSize)) }} 页</span>
        <button
          :disabled="currentPage === Math.ceil(total / pageSize)"
          @click="changePage(currentPage + 1)"
          class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
    <!-- 输入缘由弹窗 -->
    <div v-if="reasonDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-80">
        <div class="font-bold text-lg mb-2">
          请输入
          <template v-if="currentAction === 'active'">通过</template>
          <template v-else-if="currentAction === 'rejected'">驳回</template>
          <template v-else-if="currentAction === 'terminated'">终止</template>
          <template v-else-if="currentAction === 'canceled'">撤回</template>
          原因
        </div>
        <textarea v-model="reasonText" class="w-full border rounded p-2 mb-4" rows="3" placeholder="请输入原因"></textarea>
        <div class="flex justify-end space-x-2">
          <button @click="reasonDialogVisible = false" class="px-4 py-2 bg-gray-300 rounded">取消</button>
          <button @click="confirmReason" class="px-4 py-2 bg-blue-500 text-white rounded">确定</button>
        </div>
      </div>
    </div>
    <!-- 查看缘由弹窗 -->
    <div v-if="reasonViewDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-80">
        <div class="font-bold text-lg mb-2">原因</div>
        <div class="text-gray-700 mb-4 whitespace-pre-line">{{ reasonText }}</div>
        <div class="flex justify-end">
          <button @click="reasonViewDialogVisible = false" class="px-4 py-2 bg-blue-500 text-white rounded">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getProjects, updateProjectStatus } from '@/lib/api/project'

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
    // 兼容后端直接返回数组的情况
    if (Array.isArray(res.data)) {
      total.value = res.data.length
      const start = (page - 1) * pageSize.value
      const end = start + pageSize.value
      projects.value = res.data.slice(start, end)
    } else if (res.data.list) {
      projects.value = res.data.list
      total.value = res.data.total
    } else {
      projects.value = []
      total.value = 0
    }
    currentPage.value = page
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

onMounted(() => fetchProjects())
</script> 