<template>
  <Navbar />
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">我的话题</h1>
            <p class="text-gray-600 mt-2">查看和管理你发布的所有话题</p>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/community"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>返回社区</span>
            </router-link>
            <router-link
              to="/community"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>发布新话题</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <!-- 统计信息 -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ stats.totalTopics }}</div>
            <div class="text-sm text-gray-600">总话题数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ stats.totalViews }}</div>
            <div class="text-sm text-gray-600">总浏览量</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ stats.totalLikes }}</div>
            <div class="text-sm text-gray-600">总点赞数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ stats.totalComments }}</div>
            <div class="text-sm text-gray-600">总评论数</div>
          </div>
        </div>
      </div>

      <!-- 筛选和排序 -->
      <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <select
              v-model="sortBy"
              @change="handleSortChange"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">发布时间</option>
              <option value="viewCount">浏览量</option>
              <option value="likeCount">点赞数</option>
              <option value="commentCount">评论数</option>
            </select>
            <select
              v-model="sortOrder"
              @change="handleSortChange"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">共 {{ total }} 条</span>
          </div>
        </div>
      </div>

      <!-- 话题列表 -->
      <div class="space-y-4">
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <router-link
                  :to="`/community/topic/${topic.id}`"
                  class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition"
                >
                  {{ topic.title }}
                </router-link>
                <span v-if="topic.isSticky" class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">置顶</span>
                <span v-if="topic.isEssence" class="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">精华</span>
              </div>
              
              <p class="text-gray-600 mb-3 line-clamp-2">{{ topic.content }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatTime(topic.createdAt) }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{{ topic.viewCount }} 次浏览</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{{ topic.likeCount }} 点赞</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{{ topic.commentCount }} 评论</span>
                  </span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">{{ topic.categoryName }}</span>
                  <router-link
                    :to="`/community/topic/${topic.id}`"
                    class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                  >
                    查看
                  </router-link>
                  <button
                    @click="editTopic(topic)"
                    class="px-3 py-1 text-sm border border-blue-300 rounded text-blue-600 hover:bg-blue-50 transition"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteTopic(topic)"
                    class="px-3 py-1 text-sm border border-red-300 rounded text-red-600 hover:bg-red-50 transition"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="mt-6 flex justify-center">
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
            :class="[
              'px-3 py-2 rounded-lg transition',
              currentPage <= 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            上一页
          </button>
          <span class="px-3 py-2 text-gray-700">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            :class="[
              'px-3 py-2 rounded-lg transition',
              currentPage >= totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="topics.length === 0 && !loading" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">还没有发布过话题</h3>
        <p class="text-gray-500 mb-4">快去发布你的第一个话题吧！</p>
        <router-link
          to="/community"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          发布话题
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { topicApi, type TopicVO } from '@/lib/api/community'
import Navbar from '@/components/layout/Navbar.vue'

const router = useRouter()
const appStore = useAppStore()

// 响应式数据
const topics = ref<TopicVO[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const sortBy = ref('createdAt')
const sortOrder = ref('desc')

// 统计信息
const stats = ref({
  totalTopics: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0
})

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const isLoggedIn = computed(() => !!appStore.user)
const userInfo = computed(() => appStore.user as any || {})

// 获取我的话题列表
const fetchMyTopics = async () => {
  if (!isLoggedIn.value || !userInfo.value?.id) {
    router.push('/login')
    return
  }
  
  loading.value = true
  try {
    const response = await topicApi.getUserTopics(userInfo.value.id, {
      page: currentPage.value,
      size: pageSize.value
    })
    
    if (response.success) {
      topics.value = response.data.records
      total.value = response.data.total
      
      // 计算统计信息
      calculateStats()
    }
  } catch (error) {
    console.error('获取我的话题失败:', error)
  } finally {
    loading.value = false
  }
}

// 计算统计信息
const calculateStats = () => {
  stats.value = topics.value.reduce((acc, topic) => {
    acc.totalTopics++
    acc.totalViews += topic.viewCount
    acc.totalLikes += topic.likeCount
    acc.totalComments += topic.commentCount
    return acc
  }, {
    totalTopics: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  })
}

// 切换页码
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchMyTopics()
  }
}

// 排序变化
const handleSortChange = () => {
  currentPage.value = 1
  fetchMyTopics()
}

// 编辑话题
const editTopic = (topic: TopicVO) => {
  router.push(`/community/topic/${topic.id}`)
}

// 删除话题
const deleteTopic = async (topic: TopicVO) => {
  if (!confirm('确定要删除这个话题吗？删除后无法恢复。')) {
    return
  }
  
  try {
    const response = await topicApi.delete(topic.id)
    if (response.success) {
      // 刷新列表
      fetchMyTopics()
    }
  } catch (error) {
    console.error('删除话题失败:', error)
  }
}

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 页面加载时获取数据
onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  fetchMyTopics()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 