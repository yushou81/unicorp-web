<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-8">
      <router-link 
        :to="`/classroom/${courseId}/chapter/${chapterId}`" 
        class="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回章节详情
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">编辑章节</h1>
    </div>

    <div v-if="loading" class="py-10 flex justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="py-6 text-center text-red-500">
      {{ error }}
    </div>
    
    <div v-else-if="!chapter" class="py-6 text-center text-gray-500">
      章节不存在或已被删除
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧章节编辑 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">章节信息</h2>
          
          <form @submit.prevent="saveChapter">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">章节标题</label>
              <input 
                v-model="chapterForm.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">章节描述</label>
              <textarea 
                v-model="chapterForm.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="请输入章节的详细描述..."
              ></textarea>
            </div>
            
            <div class="flex items-center mb-4">
              <input 
                v-model="chapterForm.isPublished"
                type="checkbox"
                id="isPublished"
                class="mr-2"
              />
              <label for="isPublished" class="text-sm font-medium text-gray-700">
                发布章节（学生可见）
              </label>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button 
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="saving" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </span>
                <span v-else>保存章节</span>
              </button>
            </div>
          </form>
        </div>
        
        <!-- 章节资源管理 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <ChapterResourceManager 
            :chapter-id="chapterId" 
            :course-id="courseId"
            @resource-added="onResourceAdded"
            @resource-removed="onResourceRemoved"
          />
        </div>
      </div>
      
      <!-- 右侧预览 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">章节预览</h3>
          
          <div class="prose max-w-none">
            <h4 class="text-lg font-medium text-gray-900 mb-2">{{ chapterForm.title || '章节标题' }}</h4>
            <p class="text-gray-700 text-sm">{{ chapterForm.description || '暂无章节描述' }}</p>
            
            <div class="mt-4">
              <span 
                :class="[
                  'px-2 py-1 text-xs rounded',
                  chapterForm.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ chapterForm.isPublished ? '已发布' : '未发布' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 章节统计 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">章节统计</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">创建时间</span>
              <span class="text-sm text-gray-900">{{ formatDate(chapter.createdAt) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">更新时间</span>
              <span class="text-sm text-gray-900">{{ formatDate(chapter.updatedAt) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">资源数量</span>
              <span class="text-sm text-gray-900">{{ chapter.resourceCount }} 个</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">章节序号</span>
              <span class="text-sm text-gray-900">第 {{ chapter.sequence }} 章</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  getChapterById,
  updateChapter,
  updateChapterPublishStatus,
  CourseChapterVO
} from '@/lib/api/classroom'
import ChapterResourceManager from '@/components/classroom/ChapterResourceManager.vue'

// 路由和导航
const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const chapter = ref<CourseChapterVO | null>(null)
const chapterForm = ref({
  title: '',
  description: '',
  isPublished: false
})

// 路由参数
const chapterId = computed(() => Number(route.params.chapterId) || 0)
const courseId = computed(() => Number(route.params.courseId) || 0)

// 加载章节详情
const loadChapter = async () => {
  if (!chapterId.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await getChapterById(chapterId.value)
    if (res.code === 200) {
      chapter.value = res.data
      chapterForm.value = {
        title: res.data.title,
        description: res.data.description,
        isPublished: res.data.isPublished
      }
    } else {
      error.value = res.message || '获取章节详情失败'
    }
  } catch (err) {
    console.error('加载章节错误:', err)
    error.value = '加载章节时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 保存章节
const saveChapter = async () => {
  if (!chapter.value || !chapterForm.value.title.trim()) return
  
  saving.value = true
  error.value = ''
  
  try {
    // 更新章节基本信息
    const res = await updateChapter(chapter.value.id, {
      courseId: chapter.value.courseId,
      title: chapterForm.value.title.trim(),
      description: chapterForm.value.description.trim()
    })
    
    if (res.code === 200) {
      // 更新发布状态
      if (res.data.isPublished !== chapterForm.value.isPublished) {
        await updateChapterPublishStatus(chapter.value.id, chapterForm.value.isPublished)
      }
      
      // 重新加载章节信息
      await loadChapter()
      
      // 显示成功消息
      alert('章节保存成功！')
    } else {
      error.value = res.message || '保存章节失败'
    }
  } catch (err) {
    console.error('保存章节错误:', err)
    error.value = '保存章节时出错，请稍后再试'
  } finally {
    saving.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  if (confirm('确定要取消编辑吗？未保存的更改将丢失。')) {
    router.push(`/classroom/${courseId.value}/chapter/${chapterId.value}`)
  }
}

// 资源管理事件处理
const onResourceAdded = (resourceId: number) => {
  // 重新加载章节信息以更新资源数量
  loadChapter()
}

const onResourceRemoved = (resourceId: number) => {
  // 重新加载章节信息以更新资源数量
  loadChapter()
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 监听路由参数变化
watch([() => route.params.chapterId, () => route.params.courseId], () => {
  loadChapter()
}, { immediate: true })
</script> 