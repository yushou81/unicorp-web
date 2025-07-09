<template>
  <Navbar />
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-6">
      <!-- 面包屑导航 -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/community" class="hover:text-blue-600 transition">社区交流</router-link>
          <span>/</span>
          <span>{{ topic?.categoryName || '话题详情' }}</span>
          <span>/</span>
          <span class="text-gray-900">{{ topic?.title || '加载中...' }}</span>
        </nav>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 主内容区 -->
        <div class="lg:col-span-3">
          <!-- 话题详情 -->
          <div v-if="topic" class="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <!-- 话题头部 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ topic.title }}</h1>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ topic.userName }}</span>
                  </span>
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
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div v-if="isLoggedIn" class="flex items-center space-x-2">
                <button
                  v-if="canEdit"
                  @click="showEditModal = true"
                  class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                >
                  编辑
                </button>
                <button
                  v-if="canDelete"
                  @click="deleteTopic"
                  class="px-3 py-1 text-sm border border-red-300 rounded text-red-600 hover:bg-red-50 transition"
                >
                  删除
                </button>
              </div>
            </div>

            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in topic.tags"
                :key="tag.id"
                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- 话题内容 -->
            <div class="prose max-w-none mb-6">
              <div class="whitespace-pre-wrap text-gray-800">{{ topic.content }}</div>
            </div>

            <!-- 交互按钮 -->
            <div class="flex items-center justify-between pt-4 border-t">
              <div class="flex items-center space-x-4">
                <button
                  @click="handleLike"
                  :class="[
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition',
                    topic.isLiked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ topic.likeCount }}</span>
                </button>
                
                <button
                  @click="handleFavorite"
                  :class="[
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition',
                    topic.isFavorited
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{{ topic.favoriteCount }}</span>
                </button>
                
                <button
                  @click="focusCommentInput"
                  class="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{{ topic.commentCount }}</span>
                </button>
              </div>
              
              <div class="flex items-center space-x-2">
                <span v-if="topic.isSticky" class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">置顶</span>
                <span v-if="topic.isEssence" class="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">精华</span>
              </div>
            </div>
          </div>

          <!-- 评论区域 -->
          <div class="bg-white rounded-2xl shadow-lg border p-8 mt-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m2-4h4a2 2 0 012 2v4H8V6a2 2 0 012-2z" />
              </svg>
              评论 ({{ topic?.commentCount || 0 }})
            </h3>
            
            <!-- 发表评论 -->
            <div v-if="isLoggedIn" class="mb-8">
              <div class="flex items-start space-x-4 bg-gray-50 rounded-xl shadow p-6">
                <img
                  :src="userAvatar"
                  :alt="userInfo.nickname"
                  class="w-12 h-12 rounded-full border-2 border-blue-200 shadow-sm object-cover"
                />
                <div class="flex-1">
                  <textarea
                    ref="commentInput"
                    v-model="newComment"
                    rows="3"
                    placeholder="写下你的评论..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-base shadow-sm"
                  ></textarea>
                  <div class="flex items-center justify-end space-x-3 mt-3">
                    <button
                      @click="submitComment"
                      :disabled="!newComment.trim() || submitting"
                      class="px-6 py-2 bg-blue-600 text-white rounded-full text-base font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {{ submitting ? '发表中...' : (replyTo ? '回复' : '发表评论') }}
                    </button>
                    <button v-if="replyTo" @click="replyTo = null" class="px-4 py-2 text-gray-500 border rounded-full hover:bg-gray-100">取消回复</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评论列表 -->
            <div class="space-y-6">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="bg-white rounded-xl shadow border border-gray-100 p-5 group hover:shadow-lg transition mb-4"
              >
                <div class="flex items-start space-x-4">
                  <img
                    :src="comment.authorAvatar || comment.userAvatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
                    :alt="comment.authorName || comment.userName"
                    class="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                  />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-2">
                        <span class="font-semibold text-gray-900">{{ comment.authorName || comment.userName }}</span>
                        <span class="text-xs text-gray-400">{{ formatTime(comment.createdAt) }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          @click="likeComment(comment)"
                          :class="[
                            'flex items-center space-x-1 text-sm rounded-full px-3 py-1 border',
                            comment.isLiked
                              ? 'bg-red-50 border-red-200 text-red-600'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300'
                          ]"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{{ comment.likeCount }}</span>
                        </button>
                        <button
                          @click="replyToComment(comment)"
                          class="flex items-center text-sm text-blue-500 hover:text-blue-700 rounded-full px-3 py-1 border border-blue-100 bg-blue-50 ml-1"
                        >
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h7V3m0 0l11 11-4 4-7-7z" />
                          </svg>
                          回复
                        </button>
                        <button
                          v-if="canDeleteComment(comment)"
                          @click="deletingComment = comment"
                          class="ml-1 px-3 py-1 text-xs border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition"
                        >
                          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          删除
                        </button>
                      </div>
                    </div>
                    <div class="text-gray-800 text-base leading-relaxed mt-1 mb-1 whitespace-pre-line">{{ comment.content }}</div>
                    <div class="flex items-center space-x-2 mt-2">
                      <button
                        @click="loadReplies(comment.id)"
                        class="text-xs text-blue-500 hover:text-blue-700 rounded-full px-2 py-1 border border-blue-100 bg-blue-50"
                      >
                        {{ repliesVisible[comment.id] ? '收起回复' : '查看回复' }}
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="repliesVisible[comment.id]" class="pl-14 mt-2 space-y-2">
                  <div v-if="repliesLoading[comment.id]" class="text-gray-400 text-sm">加载中...</div>
                  <div v-else-if="(repliesMap[comment.id] && repliesMap[comment.id].length === 0)" class="text-gray-400 text-sm">暂无回复</div>
                  <div
                    v-for="reply in repliesMap[comment.id]"
                    :key="reply.id"
                    class="flex items-start space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow transition"
                  >
                    <img :src="reply.authorAvatar || reply.userAvatar || 'https://randomuser.me/api/portraits/men/32.jpg'" :alt="reply.authorName || reply.userName" class="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-semibold text-gray-900">{{ reply.authorName || reply.userName }}</span>
                        <span class="text-xs text-gray-400">{{ formatTime(reply.createdAt) }}</span>
                      </div>
                      <div class="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{{ reply.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="comments.length === 0" class="text-center py-16">
              <svg class="w-14 h-14 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-gray-500 text-lg">还没有评论，快来发表第一条评论吧！</p>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="lg:col-span-1">
          <!-- 作者信息 -->
          <div v-if="topic" class="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">作者信息</h3>
            <div class="flex items-center space-x-3">
              <img
                :src="topic.userAvatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
                :alt="topic.userName"
                class="w-12 h-12 rounded-full border border-gray-200"
              />
              <div>
                <h4 class="font-medium text-gray-900">{{ topic.userName }}</h4>
                <p class="text-sm text-gray-500">发布者</p>
              </div>
            </div>
          </div>

          <!-- 相关话题 -->
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">相关话题</h3>
            <div class="space-y-3">
              <div
                v-for="relatedTopic in relatedTopics"
                :key="relatedTopic.id"
                class="border-b border-gray-100 pb-3 last:border-b-0"
              >
                <div
                  class="block hover:text-blue-600 transition cursor-pointer"
                  @click="handleRelatedTopicClick(relatedTopic)"
                >
                  <h4 class="font-medium text-gray-900 line-clamp-2 mb-1">{{ relatedTopic.title }}</h4>
                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>{{ relatedTopic.userName }}</span>
                    <span>{{ formatTime(relatedTopic.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑话题模态框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">编辑话题</h3>
          <button
            @click="showEditModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="updateTopic">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <textarea
                  v-model="editForm.content"
                  required
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
            
            <div class="flex items-center justify-end space-x-4 mt-6">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="updating"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {{ updating ? '更新中...' : '更新话题' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 删除评论确认弹窗 -->
    <div v-if="deletingComment" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
        <h3 class="text-xl font-bold mb-4 text-gray-900">确认删除评论</h3>
        <p class="text-gray-700 mb-8">确定要删除这条评论吗？此操作不可恢复。</p>
        <div class="flex justify-end space-x-4">
          <button @click="deletingComment = null" class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-base">取消</button>
          <button @click="deleteComment" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-base font-semibold shadow">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { topicApi, commentApi, interactionApi, type TopicVO, type CommentVO } from '@/lib/api/community'
import Navbar from '@/components/layout/Navbar.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 响应式数据
const topic = ref<TopicVO | null>(null)
const comments = ref<CommentVO[]>([])
const relatedTopics = ref<TopicVO[]>([])
const loading = ref(false)
const submitting = ref(false)
const updating = ref(false)
const showEditModal = ref(false)
const newComment = ref('')
const commentInput = ref<HTMLTextAreaElement>()
const replyTo = ref<CommentVO | null>(null)
const deletingComment = ref<CommentVO | null>(null)
const repliesMap = ref<Record<number, CommentVO[]>>({})
const repliesLoading = ref<Record<number, boolean>>({})
const repliesVisible = ref<Record<number, boolean>>({})

// 编辑表单
const editForm = ref({
  title: '',
  content: ''
})

// 计算属性
const isLoggedIn = computed(() => !!appStore.user)
const userInfo = computed(() => appStore.user as any || {})
const userAvatar = computed(() => userInfo.value?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg')
const canEdit = computed(() => isLoggedIn.value && topic.value?.userId === userInfo.value?.id)
const canDelete = computed(() => isLoggedIn.value && (topic.value?.userId === userInfo.value?.id || userInfo.value?.role === 'ADMIN'))

// 判断是否可以删除评论
const canDeleteComment = (comment: CommentVO) => {
  return isLoggedIn.value && (comment.authorId === userInfo.value?.id || comment.userId === userInfo.value?.id)
}

// 删除评论
const deleteComment = async () => {
  if (!deletingComment.value) return
  try {
    await commentApi.delete(deletingComment.value.id)
    deletingComment.value = null
    await fetchComments()
    if (topic.value && topic.value.commentCount > 0) {
      topic.value.commentCount--
    }
  } catch (error) {
    console.error('删除评论失败:', error)
  }
}

// 获取话题详情
const fetchTopicDetail = async () => {
  const topicId = Number(route.params.id)
  if (!topicId) return
  
  loading.value = true
  try {
    const response = await topicApi.getDetail(topicId)
    if (response.success) {
      topic.value = response.data
      // 初始化编辑表单
      editForm.value = {
        title: topic.value.title,
        content: topic.value.content
      }
    }
  } catch (error) {
    console.error('获取话题详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取评论列表
const fetchComments = async () => {
  const topicId = Number(route.params.id)
  if (!topicId) return
  
  try {
    const response = await commentApi.getTopicComments(topicId)
    if (response.success) {
      comments.value = response.data.records
    }
  } catch (error) {
    console.error('获取评论列表失败:', error)
  }
}

// 获取相关话题
const fetchRelatedTopics = async () => {
  const topicId = Number(route.params.id)
  if (!topicId) return
  
  try {
    const response = await topicApi.getRecommend(5)
    if (response.success) {
      relatedTopics.value = response.data.filter(t => t.id !== topicId).slice(0, 3)
      console.log('相关话题数据:', relatedTopics.value)
    }
  } catch (error) {
    console.error('获取相关话题失败:', error)
  }
}

// 处理相关话题点击
const handleRelatedTopicClick = (topic: TopicVO) => {
  console.log('点击相关话题:', topic)
  console.log('跳转路径:', `/community/topic/${topic.id}`)
  
  // 强制路由跳转并重新加载数据
  router.push(`/community/topic/${topic.id}`).then(() => {
    // 重新获取数据
    fetchTopicDetail()
    fetchComments()
    fetchRelatedTopics()
  }).catch((error) => {
    console.error('路由跳转失败:', error)
  })
}

// 点赞话题
const handleLike = async () => {
  if (!isLoggedIn.value || !topic.value) return
  
  try {
    if (topic.value.isLiked) {
      await interactionApi.unlike(topic.value.id, 'topic')
      topic.value.likeCount--
      topic.value.isLiked = false
    } else {
      await interactionApi.like(topic.value.id, 'topic')
      topic.value.likeCount++
      topic.value.isLiked = true
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 收藏话题
const handleFavorite = async () => {
  if (!isLoggedIn.value || !topic.value) return
  
  try {
    if (topic.value.isFavorited) {
      await interactionApi.unfavorite(topic.value.id, 'topic')
      topic.value.favoriteCount--
      topic.value.isFavorited = false
    } else {
      await interactionApi.favorite(topic.value.id, 'topic')
      topic.value.favoriteCount++
      topic.value.isFavorited = true
    }
  } catch (error) {
    console.error('收藏失败:', error)
  }
}

// 点赞评论
const likeComment = async (comment: CommentVO) => {
  if (!isLoggedIn.value) return
  
  try {
    if (comment.isLiked) {
      await interactionApi.unlike(comment.id, 'comment')
      comment.likeCount--
      comment.isLiked = false
    } else {
      await interactionApi.like(comment.id, 'comment')
      comment.likeCount++
      comment.isLiked = true
    }
  } catch (error) {
    console.error('点赞评论失败:', error)
  }
}

// 回复评论
const replyToComment = (comment: CommentVO) => {
  replyTo.value = comment
  newComment.value = ''
  focusCommentInput()
}

// 聚焦评论输入框
const focusCommentInput = () => {
  setTimeout(() => {
    commentInput.value?.focus()
  }, 100)
}

// 提交评论
const submitComment = async () => {
  if (!isLoggedIn.value || !topic.value || !newComment.value.trim()) return
  submitting.value = true
  try {
    const payload: any = {
      topicId: topic.value.id,
      content: newComment.value.trim()
    }
    if (replyTo.value) {
      payload.parentId = replyTo.value.id
    }
    const response = await commentApi.create(payload)
    if (response.success) {
      newComment.value = ''
      replyTo.value = null
      await fetchComments()
      if (topic.value) {
        topic.value.commentCount++
      }
    }
  } catch (error) {
    console.error('发表评论失败:', error)
  } finally {
    submitting.value = false
  }
}

// 更新话题
const updateTopic = async () => {
  if (!topic.value) return
  
  updating.value = true
  try {
    const response = await topicApi.update(topic.value.id, {
      title: editForm.value.title,
      content: editForm.value.content,
      categoryId: topic.value.categoryId
    })
    
    if (response.success) {
      showEditModal.value = false
      // 刷新话题详情
      await fetchTopicDetail()
    }
  } catch (error) {
    console.error('更新话题失败:', error)
  } finally {
    updating.value = false
  }
}

// 删除话题
const deleteTopic = async () => {
  if (!topic.value || !confirm('确定要删除这个话题吗？')) return
  
  try {
    const response = await topicApi.delete(topic.value.id)
    if (response.success) {
      router.push('/community')
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

const loadReplies = async (commentId: number) => {
  if (repliesVisible.value[commentId]) {
    repliesVisible.value[commentId] = false
    return
  }
  repliesVisible.value[commentId] = true
  if (repliesMap.value[commentId]) return
  repliesLoading.value[commentId] = true
  const res = await commentApi.getCommentReplies(commentId, { page: 1, size: 10 })
  if (res.success) {
    repliesMap.value[commentId] = res.data.records
  } else {
    repliesMap.value[commentId] = []
  }
  repliesLoading.value[commentId] = false
}

// 监听路由参数变化
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    console.log('路由参数变化，重新加载数据:', newId)
    fetchTopicDetail()
    fetchComments()
    fetchRelatedTopics()
  }
})

// 页面加载时获取数据
onMounted(() => {
  fetchTopicDetail()
  fetchComments()
  fetchRelatedTopics()
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