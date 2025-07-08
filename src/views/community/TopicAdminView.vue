<template>
  <div class="p-6">
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
    <table class="w-full border mb-4">
      <thead>
        <tr>
          <th class="border px-2 py-1">ID</th>
          <th class="border px-2 py-1">标题</th>
          <th class="border px-2 py-1">作者</th>
          <th class="border px-2 py-1">板块</th>
          <th class="border px-2 py-1">置顶</th>
          <th class="border px-2 py-1">精华</th>
          <th class="border px-2 py-1">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="topic in topics" :key="topic.id">
          <td class="border px-2 py-1">{{ topic.id }}</td>
          <td class="border px-2 py-1">{{ topic.title }}</td>
          <td class="border px-2 py-1">{{ topic.authorName }}</td>
          <td class="border px-2 py-1">{{ topic.categoryName }}</td>
          <td class="border px-2 py-1">
            <button @click="toggleSticky(topic)" :class="topic.isSticky ? 'text-green-600' : 'text-gray-400'">
              {{ topic.isSticky ? '已置顶' : '未置顶' }}
            </button>
          </td>
          <td class="border px-2 py-1">
            <button @click="toggleEssence(topic)" :class="topic.isEssence ? 'text-yellow-600' : 'text-gray-400'">
              {{ topic.isEssence ? '精华' : '普通' }}
            </button>
          </td>
          <td class="border px-2 py-1">
            <button @click="editTopic(topic)" class="text-blue-500 mr-2">编辑</button>
            <button @click="deleteTopic(topic)" class="text-red-500">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
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

const fetchTopics = async () => {
  let url = '/v1/community/topics'
  let params: any = { page: page.value, size: size.value }
  if (searchKeyword.value) {
    url = '/v1/community/topics/search'
    params.keyword = searchKeyword.value
  }
  const res = await apiRequest('get', url, { params })
  if (res?.success && res.data) {
    topics.value = res.data.records
    total.value = res.data.total
  }
}

const changePage = (p: number) => {
  page.value = p
  fetchTopics()
}

const toggleSticky = async (topic: any) => {
  await apiRequest('put', `/v1/community/topics/${topic.id}/sticky`, {
    params: { isSticky: !topic.isSticky }
  })
  fetchTopics()
}

const toggleEssence = async (topic: any) => {
  await apiRequest('put', `/v1/community/topics/${topic.id}/essence`, {
    params: { isEssence: !topic.isEssence }
  })
  fetchTopics()
}

const editTopic = (topic: any) => {
  alert('编辑功能可根据需要补充')
}

const deleteTopic = async (topic: any) => {
  if (confirm(`确定要删除话题「${topic.title}」吗？`)) {
    await apiRequest('delete', `/v1/community/topics/${topic.id}`)
    fetchTopics()
  }
}

const totalPages = computed(() => Math.ceil(total.value / size.value))

onMounted(fetchTopics)
</script> 