<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-medium text-gray-900">成果展示</h1>
      <p class="mt-1 text-base text-gray-500">展示所有学生的作品集、竞赛获奖和科研成果</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div class="bg-white rounded-lg p-4 shadow-sm relative">
        <div class="absolute top-3 right-3">
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <span class="text-sm font-medium text-blue-600">总览</span>
          </div>
        </div>
        <div class="pr-12">
          <p class="text-base text-gray-500">总成果数</p>
          <p class="mt-1 text-2xl font-semibold">{{ statistics.totalAchievements }}</p>
          <p class="mt-1 text-sm text-gray-400">包含所有类型的成果总数</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm relative">
        <div class="absolute top-3 right-3">
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <span class="text-sm font-medium text-green-600">已认</span>
          </div>
        </div>
        <div class="pr-12">
          <p class="text-base text-gray-500">已认证成果</p>
          <p class="mt-1 text-2xl font-semibold">{{ statistics.verifiedCount || 0 }}</p>
          <p class="mt-1 text-sm text-gray-400">认证率 {{ statistics.verifiedRate || 'NaN%' }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm relative">
        <div class="absolute top-3 right-3">
          <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <span class="text-sm font-medium text-purple-600">作品</span>
          </div>
        </div>
        <div class="pr-12">
          <p class="text-base text-gray-500">作品数量</p>
          <p class="mt-1 text-2xl font-semibold">{{ statistics.portfolioCount }}</p>
          <p class="mt-1 text-sm text-gray-400">个人作品和项目展示</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm relative">
        <div class="absolute top-3 right-3">
          <div class="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <span class="text-sm font-medium text-yellow-600">获奖</span>
          </div>
        </div>
        <div class="pr-12">
          <p class="text-base text-gray-500">获奖数量</p>
          <p class="mt-1 text-2xl font-semibold">{{ statistics.awardCount }}</p>
          <p class="mt-1 text-sm text-gray-400">竞赛和荣誉获奖</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm relative">
        <div class="absolute top-3 right-3">
          <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <span class="text-sm font-medium text-indigo-600">科研</span>
          </div>
        </div>
        <div class="pr-12">
          <p class="text-base text-gray-500">科研成果</p>
          <p class="mt-1 text-2xl font-semibold">{{ statistics.researchCount }}</p>
          <p class="mt-1 text-sm text-gray-400">论文、专利等科研成果</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm relative">
        <div class="absolute top-3 right-3">
          <div class="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
            <span class="text-sm font-medium text-pink-600">访问</span>
          </div>
        </div>
        <div class="pr-12">
          <p class="text-base text-gray-500">总访问量</p>
          <p class="mt-1 text-2xl font-semibold">{{ statistics.visitCount || 0 }}</p>
          <p class="mt-1 text-sm text-gray-400">成果展示页面访问量</p>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="p-4">
        <div class="flex items-center space-x-4">
          <div class="w-48">
            <select 
              v-model="filters.type" 
              class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11"
            >
              <option value="">全部类型</option>
              <option value="portfolio">作品集</option>
              <option value="award">竞赛获奖</option>
              <option value="research">科研成果</option>
            </select>
          </div>
          <div class="w-48">
            <select 
              v-model="filters.verifyStatus" 
              class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11"
            >
              <option value="">全部状态</option>
              <option value="pending">待认证</option>
              <option value="verified">已认证</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div class="flex-1">
            <div class="relative">
              <input 
                type="text" 
                v-model="filters.keyword" 
                placeholder="搜索标题、学生姓名等"
                class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11 pl-4 pr-10"
              >
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="handleReset" 
              class="px-5 py-2 text-base border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              重置
            </button>
            <button 
              @click="handleApply" 
              class="px-5 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              应用筛选
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成果列表 -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium">成果列表</h2>
          <div class="text-base text-gray-500">
            共 {{ totalItems }} 条记录
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left py-3 px-4 text-base font-medium text-gray-600">标题</th>
              <th class="text-left py-3 px-4 text-base font-medium text-gray-600">类型</th>
              <th class="text-left py-3 px-4 text-base font-medium text-gray-600">学生</th>
              <th class="text-left py-3 px-4 text-base font-medium text-gray-600">提交时间</th>
              <th class="text-left py-3 px-4 text-base font-medium text-gray-600">状态</th>
              <th class="text-left py-3 px-4 text-base font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in achievements" :key="item.id" class="hover:bg-gray-50">
              <td class="py-3 px-4 text-base">{{ item.title }}</td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium" :class="getTypeClass(item.type)">
                  {{ formatType(item.type) }}
                </span>
              </td>
              <td class="py-3 px-4 text-base">{{ item.studentName }}</td>
              <td class="py-3 px-4 text-base text-gray-500">{{ formatDate(item.createdAt) }}</td>
              <td class="py-3 px-4">
                <span 
                  :class="getStatusClass(item.verifyStatus)"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium"
                >
                  {{ formatStatus(item.verifyStatus) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                  <button 
                    @click="viewDetail(item.id)" 
                    class="text-base text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    查看
                  </button>
                  <button 
                    v-if="item.verifyStatus === 'pending'"
                    @click="openVerifyModal(item)"
                    class="text-base text-green-600 hover:text-green-800 transition-colors"
                  >
                    审核
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-gray-100">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 审核弹窗 -->
    <div v-if="showVerifyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">审核成果</h3>
          <button @click="closeVerifyModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-base font-medium mb-1 text-gray-700">审核结果</label>
          <select v-model="verifyForm.status" class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11">
            <option value="verified">通过</option>
            <option value="rejected">拒绝</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-base font-medium mb-1 text-gray-700">审核意见</label>
          <textarea 
            v-model="verifyForm.comment"
            rows="4"
            class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="请输入审核意见"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            @click="closeVerifyModal"
            class="px-5 py-2 text-base border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            @click="submitVerify"
            class="px-5 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/ui/Pagination.vue'
import * as achievementApi from '@/lib/api/achievement'

interface Achievement {
  id: string
  title: string
  type: string
  studentName: string
  createdAt: string
  verifyStatus: string
}

interface VerifyAchievementDTO {
  status: 'verified' | 'rejected'
  comment: string
}

const router = useRouter()
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const achievements = ref<Achievement[]>([])
const showVerifyModal = ref(false)
const currentItem = ref<Achievement | null>(null)
const verifyForm = ref<VerifyAchievementDTO>({
  status: 'verified',
  comment: ''
})

const statistics = ref({
  totalAchievements: 0,
  verifiedCount: 0,
  verifiedRate: 'NaN%',
  portfolioCount: 0,
  awardCount: 0,
  researchCount: 0,
  visitCount: 0
})

const filters = ref({
  type: '',
  verifyStatus: '',
  keyword: ''
})

const typeClasses = {
  portfolio: 'bg-purple-100 text-purple-800',
  award: 'bg-yellow-100 text-yellow-800',
  research: 'bg-indigo-100 text-indigo-800'
}

const statusClasses = {
  pending: 'bg-gray-100 text-gray-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
}

const formatType = (type: string) => {
  const typeMap = {
    portfolio: '作品集',
    award: '获奖',
    research: '科研'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const formatStatus = (status: string) => {
  const statusMap = {
    pending: '待认证',
    verified: '已认证',
    rejected: '已拒绝'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getTypeClass = (type: string) => {
  return typeClasses[type as keyof typeof typeClasses] || ''
}

const getStatusClass = (status: string) => {
  return statusClasses[status as keyof typeof statusClasses] || ''
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAchievements()
}

const handleReset = () => {
  filters.value = {
    type: '',
    verifyStatus: '',
    keyword: ''
  }
}

const handleApply = () => {
  currentPage.value = 1
  fetchAchievements()
}

const viewDetail = (id: string) => {
  router.push(`/achievement/school/${id}`)
}

// 审核相关方法
const openVerifyModal = (item: Achievement) => {
  currentItem.value = item
  verifyForm.value = {
    status: 'verified',
    comment: ''
  }
  showVerifyModal.value = true
}

const closeVerifyModal = () => {
  showVerifyModal.value = false
  currentItem.value = null
  verifyForm.value = {
    status: 'verified',
    comment: ''
  }
}

const submitVerify = async () => {
  if (!currentItem.value) return
  
  try {
    await achievementApi.verifyAchievement(currentItem.value.id, verifyForm.value as VerifyAchievementDTO)
    closeVerifyModal()
    fetchAchievements()
    fetchStatistics() // 更新统计数据
  } catch (error) {
    console.error('Failed to verify achievement:', error)
  }
}

const fetchStatistics = async () => {
  try {
    const response = await achievementApi.getSchoolStatistics()
    if (response.code === 0 && response.data) {
      statistics.value = {
        ...response.data,
        verifiedCount: 0, // 这些字段可能需要从其他 API 获取
        verifiedRate: 'NaN%',
        visitCount: 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
  }
}

const fetchAchievements = async () => {
  try {
    const response = await achievementApi.getSchoolAchievements({
      page: currentPage.value,
      size: 10,
      type: filters.value.type || undefined,
      verifyStatus: filters.value.verifyStatus || undefined,
      keyword: filters.value.keyword || undefined
    })
    
    if (response.code === 0 && response.data) {
      achievements.value = response.data.records
      totalPages.value = response.data.pages
      totalItems.value = response.data.total
    }
  } catch (error) {
    console.error('Failed to fetch achievements:', error)
  }
}

onMounted(() => {
  fetchStatistics()
  fetchAchievements()
})
</script>