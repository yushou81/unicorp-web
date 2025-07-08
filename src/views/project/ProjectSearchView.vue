<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
     <!-- 返回按钮 -->
   
      <h2 class="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">项目搜索与对接</h2>
      <!-- 搜索框 -->
      <div class="flex flex-col sm:flex-row justify-center items-center mb-8 gap-2">
        <input v-model="keyword" @keyup.enter="onSearch" type="text" placeholder="请输入项目名称/项目编号" class="flex-1 max-w-2xl border border-blue-300 rounded-l-lg rounded-r-lg sm:rounded-r-none px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm" />
        <button @click="onSearch" class="px-8 py-3 rounded-lg sm:rounded-l-none bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 transition text-base shadow-md">查找项目</button>
      </div>
      <!-- 筛选栏（发起方类型+领域） -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">按条件筛选项目</h2>
        <div class="space-y-6">
          <!-- 发起方类型 -->
          <div class="flex items-center flex-wrap overflow-x-auto">
            <span class="mr-4 font-medium whitespace-nowrap">发起方类型：</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in initiatorTypeOptions"
                :key="item.value"
                @click="selectInitiatorType(item.value)"
                :class="initiatorType === item.value ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'"
                class="px-5 py-2 rounded-full font-semibold transition mb-2 border border-transparent hover:border-blue-300"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
          <!-- 项目领域 -->
          <div class="flex items-center flex-wrap overflow-x-auto">
            <span class="mr-4 font-medium whitespace-nowrap">项目领域：</span>
            <div class="flex flex-wrap gap-2">
              <button v-for="item in fieldOptions" :key="item" @click="selectField(item)" :class="isSelected(item) ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'" class="px-5 py-2 rounded-full font-semibold transition mb-2 border border-transparent hover:border-blue-300">{{ item }}</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 项目表格 -->
      <div class="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
        <table class="min-w-full">
          <thead>
            <tr class="bg-blue-50 text-blue-800 text-base">
              <th class="px-4 py-3 font-semibold">项目名称</th>
              <th class="px-4 py-3 font-semibold">发起方</th>
              <th class="px-4 py-3 font-semibold">项目领域</th>
              <th class="px-4 py-3 font-semibold">状态</th>
              <th class="px-4 py-3 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.projectId" class="border-b last:border-b-0 hover:bg-blue-50 transition">
              <td class="px-4 py-3 text-center">
                <span class="text-blue-600 hover:text-blue-800 font-bold ">{{ project.title }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="text-blue-600 font-medium">{{ project.organizationName || '-' }}</span>
              </td>
              <td class="px-4 py-3 text-center">{{ project.field || '-' }}</td>
              <td class="px-4 py-3 text-center">
                <span class="text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold">进行中</span>
              </td>
              <td class="px-4 py-3 text-center">
                <router-link :to="`/project/dock/detail/${project.projectId}`">
                  <button class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold mr-2 shadow hover:from-blue-600 hover:to-indigo-600 transition">查看详情</button>
                </router-link>
                <button
                  v-if="!project.hasApplied"
                  @click="applyProject(project.projectId)"
                  class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition"
                >
                  申请合作
                </button>
                <button
                  v-else
                  disabled
                  class="px-3 py-1.5 rounded-lg bg-gray-300 text-white text-xs font-semibold shadow cursor-not-allowed"
                >
                  已发送申请
                </button>
              </td>
            </tr>
            <tr v-if="projects.length === 0">
              <td colspan="5" class="text-center text-gray-400 py-8 text-lg">暂无项目</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="flex justify-center mt-8 gap-2">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow disabled:opacity-50">上一页</button>
        <span class="mx-2 text-base font-medium">第 {{ currentPage }} / {{ Math.ceil(total / pageSize) }} 页</span>
        <button :disabled="currentPage === Math.ceil(total / pageSize)" @click="changePage(currentPage + 1)" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow disabled:opacity-50">下一页</button>
      </div>
      <!-- 申请合作弹窗 -->
      <div v-if="showApplyModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all">
        <div class="bg-white rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] border border-blue-200 animate-fade-in">
          <h3 class="text-xl font-bold mb-6 text-blue-700 text-center">申请合作</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">申请说明</label>
              <textarea v-model="applyMessage" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="请简要说明申请合作的原因和优势..."/>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-8">
            <button @click="showApplyModal = false" class="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition">取消</button>
            <button @click="submitApply" class="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 font-semibold transition">提交申请</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects, applyForProject } from '@/lib/api/project'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const projects = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const fieldOptions = ['不限', '智能制造', '人工智能', '大数据', '云计算', '物联网', '区块链', '新能源', '生物医药']
const filterField = ref(['不限'])
const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'

const showApplyModal = ref(false)
const applyMessage = ref('')
const currentProjectId = ref<number>()

// 发起方类型选项
const initiatorTypeOptions = [
  { value: '', label: '全部' },
  { value: 'school', label: '学校' },
  { value: 'enterprise', label: '企业' }
]

const initiatorType = ref('')

const appStore = useAppStore()

console.log('当前用户信息:', appStore.user)

function selectField(value: string) {
  if (value === '不限') {
    filterField.value = ['不限']
  } else {
    filterField.value = filterField.value.filter(item => item !== '不限')
    if (filterField.value.includes(value)) {
      filterField.value = filterField.value.filter(item => item !== value)
      if (filterField.value.length === 0) {
        filterField.value = ['不限']
      }
    } else {
      filterField.value.push(value)
    }
  }
  currentPage.value = 1
  fetchProjects(1)
}
function isSelected(value: string): boolean {
  return filterField.value.includes(value)
}


const organizationId=-1
async function fetchProjects(page = currentPage.value) {
  try {
    const params = {
      page,
      pageSize: pageSize.value,
      keyword: keyword.value,
      status: 'active', // 只查进行中的项目
      field: filterField.value.length > 0 && !filterField.value.includes('不限') ? filterField.value.join(',') : undefined,
      initiatorType: initiatorType.value || undefined,
      organizationId:organizationId
    }
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
  } catch (error) {
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
function applyProject(projectId: number) {
  currentProjectId.value = projectId
  applyMessage.value = ''
  showApplyModal.value = true
}
async function submitApply() {
  if (!applyMessage.value.trim()) {
    alert('请填写申请说明')
    return
  }
  try {
    const applicantType = appStore.user?.role
    const applicantId = appStore.user?.id
    if (!applicantType || !applicantId) {
      alert('用户信息缺失，无法申请')
      return
    }
    if (!currentProjectId.value) {
      alert('项目ID缺失，无法申请')
      return
    }
    await applyForProject(Number(currentProjectId.value), {
      applicantType,
      applicantId,
      message: applyMessage.value
    })
    // 申请成功后本地更新 hasApplied 状态
    const project = projects.value.find(p => p.projectId === currentProjectId.value)
    if (project) project.hasApplied = true
    alert('申请已提交！')
    showApplyModal.value = false
  } catch (error) {
    alert('申请失败')
    showApplyModal.value = false
  }
}
function selectInitiatorType(value: string) {
  initiatorType.value = value
  fetchProjects()
}
onMounted(fetchProjects)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.25s cubic-bezier(.4,0,.2,1);
}
</style> 