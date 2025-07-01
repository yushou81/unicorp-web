<template>
  <div>
    <!-- 模态框遮罩层 -->
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center overflow-y-auto py-10">
      <!-- 模态框内容 -->
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-full overflow-y-auto">
        <!-- 模态框标题 -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-xl font-bold text-gray-800">申请岗位：{{ job.title }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <!-- 模态框内容区 -->
        <div class="px-6 py-4">
          <div v-if="userResumes.length === 0" class="text-center py-8">
            <FileText class="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p class="text-gray-700 mb-4">您还没有上传简历</p>
            <router-link to="/resume/create" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus class="w-4 h-4 mr-2" />
              创建简历
            </router-link>
          </div>
          
          <div v-else>
            <div class="mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">选择简历</h3>
              
              <div class="space-y-3">
                <div v-for="resume in userResumes" :key="resume.id" class="border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                  :class="{ 'border-blue-500 bg-blue-50': selectedResumeId === resume.id }"
                  @click="selectResume(resume.id)">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <input type="radio" :checked="selectedResumeId === resume.id" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    </div>
                    <div class="ml-3 flex-1">
                      <div class="flex justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ resume.major }} - {{ resume.educationLevel }}</p>
                          <p class="text-xs text-gray-500 mt-1">创建时间: {{ formatDate(resume.createdAt || '') }}</p>
                        </div>
                        <div>
                          <a v-if="resume.resumeUrl" :href="resume.resumeUrl" target="_blank" class="text-blue-600 text-sm hover:text-blue-800">
                            <ExternalLink class="w-4 h-4 inline-block mr-1" />
                            查看
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 text-right">
                <router-link to="/resume" class="text-sm text-blue-600 hover:text-blue-800">
                  管理我的简历
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 模态框底部按钮 -->
        <div class="px-6 py-4 border-t flex justify-end space-x-4">
          <button @click="closeModal" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            取消
          </button>
          <button 
            @click="submitApplication" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            :disabled="isSubmitDisabled || loading"
          >
            <span v-if="loading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </span>
            <span v-else>申请职位</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import { 
  FileText,
  Upload as UploadIcon,
  Trash as TrashIcon,
  User as UserIcon,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  Info as InfoIcon,
  Plus,
  ExternalLink
} from 'lucide-vue-next'

// 定义简历接口
interface Resume {
  id?: number;
  major: string;
  educationLevel: string;
  achievements: string;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  job: {
    type: Object,
    required: true
  },
  userResumes: {
    type: Array as () => Resume[],
    default: () => []
  },
  selectedResumeId: {
    type: [Number, null],
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit', 'update:selectedResumeId'])

// 表单数据
const jobIntention = ref('')
const selfIntroduction = ref('')

// 计算属性：提交按钮是否禁用
const isSubmitDisabled = computed(() => {
  return !props.selectedResumeId || props.userResumes.length === 0
})

// 选择简历
const selectResume = (id: number | undefined) => {
  if (id) {
    emit('update:selectedResumeId', id)
  }
}

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 提交申请
const submitApplication = () => {
  if (isSubmitDisabled.value) return
  const applicationData = {
    resumeId: props.selectedResumeId
  }
  emit('submit', applicationData)
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// 重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    jobIntention.value = ''
    selfIntroduction.value = ''
  }
})
</script> 