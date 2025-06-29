<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">项目管理</h2>
        <div class="flex items-center space-x-2">
          <input
            v-model="keyword"
            @keyup.enter="fetchProjects"
            type="text"
            placeholder="请输入关键词"
            class="border rounded px-2 py-1"
          />
          <button
            @click="fetchProjects"
            class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >搜索</button>
          <router-link to="/project/publish">
            <button class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">发布新项目</button>
          </router-link>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.id" class="bg-white rounded-xl shadow p-6 flex flex-col">
          <h3 class="font-semibold text-lg mb-2">{{ project.name }}</h3>
          <div class="text-gray-500 text-sm mb-2">{{ project.type }} · {{ project.status }}</div>
          <p class="text-gray-700 flex-1 mb-4">{{ project.description }}</p>
          <div class="flex justify-between items-center mb-2">
            <router-link :to="`/project/${project.id}`" class="text-blue-600 hover:underline">详情</router-link>
            <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700" v-if="project.recommended">推荐</span>
          </div>
          <div class="flex space-x-2">
            <button @click="editProject(project.id)" class="px-2 py-1 rounded bg-yellow-400 text-white text-xs">编辑</button>
            <button @click="deleteProject(project.id)" class="px-2 py-1 rounded bg-red-500 text-white text-xs">删除</button>
            <button @click="showApplications(project.id)" class="px-2 py-1 rounded bg-blue-200 text-blue-800 text-xs">查看申请人</button>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-8 space-x-2">
        <button :disabled="page === 0" @click="page-- && fetchProjects()" class="px-3 py-1 rounded border">上一页</button>
        <span>第 {{ page + 1 }} 页</span>
        <button :disabled="projects.length < size" @click="page++ && fetchProjects()" class="px-3 py-1 rounded border">下一页</button>
      </div>
      <div v-if="showAppDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <h3 class="text-lg font-bold mb-4">项目申请人列表</h3>
          <ul>
            <li v-for="app in applications" :key="app.id" class="flex justify-between items-center mb-2">
              <span>{{ app.studentName }}（{{ app.status }}）</span>
              <div v-if="app.status === 'pending'">
                <button @click="approve(app.id)" class="px-2 py-1 bg-green-500 text-white rounded text-xs mr-2">批准</button>
                <button @click="reject(app.id)" class="px-2 py-1 bg-red-400 text-white rounded text-xs">拒绝</button>
              </div>
            </li>
            <li v-if="applications.length === 0" class="text-gray-400">暂无申请人</li>
          </ul>
          <button @click="showAppDialog = false" class="mt-4 px-4 py-1 bg-gray-200 rounded">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects, deleteProject, getProjectApplications, updateApplicationStatus } from '@/lib/api/project'

const projects = ref([])
const loading = ref(true)
const error = ref('')
const page = ref(0)
const size = ref(10)
const keyword = ref('')

const router = useRouter()

async function fetchProjects() {
  loading.value = true
  try {
    const res = await getProjects({ page: page.value, size: size.value, keyword: keyword.value })
    projects.value = res.data?.records || []
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

function editProject(id: number) {
  router.push(`/project/publish?id=${id}`)
}

async function deleteProjectHandler(id: number) {
  if (confirm('确定要删除该项目吗？')) {
    await deleteProject(id)
    fetchProjects()
  }
}

const showAppDialog = ref(false)
const applications = ref([])
let currentProjectId = null

async function showApplications(projectId: number) {
  currentProjectId = projectId
  showAppDialog.value = true
  const res = await getProjectApplications(projectId)
  applications.value = res.data?.records || []
}

async function approve(appId: number) {
  await updateApplicationStatus(appId, { status: 'approved' })
  alert('已批准')
  showApplications(currentProjectId)
}
async function reject(appId: number) {
  await updateApplicationStatus(appId, { status: 'rejected' })
  alert('已拒绝')
  showApplications(currentProjectId)
}

onMounted(fetchProjects)
</script>