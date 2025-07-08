<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { competitionAwardApi, type CompetitionAwardVO } from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const award = ref<CompetitionAwardVO | null>(null)

// 判断是否为作者（从路由参数获取）
const isAuthor = computed(() => {
  return route.query.isAuthor === 'true'
})

const fetchAwardDetail = async () => {
  const id = parseInt(route.params.id as string)
  if (!id) return
  
  loading.value = true
  error.value = ''
  try {
    const response = await competitionAwardApi.getAwardDetail(id)
    if (response.data) {
      award.value = response.data
    }
  } catch (err: any) {
    console.error('获取获奖详情失败:', err)
    error.value = err.message || '获取获奖详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 删除获奖
const handleDelete = async () => {
  if (!award.value?.id) return
  
  if (!confirm('确定要删除这个获奖记录吗？')) return
  
  loading.value = true
  try {
    await competitionAwardApi.deleteAward(award.value.id)
    router.push('/achievement')
  } catch (err: any) {
    error.value = err.message || '删除失败'
  } finally {
    loading.value = false
  }
}

// 编辑获奖
const handleEdit = () => {
  if (!award.value?.id) return
  router.push({
    path: '/achievement',
    query: {
      edit: 'true',
      type: 'AWARD',
      id: award.value.id
    }
  })
}

// 上传证书
const handleUploadCertificate = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !award.value?.id) return
  
  const file = input.files[0]
  loading.value = true
  try {
    await competitionAwardApi.uploadCertificate(award.value.id, file)
    await fetchAwardDetail()
  } catch (err: any) {
    error.value = err.message || '上传失败'
  } finally {
    loading.value = false
    input.value = ''  // 清空input
  }
}
// 处理文件下载
const handleDownload = (url: string, filename: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}


// 获取奖项级别对应的样式
const getAwardLevelStyle = (level: string) => {
  const styles = {
    'national': {
      bg: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      text: 'text-white',
      icon: '🏆'
    },
    'provincial': {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      text: 'text-white',
      icon: '🎖️'
    },
    'municipal': {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      text: 'text-white',
      icon: '🏅'
    },
    'school': {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      text: 'text-white',
      icon: '🎗️'
    },
    'other': {
      bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
      text: 'text-white',
      icon: '🌟'
    }
  }
  return styles[level as keyof typeof styles] || styles.other
}

onMounted(() => {
  fetchAwardDetail()
})
</script>
<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-500">加载中...</div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500">{{ error }}</div>
    </div>

    <div v-else-if="award" class="w-3/4 mx-auto">
      <!-- 标题栏 -->
      <div class="bg-white shadow-lg rounded-t-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-3xl">🏆</span>
              <h1 class="text-2xl font-bold text-white">{{ award.competitionName }}</h1>
            </div>
            <div class="flex items-center space-x-4">
              <div class="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white">
                {{ award.isVerified ? '已认证' : '待认证' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="px-8 py-4 bg-gray-50 border-b flex justify-between text-sm text-gray-600">
          <div class="flex space-x-8">
            <div class="flex items-center space-x-2">
              <span class="text-xl">📅</span>
              <span>获奖日期：{{ formatDate(award.awardDate) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xl">⏱️</span>
              <span>提交时间：{{ formatDate(award.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="bg-white shadow-lg rounded-b-2xl p-8">
        <div class="space-y-6">
          <!-- 基本信息卡片 -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-2xl mr-2">ℹ️</span>
              基本信息
            </h3>
            <table class="w-full">
              <tbody class="space-y-3">
                <tr>
                  <td class="py-2 text-gray-600 w-1/6">获奖级别</td>
                  <td>
                    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {{ award.awardLevel }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="py-2 text-gray-600">主办方</td>
                  <td class="text-gray-800">{{ award.organizer || '未提供' }}</td>
                </tr>
                <tr>
                  <td class="py-2 text-gray-600">参赛形式</td>
                  <td class="text-gray-800">{{ award.teamMembers ? '团队' : '个人' }}</td>
                </tr>
                <tr>
                  <td class="py-2 text-gray-600">公开状态</td>
                  <td>
                    <span class="px-3 py-1 rounded-full text-sm"
                          :class="award.isPublic ? 'bg-indigo-400 text-white' : 'bg-gray-100 text-gray-800'">
                      {{ award.isPublic ? '公开' : '不公开' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 所属信息卡片 -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-2xl mr-2">🏫</span>
              所属信息
            </h3>
            <table class="w-full">
              <tbody class="space-y-3">
                <tr>
                  <td class="py-2 text-gray-600 w-1/6">学生姓名</td>
                  <td class="text-gray-800">{{ award.userName }}</td>
                </tr>
                <tr>
                  <td class="py-2 text-gray-600">所属组织</td>
                  <td class="text-gray-800">{{ award.organizationName }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 认证信息卡片 -->
          <div v-if="award.isVerified" class="bg-green-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-2xl mr-2">✅</span>
              认证信息
            </h3>
            <table class="w-full">
              <tbody class="space-y-3">
                <tr>
                  <td class="py-2 text-gray-600 w-1/6">认证人</td>
                  <td class="text-gray-800">{{ award.verifierName || '未知' }}</td>
                </tr>
                <tr>
                  <td class="py-2 text-gray-600">认证时间</td>
                  <td class="text-gray-800">
                    {{ award.verifyDate ? formatDate(award.verifyDate) : '未知' }}
                  </td>
                </tr>
                <tr>
                  <td class="py-2 text-gray-600">认证状态</td>
                  <td>
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">已通过</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 团队信息卡片 -->
          <div v-if="award.teamMembers" class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-2xl mr-2">👥</span>
              团队成员
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(member, index) in award.teamMembers.split(',')" :key="index"
                   class="flex items-center space-x-2 bg-white rounded-lg px-4 py-2">
                <span class="text-xl">👤</span>
                <span class="text-gray-800">{{ member.trim() }}</span>
              </div>
            </div>
          </div>

          <!-- 获奖说明 -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-2xl mr-2">📝</span>
              获奖说明
            </h3>
            <div class="prose max-w-none bg-white rounded-lg p-4">
              <p class="text-gray-600 whitespace-pre-line leading-relaxed">{{ award.description }}</p>
            </div>
          </div>

          <!-- 获奖证书 -->
          <div v-if="award.certificateUrl" class="bg-gray-50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold flex items-center">
                <span class="text-2xl mr-2">🎓</span>
                获奖证书
              </h3>
              <button
                @click="handleDownload(award.certificateUrl, '获奖证书')"
                class="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                <span class="text-xl">⬇️</span>
                <span>下载证书</span>
              </button>
            </div>
            <div class="bg-white p-2 rounded-lg max-w-2xl mx-auto">
              <img 
                :src="award.certificateUrl" 
                alt="获奖证书" 
                class="w-full h-auto rounded-lg shadow-sm"
              >
            </div>
          </div>

          <!-- 相关文件 -->
          <div v-if="award.attachments && award.attachments.length > 0" class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-2xl mr-2">📎</span>
              相关文件
            </h3>
            <div class="space-y-3">
              <div v-for="(file, index) in award.attachments" :key="index"
                   class="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                   @click="handleDownload(file.url, file.name)">
                <div class="flex items-center space-x-3">
                  <span class="text-xl">{{ file.type.includes('image') ? '🖼️' : '📄' }}</span>
                  <div>
                    <p class="text-gray-800 font-medium">{{ file.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <span class="text-xl">⬇️</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <div class="flex items-center text-sm text-gray-500">
              <span class="flex items-center">
                <span class="text-xl mr-2">🔄</span>
                最后更新：{{ formatDate(award.updatedAt) }}
              </span>
              <span class="mx-4">|</span>
              <span class="flex items-center">
                <span class="text-xl mr-2">🔑</span>
                ID: {{ award.id }}
              </span>
            </div>
            <div class="flex items-center space-x-4">
            </div>
          </div>
        </div>

        <!-- 操作按钮 - 仅作者可见 -->
        <div v-if="isAuthor" class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-end space-x-4">
            <!-- 上传证书 - 仅未认证时可见 -->
            <template v-if="!award.isVerified">
              <input
                type="file"
                id="certificateUpload"
                class="hidden"
                accept="image/*,application/pdf"
                @change="handleUploadCertificate"
              />
              <label
                for="certificateUpload"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                上传证书
              </label>
              <button
                @click="handleEdit"
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>
            </template>
            <!-- 删除按钮始终可见 -->
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">未找到获奖信息</h3>
      <p class="text-gray-500">该获奖记录可能已被删除或您没有访问权限</p>
    </div>
  </div>
</template>


<style scoped>
.prose {
  line-height: 1.75;
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>