<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative">
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        @click="$emit('close')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-2xl font-bold mb-4">话题管理</h2>
      <div class="flex mb-4">
        <input
          v-model="searchKeyword"
          @keyup.enter="fetchTopics"
          placeholder="搜索话题标题"
          class="border rounded px-2 py-1 mr-2"
        />
        <button @click="fetchTopics" class="bg-blue-500 text-white px-4 py-1 rounded">搜索</button>
      </div>
      <div class="overflow-x-auto rounded-lg shadow border bg-white mb-4">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">标题</th>
              <th class="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">作者</th>
              <th class="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">板块</th>
              <th class="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase">置顶</th>
              <th class="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase">精华</th>
              <th class="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="topic in topics" :key="topic.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm text-gray-900 max-w-xs truncate" :title="topic.title">
                {{ topic.title }}
              </td>
              <td class="px-4 py-2 text-sm text-gray-600">{{ topic.authorName }}</td>
              <td class="px-4 py-2 text-sm text-gray-600">{{ topic.categoryName }}</td>
              <td class="px-4 py-2 text-center">
                <button
                  @click="toggleSticky(topic)"
                  :class="[
                    'px-2 py-1 text-xs rounded',
                    topic.isSticky
                      ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  {{ topic.isSticky ? '已置顶' : '置顶' }}
                </button>
              </td>
              <td class="px-4 py-2 text-center">
                <button
                  @click="toggleEssence(topic)"
                  :class="[
                    'px-2 py-1 text-xs rounded',
                    topic.isEssence
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  {{ topic.isEssence ? '已精华' : '精华' }}
                </button>
              </td>
              <td class="px-4 py-2 text-center space-x-2">
                <button
                  @click="openEditModal(topic)"
                  class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  编辑
                </button>
                <button
                  @click="openDeleteModal(topic)"
                  class="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  删除
                </button>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-8 text-gray-400">加载中...</td>
            </tr>
            <tr v-if="!loading && topics.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-400">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="changePage(p)"
          :class="['px-3 py-1 mx-1 rounded', page === p ? 'bg-blue-500 text-white' : 'bg-gray-200']"
        >
          {{ p }}
        </button>
      </div>
      <!-- 编辑弹窗 -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">编辑话题</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                v-model="editForm.title"
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="话题标题"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">内容</label>
              <textarea
                v-model="editForm.content"
                rows="4"
                class="w-full border rounded px-3 py-2"
                placeholder="话题内容"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showEditModal = false"
              class="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      </div>
      <!-- 删除确认弹窗 -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
          <h3 class="text-lg font-semibold mb-4">确认删除</h3>
          <p class="text-gray-600 mb-6">
            确定要删除话题"{{ topicToDelete?.title }}"吗？此操作不可恢复。
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiRequest } from '@/lib/api/apiClient'

const topics = ref<any[]>([])
const page = ref(1)
const size = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const loading = ref(false)

// 递归获取所有板块id
function getAllCategoryIds(categories) {
  let ids = []
  for (const cat of categories) {
    ids.push(cat.id)
    if (cat.children && cat.children.length > 0) {
      ids = ids.concat(getAllCategoryIds(cat.children))
    }
  }
  return ids
}

const showDeleteModal = ref(false)
const topicToDelete = ref<any>(null)
const showEditModal = ref(false)
const editingTopic = ref<any>(null)
const editForm = ref({
  title: '',
  content: '',
  categoryId: null
})

const fetchTopics = async () => {
  loading.value = true
  try {
    // 1. 获取所有板块树
    const catRes = await apiRequest('/v1/community/categories/tree', { method: 'GET' })
    const allCategoryIds = getAllCategoryIds(catRes.data || [])

    // 2. 遍历所有板块id，获取话题
    let all = []
    for (const id of allCategoryIds) {
      let params: any = { page: 1, size: 100 }
      if (searchKeyword.value) params.keyword = searchKeyword.value
      let url = `/v1/community/topics/category/${id}`
      // 如需支持搜索，可用 /v1/community/topics/search?keyword=xxx&categoryId=xxx
      const res = await apiRequest(url, { method: 'GET', params })
      if (res?.success && res.data?.records) {
        all = all.concat(res.data.records)
      }
    }
    topics.value = all
    total.value = all.length
  } catch (e) {
    topics.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const changePage = (p: number) => {
  page.value = p
  fetchTopics()
}

const toggleSticky = async (topic: any) => {
  await apiRequest(`/v1/community/topics/${topic.id}/sticky`, {
    method: 'PUT',
    params: { isSticky: !topic.isSticky }
  })
  fetchTopics()
}

const toggleEssence = async (topic: any) => {
  await apiRequest(`/v1/community/topics/${topic.id}/essence`, {
    method: 'PUT',
    params: { isEssence: !topic.isEssence }
  })
  fetchTopics()
}

const editTopic = (topic: any) => {
  alert('编辑功能可根据需要补充')
}

const openDeleteModal = (topic: any) => {
  topicToDelete.value = topic
  showDeleteModal.value = true
}

const confirmDeleteTopic = async () => {
  if (!topicToDelete.value) return
  await apiRequest(`/v1/community/topics/${topicToDelete.value.id}`, {
    method: 'DELETE'
  })
  showDeleteModal.value = false
  topicToDelete.value = null
  fetchTopics()
}

const openEditModal = (topic: any) => {
  editingTopic.value = topic
  editForm.value = {
    title: topic.title,
    content: topic.content,
    categoryId: topic.categoryId
  }
  showEditModal.value = true
}

const saveEdit = async () => {
  try {
    await apiRequest(`/v1/community/topics/${editingTopic.value.id}`, {
      method: 'PUT',
      body: editForm.value
    })
    showEditModal.value = false
    fetchTopics()
  } catch (error) {
    console.error('编辑失败:', error)
  }
}

const totalPages = computed(() => Math.ceil(total.value / size.value))

onMounted(fetchTopics)
</script> 