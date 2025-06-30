<template>
  <div>
    <!-- 简历管理对话框 -->
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-blue-700">简历管理</h2>
          <button @click="closeDialog" class="text-gray-400 hover:text-gray-600">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- 简历列表和加载状态 -->
        <div v-if="loading" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">我的简历</h3>
            <button 
              type="button" 
              @click="createNewResume" 
              class="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              <PlusIcon class="w-4 h-4 mr-1" />
              <span>新建简历</span>
            </button>
          </div>

          <!-- 简历列表 -->
          <div v-if="resumeList.length > 0" class="space-y-2 mb-6">
            <div
              v-for="resume in resumeList"
              :key="resume.id || 0"
              @click="resume.id ? selectResume(resume.id) : null"
              class="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition"
              :class="{ 'bg-blue-50 border-blue-300': activeResumeId === resume.id }"
            >
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ resume.major || '未设置专业' }} - {{ resume.educationLevel }}</div>
                  <div class="text-sm text-gray-500">更新时间: {{ formatDate(resume.updatedAt) }}</div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    v-if="resume.resumeUrl" 
                    @click.stop="previewResume(resume.resumeUrl)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    @click.stop="deleteResume(resume.id)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 没有简历时显示创建提示 -->
          <div v-else class="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
            <DocumentIcon class="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p class="text-gray-600">您还没有创建简历</p>
            <button 
              @click="createNewResume"
              class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              开始创建简历
            </button>
          </div>
        </div>

        <!-- 简历编辑表单 -->
        <form v-if="!loading" @submit.prevent="onSaveResume">
          <!-- 基本信息 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 pb-2 border-b">基本信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-1">专业</label>
                <input v-model="resumeData.major" class="w-full px-3 py-2 border rounded" placeholder="请输入专业" />
              </div>
              <div>
                <label class="block text-gray-700 mb-1">学历</label>
                <select v-model="resumeData.educationLevel" class="w-full px-3 py-2 border rounded">
                  <option value="专科">专科</option>
                  <option value="本科">本科</option>
                  <option value="硕士">硕士</option>
                  <option value="博士">博士</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 成就与荣誉 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 pb-2 border-b">成就与荣誉</h3>
            <textarea 
              v-model="resumeData.achievements" 
              rows="4"
              class="w-full px-3 py-2 border rounded" 
              placeholder="请输入您的成就与荣誉，多项成就请用换行分隔"
            ></textarea>
          </div>

          <!-- 简历文件上传 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 pb-2 border-b">简历文件</h3>
            
            <div v-if="resumeData.resumeUrl" class="mb-4 p-4 border rounded bg-blue-50 flex items-center justify-between">
              <div class="flex items-center">
                <DocumentIcon class="w-6 h-6 text-blue-500 mr-2" />
                <div>
                  <div class="font-medium">当前简历</div>
                  <div class="text-sm text-gray-500">{{ getFileNameFromUrl(resumeData.resumeUrl) }}</div>
                </div>
              </div>
              <div class="flex space-x-2">
                <button 
                  type="button"
                  @click="previewResume(resumeData.resumeUrl)"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div 
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              @click="triggerFileInput"
            >
              <input 
                ref="fileInput" 
                type="file" 
                class="hidden" 
                @change="handleFileChange" 
                accept=".pdf,.doc,.docx"
              />
              <div v-if="!resumeFile">
                <UploadIcon class="w-12 h-12 mx-auto text-gray-400" />
                <p class="mt-2 text-sm text-gray-600">点击或拖拽文件至此处上传</p>
                <p class="text-xs text-gray-500 mt-1">支持格式：PDF、Word（.doc/.docx）</p>
              </div>
              <div v-else class="text-left">
                <div class="flex items-center">
                  <DocumentIcon class="w-10 h-10 text-blue-500 mr-3" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-800">{{ resumeFile.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(resumeFile.size) }}</p>
                  </div>
                  <button 
                    @click.stop="removeFile" 
                    class="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              @click="closeDialog" 
              class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              取消
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {{ saving ? '保存中...' : '保存简历' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import { getMyResumes, getResumeById, createMyResume, updateMyResume, deleteMyResume } from '@/lib/api/resume'
import { 
  FileText as DocumentIcon, 
  Upload as UploadIcon, 
  Trash as TrashIcon, 
  X as XIcon, 
  Plus as PlusIcon 
} from 'lucide-vue-next'

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 简历数据类型
interface ResumeData {
  id?: number;
  major: string;
  educationLevel: string;
  achievements: string;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义组件事件
const emit = defineEmits(['update:visible', 'resume-updated'])

// 状态变量
const resumeData = ref<ResumeData>({
  major: '',
  educationLevel: '本科',
  achievements: ''
})
const resumeList = ref<ResumeData[]>([])
const activeResumeId = ref<number | null>(null)
const resumeFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)
const loading = ref(false)

// 在对话框可见时获取简历列表
onMounted(() => {
  if (props.visible) {
    fetchResumeList()
  }
})

// 监听visible属性变化
const closeDialog = () => {
  emit('update:visible', false)
}

// 获取用户所有简历列表
async function fetchResumeList() {
  loading.value = true
  try {
    // 获取用户所有简历
    const res = await getMyResumes() as ApiResponse<ResumeData[]>
    if (res?.data && res.data.length > 0) {
      resumeList.value = res.data
      
      // 默认选择第一份简历
      const firstResumeId = resumeList.value[0].id
      if (firstResumeId) {
        activeResumeId.value = firstResumeId
        
        // 获取详细简历信息
        await loadResumeDetails(firstResumeId)
      }
    } else {
      // 创建空简历数据
      createNewResume()
    }
  } catch (e: any) {
    console.error('获取简历列表失败:', e)
    createNewResume()
  } finally {
    loading.value = false
  }
}

// 加载指定ID的简历详情
async function loadResumeDetails(resumeId: number) {
  try {
    const res = await getResumeById(resumeId) as ApiResponse<ResumeData>
    if (res?.data) {
      resumeData.value = res.data
    }
  } catch (e: any) {
    console.error(`加载简历详情失败:`, e)
  }
}

// 创建新简历
function createNewResume() {
  // 重置简历数据
  resumeData.value = {
    major: '',
    educationLevel: '本科',
    achievements: ''
  }
  activeResumeId.value = null
  resumeFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 选择简历
async function selectResume(resumeId: number) {
  if (!resumeId) return
  
  activeResumeId.value = resumeId
  
  // 从列表中找到对应的简历
  const selectedResume = resumeList.value.find(resume => resume.id === resumeId)
  if (selectedResume) {
    resumeData.value = { ...selectedResume }
    resumeFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } else {
    await loadResumeDetails(resumeId)
  }
}

// 保存简历
async function onSaveResume() {
  saving.value = true;
  
  try {
    // 验证表单必填项
    if (!resumeData.value.major) {
      alert('请填写专业');
      saving.value = false;
      return;
    }
    
    if (!resumeData.value.educationLevel) {
      alert('请选择学历');
      saving.value = false;
      return;
    }
    
    // 验证文件上传
    if (!resumeFile.value && !resumeData.value.resumeUrl) {
      alert('请上传简历文件');
      saving.value = false;
      return;
    }
    
    const formData = new FormData();
    
    // 添加所有必填字段 - 确保与后端@RequestParam名称完全匹配
    formData.append('major', resumeData.value.major);
    formData.append('educationLevel', resumeData.value.educationLevel);
    formData.append('achievements', resumeData.value.achievements || ''); // 即使为空也发送
    
    // 添加文件（如果有新文件则上传）
    if (resumeFile.value) {
      formData.append('file', resumeFile.value);
    } else if (resumeData.value.resumeUrl) {
      // 如果没有新文件但有已存在的文件URL，创建一个小文件上传
      // 这是因为后端要求file参数是必须的
      const emptyBlob = new Blob(['placeholder'], { type: 'text/plain' });
      const emptyFile = new File([emptyBlob], 'placeholder.txt', { type: 'text/plain' });
      formData.append('file', emptyFile);
      console.log('使用占位文件替代，因为file是必填参数');
    } else {
      alert('请上传简历文件');
      saving.value = false;
      return;
    }

    // 调试输出表单数据
    console.log('表单数据:');
    for (const pair of formData.entries()) {
      if (pair[0] === 'file') {
        const file = pair[1] as File;
        console.log(`${pair[0]}: 文件名=${file.name}, 类型=${file.type}, 大小=${file.size}字节`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
    
    // 根据是否有ID决定创建还是更新
    let result;
    
    // 处理更新还是创建的情况
    if (activeResumeId.value !== null) {
      // 更新现有简历
      console.log('更新简历ID:', activeResumeId.value);
      result = await updateMyResume(activeResumeId.value, formData);
    } else {
      // 创建新简历
      console.log('创建新简历');
      result = await createMyResume(formData);
    }
    
    // 刷新简历列表
    await fetchResumeList();
    
    // 通知父组件
    emit('resume-updated');
    
    alert('简历保存成功');
  } catch (e: any) {
    alert('保存失败：' + (e.message || '未知错误'));
    console.error('保存失败:', e);
  } finally {
    saving.value = false;
  }
}

// 删除简历
async function deleteResume(resumeId: number) {
  if (!resumeId) return
  
  if (confirm(`确定要删除这份简历吗？此操作不可恢复。`)) {
    try {
      await deleteMyResume(resumeId)
      
      // 如果删除的是当前选中的简历，则创建新简历
      if (activeResumeId.value === resumeId) {
        createNewResume()
      }
      
      // 刷新简历列表
      await fetchResumeList()
      
      // 通知父组件
      emit('resume-updated')
      
      alert('简历删除成功')
    } catch (e: any) {
      alert('删除失败：' + (e.message || '未知错误'))
    }
  }
}

// 格式化日期
function formatDate(dateString?: string): string {
  if (!dateString) return '未知时间'
  
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 从URL中获取文件名
function getFileNameFromUrl(url?: string): string {
  if (!url) return '未知文件'
  const parts = url.split('/')
  return decodeURIComponent(parts[parts.length - 1])
}

// 触发文件选择框
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理文件选择
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    resumeFile.value = target.files[0]
  }
}

// 移除已选择的文件
function removeFile() {
  resumeFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 预览简历
function previewResume(url?: string) {
  if (!url) return
  
  // 在新标签页中打开简历
  window.open(url, '_blank')
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}
</script> 