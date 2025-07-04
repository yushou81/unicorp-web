<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">成果管理</h1>
      <div class="flex space-x-4">
        <Button @click="refreshData" variant="outline" :loading="loading">
          刷新数据
        </Button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">总成果数</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.totalAchievements }}</p>
          </div>
          <DocumentTextIcon class="w-6 h-6 text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">已认证成果</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.verifiedAchievements }}</p>
          </div>
          <CheckBadgeIcon class="w-6 h-6 text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">待认证成果</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.pendingAchievements }}</p>
          </div>
          <ClockIcon class="w-6 h-6 text-yellow-500" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">总浏览量</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.totalViews }}</p>
          </div>
          <ChartBarIcon class="w-6 h-6 text-purple-500" />
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="bg-white rounded-xl shadow-sm">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="currentTab = tab.value"
            :class="[
              currentTab === tab.value
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- 内容区域 -->
      <div class="p-6">
        <!-- 筛选和搜索 -->
        <div class="flex justify-between mb-6">
          <div class="flex space-x-4">
            <select
              v-model="filters.type"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">全部类型</option>
              <option value="award">竞赛获奖</option>
              <option value="research">科研成果</option>
              <option value="portfolio">作品集</option>
            </select>
            <select
              v-model="filters.status"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="verified">已认证</option>
              <option value="pending">待认证</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div class="flex space-x-4">
            <SearchInput v-model="searchQuery" placeholder="搜索成果..." />
          </div>
        </div>

        <!-- 成果列表 -->
        <div class="space-y-4">
          <div v-if="loading" class="text-center py-12">
            <Loading />
          </div>
          <template v-else>
            <div v-if="filteredAchievements.length === 0" class="text-center py-12 text-gray-500">
              暂无数据
            </div>
            <div
              v-else
              v-for="achievement in filteredAchievements"
              :key="achievement.id"
              class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ achievement.title }}</h3>
                  <p class="mt-1 text-sm text-gray-500">{{ achievement.description }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': achievement.status === 'verified',
                        'bg-yellow-100 text-yellow-800': achievement.status === 'pending',
                        'bg-red-100 text-red-800': achievement.status === 'rejected'
                      }"
                    >
                      {{ achievement.status === 'verified' ? '已认证' : achievement.status === 'pending' ? '待认证' : '已拒绝' }}
                    </span>
                    <span class="text-sm text-gray-500">{{ achievement.type === 'award' ? '竞赛获奖' : achievement.type === 'research' ? '科研成果' : '作品集' }}</span>
                    <span class="text-sm text-gray-500">{{ achievement.createdAt }}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <Button
                    v-if="achievement.status === 'pending'"
                    @click="verifyAchievement(achievement.id, true)"
                    variant="success"
                    size="sm"
                  >
                    通过
                  </Button>
                  <Button
                    v-if="achievement.status === 'pending'"
                    @click="verifyAchievement(achievement.id, false)"
                    variant="danger"
                    size="sm"
                  >
                    拒绝
                  </Button>
                  <Button
                    @click="viewDetails(achievement)"
                    variant="outline"
                    size="sm"
                  >
                    查看
                  </Button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 分页 -->
        <div class="mt-6">
          <Pagination
            :total="totalItems"
            :current="currentPage"
            :pageSize="pageSize"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailsDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">成果详情</h3>
            <button
              @click="showDetailsDialog = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">标题</label>
              <p class="mt-1">{{ selectedAchievement?.title }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">描述</label>
              <p class="mt-1">{{ selectedAchievement?.description }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">类型</label>
              <p class="mt-1">{{ selectedAchievement?.type === 'award' ? '竞赛获奖' : selectedAchievement?.type === 'research' ? '科研成果' : '作品集' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">创建时间</label>
              <p class="mt-1">{{ selectedAchievement?.createdAt }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">状态</label>
              <p class="mt-1">{{ selectedAchievement?.status === 'verified' ? '已认证' : selectedAchievement?.status === 'pending' ? '待认证' : '已拒绝' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DocumentTextIcon,
  CheckBadgeIcon,
  ClockIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import Button from '@/components/ui/Button.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import Loading from '@/components/ui/Loading.vue'
import Pagination from '@/components/ui/Pagination.vue'

// 统计数据
const stats = ref({
  totalAchievements: 0,
  verifiedAchievements: 0,
  pendingAchievements: 0,
  totalViews: 0
})

// 标签页配置
const tabs = [
  { name: '全部成果', value: 'all' },
  { name: '待认证', value: 'pending' },
  { name: '已认证', value: 'verified' },
  { name: '已拒绝', value: 'rejected' }
]
const currentTab = ref('all')

// 筛选和搜索
const filters = ref({
  type: '',
  status: ''
})
const searchQuery = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

// 加载状态
const loading = ref(false)

// 成果列表
const achievements = ref([])

// 计算筛选后的成果列表
const filteredAchievements = computed(() => {
  let result = [...achievements.value]

  // 标签页筛选
  if (currentTab.value !== 'all') {
    result = result.filter(item => item.status === currentTab.value)
  }

  // 类型筛选
  if (filters.value.type) {
    result = result.filter(item => item.type === filters.value.type)
  }

  // 状态筛选
  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status)
  }

  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  return result
})

// 详情弹窗
const showDetailsDialog = ref(false)
const selectedAchievement = ref(null)

// 刷新数据
async function refreshData() {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // const res = await getAchievements()
    // achievements.value = res.data
    // 模拟数据
    achievements.value = [
      {
        id: 1,
        title: '全国大学生创新创业大赛一等奖',
        description: '带领团队开发智能家居系统，获得全国一等奖',
        type: 'award',
        status: 'verified',
        createdAt: '2024-03-15'
      },
      {
        id: 2,
        title: '基于深度学习的图像识别研究',
        description: '发表于计算机科学与技术核心期刊',
        type: 'research',
        status: 'pending',
        createdAt: '2024-03-14'
      }
    ]
    
    // 更新统计数据
    stats.value = {
      totalAchievements: achievements.value.length,
      verifiedAchievements: achievements.value.filter(item => item.status === 'verified').length,
      pendingAchievements: achievements.value.filter(item => item.status === 'pending').length,
      totalViews: 1234
    }
    
    totalItems.value = achievements.value.length
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 认证成果
async function verifyAchievement(id: number, isApproved: boolean) {
  try {
    // TODO: 调用API进行认证
    // await verifyAchievement(id, isApproved)
    const achievement = achievements.value.find(item => item.id === id)
    if (achievement) {
      achievement.status = isApproved ? 'verified' : 'rejected'
    }
    // 更新统计数据
    refreshData()
  } catch (error) {
    console.error('认证失败:', error)
  }
}

// 查看详情
function viewDetails(achievement: any) {
  selectedAchievement.value = achievement
  showDetailsDialog.value = true
}

// 处理分页
function handlePageChange(page: number) {
  currentPage.value = page
  refreshData()
}

// 初始化
refreshData()
</script>