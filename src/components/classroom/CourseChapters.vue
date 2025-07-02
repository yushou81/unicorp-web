<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">课程大纲</h2>
      <div v-if="isTeacher">
        <button 
          @click="showAddChapter = true" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          添加章节
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="py-10 flex justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="py-6 text-center text-red-500">
      {{ error }}
    </div>
    
    <div v-else-if="chapters.length === 0" class="py-6 text-center text-gray-500">
      暂无章节内容
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="(chapter, index) in chapters" 
        :key="chapter.id" 
        class="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium text-gray-900">
            第{{ index + 1 }}章：{{ chapter.title }}
            <span 
              v-if="!chapter.isPublished" 
              class="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded"
            >
              未发布
            </span>
          </h3>
          <div class="flex space-x-2">
            <span 
              v-if="chapter.resourceCount > 0" 
              class="text-sm text-gray-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ chapter.resourceCount }}个资源
            </span>
            
            <div v-if="isTeacher" class="flex space-x-1">
              <button 
                @click="editChapter(chapter)" 
                class="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="编辑章节"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button 
                @click="togglePublishStatus(chapter)" 
                class="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                :title="chapter.isPublished ? '取消发布' : '发布章节'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="chapter.isPublished" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button 
                @click="moveChapter(chapter, 'up')" 
                :disabled="index === 0"
                :class="[index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600']"
                class="p-1 transition-colors"
                title="上移"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              
              <button 
                @click="moveChapter(chapter, 'down')" 
                :disabled="index === chapters.length - 1"
                :class="[index === chapters.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600']"
                class="p-1 transition-colors"
                title="下移"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button 
                @click="confirmDeleteChapter(chapter)" 
                class="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="删除章节"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <p class="text-gray-600 text-sm mb-2">{{ chapter.description }}</p>
        
        <div v-if="isStudent && chapter.progressInfo" class="mt-2">
          <div class="relative pt-1">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold inline-block text-blue-600">
                  学习进度
                </span>
              </div>
              <div class="text-right">
                <span class="text-xs font-semibold inline-block text-blue-600">
                  {{ chapter.progressInfo.progressPercent }}%
                </span>
              </div>
            </div>
            <div class="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200">
              <div 
                :style="{ width: `${chapter.progressInfo.progressPercent}%` }"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
            <div class="flex justify-end mt-1">
              <span class="text-xs text-gray-500">
                {{ chapter.progressInfo.status === 'completed' ? '已完成' : 
                   chapter.progressInfo.status === 'in_progress' ? '学习中' : '未开始' }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="chapter.isPublished || isTeacher" class="mt-2 flex">
          <button 
            @click="viewChapter(chapter)" 
            class="text-blue-600 text-sm hover:text-blue-800 transition-colors flex items-center"
          >
            {{ isStudent ? '继续学习' : '查看详情' }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑章节对话框 -->
    <div 
      v-if="showAddChapter || editingChapter" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingChapter ? '编辑章节' : '添加章节' }}
        </h3>
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
              rows="4"
            ></textarea>
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
              class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div 
      v-if="deletingChapter" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-2">确认删除</h3>
        <p class="text-gray-600 mb-4">
          确定要删除章节 "{{ deletingChapter.title }}" 吗？此操作不可撤销。
        </p>
        <div class="flex justify-end space-x-2">
          <button 
            @click="deletingChapter = null"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            @click="deleteChapter"
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getChaptersByCourseId, 
  createChapter, 
  updateChapter, 
  deleteChapter as deleteChapterApi,
  updateChapterPublishStatus,
  updateChapterSequence,
  getStudentProgressInCourse,
  CourseChapterVO,
  LearningProgressVO
} from '@/lib/api/classroom'

// 属性定义
const props = defineProps({
  courseId: {
    type: Number,
    required: true
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  isStudent: {
    type: Boolean,
    default: false
  },
  studentId: {
    type: Number,
    default: null
  }
})

// 事件
const emit = defineEmits(['chapter-saved', 'chapter-deleted', 'chapter-updated'])

// 状态
const router = useRouter()
const loading = ref(false)
const error = ref('')
const chapters = ref<(CourseChapterVO & { progressInfo?: LearningProgressVO })[]>([])
const showAddChapter = ref(false)
const editingChapter = ref<CourseChapterVO | null>(null)
const deletingChapter = ref<CourseChapterVO | null>(null)
const chapterForm = ref({
  title: '',
  description: ''
})

// 方法
const loadChapters = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const res = await getChaptersByCourseId(props.courseId)
    if (res.code === 200) {
      chapters.value = res.data
      
      // 如果是学生，加载学习进度
      if (props.isStudent && props.studentId) {
        await loadProgressInfo()
      }
    } else {
      error.value = res.message || '获取章节失败'
    }
  } catch (err) {
    console.error('加载章节错误:', err)
    error.value = '加载章节时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

const loadProgressInfo = async () => {
  try {
    const res = await getStudentProgressInCourse(props.courseId, props.studentId as number)
    if (res.code === 200) {
      // 将进度信息关联到对应章节
      chapters.value = chapters.value.map(chapter => {
        const progressInfo = res.data.find(p => p.chapterId === chapter.id)
        return {
          ...chapter,
          progressInfo: progressInfo || null
        }
      })
    }
  } catch (err) {
    console.error('加载学习进度错误:', err)
  }
}

const editChapter = (chapter: CourseChapterVO) => {
  editingChapter.value = chapter
  chapterForm.value = {
    title: chapter.title,
    description: chapter.description
  }
}

const saveChapter = async () => {
  if (!chapterForm.value.title.trim()) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    if (editingChapter.value) {
      // 更新章节
      const res = await updateChapter(editingChapter.value.id, {
        courseId: props.courseId,
        title: chapterForm.value.title.trim(),
        description: chapterForm.value.description.trim()
      })
      
      if (res.code === 200) {
        // 更新本地章节列表
        const index = chapters.value.findIndex(c => c.id === editingChapter.value?.id)
        if (index !== -1) {
          chapters.value[index] = {
            ...chapters.value[index],
            title: chapterForm.value.title.trim(),
            description: chapterForm.value.description.trim()
          }
        }
        
        emit('chapter-updated', res.data)
      } else {
        error.value = res.message || '更新章节失败'
      }
    } else {
      // 创建新章节
      const res = await createChapter({
        courseId: props.courseId,
        title: chapterForm.value.title.trim(),
        description: chapterForm.value.description.trim()
      })
      
      if (res.code === 200) {
        chapters.value.push(res.data)
        emit('chapter-saved', res.data)
      } else {
        error.value = res.message || '创建章节失败'
      }
    }
    
    // 重置表单和状态
    cancelEdit()
  } catch (err) {
    console.error('保存章节错误:', err)
    error.value = '保存章节时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingChapter.value = null
  showAddChapter.value = false
  chapterForm.value = {
    title: '',
    description: ''
  }
}

const confirmDeleteChapter = (chapter: CourseChapterVO) => {
  deletingChapter.value = chapter
}

const deleteChapter = async () => {
  if (!deletingChapter.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await deleteChapterApi(deletingChapter.value.id)
    
    if (res.code === 200) {
      // 从本地章节列表中移除
      chapters.value = chapters.value.filter(c => c.id !== deletingChapter.value?.id)
      emit('chapter-deleted', deletingChapter.value)
    } else {
      error.value = res.message || '删除章节失败'
    }
    
    deletingChapter.value = null
  } catch (err) {
    console.error('删除章节错误:', err)
    error.value = '删除章节时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

const togglePublishStatus = async (chapter: CourseChapterVO) => {
  loading.value = true
  error.value = ''
  
  try {
    const res = await updateChapterPublishStatus(chapter.id, !chapter.isPublished)
    
    if (res.code === 200) {
      // 更新本地章节状态
      const index = chapters.value.findIndex(c => c.id === chapter.id)
      if (index !== -1) {
        chapters.value[index] = {
          ...chapters.value[index],
          isPublished: !chapter.isPublished
        }
      }
      
      emit('chapter-updated', chapters.value[index])
    } else {
      error.value = res.message || '更新章节状态失败'
    }
  } catch (err) {
    console.error('更新章节状态错误:', err)
    error.value = '更新章节状态时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

const moveChapter = async (chapter: CourseChapterVO, direction: 'up' | 'down') => {
  const currentIndex = chapters.value.findIndex(c => c.id === chapter.id)
  if (currentIndex === -1) return
  
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  
  // 检查边界
  if (newIndex < 0 || newIndex >= chapters.value.length) return
  
  loading.value = true
  error.value = ''
  
  try {
    // 计算新的序号
    const newSequence = chapters.value[newIndex].sequence
    
    const res = await updateChapterSequence(chapter.id, newSequence)
    
    if (res.code === 200) {
      // 本地更新章节顺序，先移除后插入到新位置
      const chapterToMove = { ...chapters.value[currentIndex] }
      chapterToMove.sequence = newSequence
      
      // 重新加载章节以保证顺序正确
      await loadChapters()
    } else {
      error.value = res.message || '移动章节失败'
    }
  } catch (err) {
    console.error('移动章节错误:', err)
    error.value = '移动章节时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

const viewChapter = (chapter: CourseChapterVO) => {
  router.push(`/classroom/${props.courseId}/chapter/${chapter.id}`)
}

// 生命周期
onMounted(() => {
  loadChapters()
})
</script> 