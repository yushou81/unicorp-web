<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <div class="py-8">
      <div class="container mx-auto px-4">
        <!-- 个人资料卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
          <img :src="userAvatar" class="w-20 h-20 rounded-full border-2 border-blue-200 mr-6" alt="avatar" />
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="text-2xl font-bold text-gray-900 mr-2">{{ user.nickname }}</span>
              <span class="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 ml-2">{{ roleText }}</span>
              <span v-if="user.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
            </div>
            <div class="text-gray-500 text-sm mb-1">{{ user.email }}</div>
            <div class="text-gray-500 text-sm">{{ user.phone }}</div>
            <div class="text-gray-500 text-sm mt-1">所属学校：{{ user.school || '未绑定' }}</div>
          </div>
          <div class="flex flex-col space-y-2">
            <button @click="onEditProfileClick" class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑资料</button>
            <button @click="showResumeDialog = true" class="px-4 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow">管理简历</button>
          </div>
        </div>
        
        <!-- 数据卡片 -->
        <h2 class="text-xl font-bold text-gray-800 mb-4">我的数据</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div v-for="(block, idx) in blocks" :key="idx" class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 flex flex-col mb-2">
            <div class="flex items-center mb-4">
              <component :is="block.icon" class="w-7 h-7 mr-2" :class="block.color" />
              <span class="font-semibold text-lg">{{ block.title }}</span>
            </div>
            <div v-if="block.type === 'list'">
              <ul>
                <li v-for="item in block.data" :key="item.id" class="flex justify-between items-center mb-2 text-gray-700">
                  <span>{{ item.label }}</span>
                  <span v-if="item.status" class="text-xs px-2 py-0.5 rounded" :class="item.statusColor">{{ item.status }}</span>
                  <span v-if="item.extra" class="text-xs text-gray-400 ml-2">{{ item.extra }}</span>
                </li>
                <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
              </ul>
            </div>
            <div v-else-if="block.type === 'count'">
              <div class="mb-2 text-sm text-gray-700">共 {{ block.count || 0 }} 项</div>
              <ul>
                <li v-for="item in block.data" :key="item.id" class="flex justify-between items-center mb-1">
                  <span>{{ item.label }}</span>
                  <span class="text-xs text-gray-400">{{ item.extra }}</span>
                </li>
                <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
              </ul>
            </div>
            <div class="mt-auto pt-4">
              <router-link v-if="block.footer" :to="block.footer.link" class="text-blue-600 hover:underline text-xs font-medium">{{ block.footer.text }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 编辑个人资料对话框 -->
    <div v-if="showEditProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">编辑个人资料</h2>
        <form @submit.prevent="onUpdateProfile">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">昵称</label>
            <input v-model="editProfile.nickname" class="w-full px-3 py-2 border rounded" placeholder="请输入昵称" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">邮箱</label>
            <input v-model="editProfile.email" type="email" class="w-full px-3 py-2 border rounded" placeholder="请输入邮箱" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">手机号</label>
            <input v-model="editProfile.phone" class="w-full px-3 py-2 border rounded" placeholder="请输入手机号" />
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showEditProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="updateProfileLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ updateProfileLoading ? '保存中...' : '保存' }}</button>
          </div>
        </form>
        <div class="mt-6 pt-4 border-t">
          <h3 class="text-lg font-semibold mb-3">修改密码</h3>
          <form @submit.prevent="onChangePassword">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">原密码</label>
              <input v-model="passwordChange.oldPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入原密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">新密码</label>
              <input v-model="passwordChange.newPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入新密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">确认新密码</label>
              <input v-model="passwordChange.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请再次输入新密码" />
            </div>
            <div class="flex justify-end space-x-2">
              <button type="submit" :disabled="changePasswordLoading" class="px-4 py-1 rounded bg-green-600 text-white">{{ changePasswordLoading ? '修改中...' : '修改密码' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 简历管理对话框 -->
    <div v-if="showResumeDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-blue-700">简历管理</h2>
          <button @click="showResumeDialog = false" class="text-gray-400 hover:text-gray-600">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="onSaveResume">
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
            <div v-for="(achievement, index) in resumeData.achievements" :key="index" class="mb-2 flex items-center">
              <input 
                v-model="resumeData.achievements[index]" 
                class="flex-1 px-3 py-2 border rounded" 
                placeholder="请输入成就或荣誉" 
              />
              <button 
                type="button" 
                @click="removeAchievement(index)" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
            <button 
              type="button" 
              @click="addAchievement" 
              class="mt-2 flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusIcon class="w-4 h-4 mr-1" />
              <span>添加成就</span>
            </button>
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
              <button 
                type="button" 
                @click="deleteResume" 
                class="text-red-500 hover:text-red-700"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
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
              @click="showResumeDialog = false" 
              class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              取消
            </button>
            <button 
              type="submit" 
              :disabled="resumeSaving"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {{ resumeSaving ? '保存中...' : '保存简历' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ref, computed, onMounted } from 'vue'
import { BriefcaseIcon, BookmarkIcon, AcademicCapIcon, CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { getMe, updatePassword, updateUserInfo } from '@/lib/api/auth'
import { getUserResume, updateUserResume, uploadResumeFile, deleteResumeFile } from '@/lib/api/resume'
import Button from '@/components/ui/Button.vue'
import Navbar from '@/components/layout/Navbar.vue'
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

// 定义User类型
interface User {
  avatar?: string;
  nickname: string;
  email: string;
  phone: string;
  verified: boolean;
  school: string;
}

// 定义AppUser类型，这应该与您的store中定义的用户类型匹配
interface AppUser {
  id?: number;
  account?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  organizationId?: number;
  organizationName?: string;
}

// 定义数据项类型
interface DataItem {
  id: number;
  label: string;
  extra?: string;
  status?: string;
  statusColor?: string;
}

// 定义区块类型
interface Block {
  title: string;
  icon: any;
  color: string;
  type: string;
  data: DataItem[];
  empty: string;
  count?: number;
  footer?: {
    text: string;
    link: string;
  };
}

// 简历数据类型
interface ResumeData {
  major: string;
  educationLevel: string;
  achievements: string[];
  resumeUrl?: string;
}

const user = ref<User>({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '加载中...',
  email: '',
  phone: '',
  verified: false,
  school: '加载中...'
})

async function fetchUserInfo() {
  try {
    const res = await getMe() as ApiResponse<any>
    const userData = res?.data
    if (userData) {
      user.value = {
        avatar: userData.avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: userData.nickname || userData.account || '未知用户',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        school: userData.organizationName || '未绑定学校'
      }
    }
  } catch (e: any) {
    console.error('获取用户信息失败:', e)
    // 保持默认值
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchUserResume()
})

// 更新blocks数据，添加类型
const blocks = ref<Block[]>([
  {
    title: '收藏/投递职位',
    icon: BriefcaseIcon,
    color: 'text-blue-500',
    type: 'list',
    data: [
      { id: 1, label: '前端开发实习生', extra: '已投递' },
      { id: 2, label: '产品助理', extra: '已收藏' }
    ],
    empty: '暂无职位记录',
    footer: { text: '查看全部职位', link: '/job' }
  },
  {
    title: '学习记录',
    icon: AcademicCapIcon,
    color: 'text-green-500',
    type: 'list',
    data: [
      { id: 1, label: 'AI创新项目论文', extra: '2024-04-22' }
    ],
    empty: '暂无学习记录',
    footer: { text: '管理我的学习', link: '/learn' }
  },
  {
    title: '报名课程',
    icon: CalendarDaysIcon,
    color: 'text-indigo-500',
    type: 'list',
    data: [
      { id: 1, label: '大数据实战', extra: '2024-07-01' }
    ],
    empty: '暂无报名课程',
    footer: { text: '查看全部课程', link: '/courses' }
  },
  {
    title: '企业申请入口',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-500',
    type: 'list',
    data: [],
    empty: '如有意向加入企业项目，请点击下方入口',
    footer: { text: '申请加入企业项目', link: '/apply' }
  },
  {
    title: '学校信息浏览',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    type: 'list',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部学校', link: '/school/list' }
  },
  {
    title: '企业信息浏览',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-600',
    type: 'list',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部企业', link: '/company/list' }
  }
])

const router = useRouter()
const appStore = useAppStore()

const userInfo = computed<AppUser>(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || user.value.avatar || 'https://randomuser.me/api/portraits/men/32.jpg')
const roleText = computed(() => {
  const role = userInfo.value.role || ''
  const roleMap: Record<string, string> = {
    'admin': '系统管理员',
    'SYSADMIN': '系统管理员',
    'schoolAdmin': '学校管理员',
    'SCH_ADMIN': '学校管理员',
    'companyAdmin': '企业管理员',
    'EN_ADMIN': '企业管理员',
    'teacher': '教师',
    'TEACHER': '教师',
    'mentor': '企业导师',
    'MENTOR': '企业导师',
    'student': '学生',
    'STUDENT': '学生'
  }
  return roleMap[role] || '未知角色'
})

const showEditProfileDialog = ref(false)
const editProfile = ref({
  nickname: '',
  email: '',
  phone: ''
})
const passwordChange = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const updateProfileLoading = ref(false)
const changePasswordLoading = ref(false)

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    await updateUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    showEditProfileDialog.value = false
    await fetchUserInfo() // 重新获取用户信息
    // 更新store中的用户信息
    const res = await getMe() as ApiResponse<any>
    if (res?.data) {
      appStore.setUser(res.data)
    }
    alert('个人资料更新成功')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    updateProfileLoading.value = false
  }
}

async function onChangePassword() {
  if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
    alert('新密码与确认密码不一致')
    return
  }
  
  changePasswordLoading.value = true
  try {
    await updatePassword({
      oldPassword: passwordChange.value.oldPassword,
      newPassword: passwordChange.value.newPassword,
      confirmPassword: passwordChange.value.confirmPassword
    })
    passwordChange.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    alert('密码修改成功')
  } catch (e: any) {
    alert('密码修改失败：' + (e.message || '未知错误'))
  } finally {
    changePasswordLoading.value = false
  }
}

// 当打开编辑对话框时，初始化表单数据
function openEditDialog() {
  editProfile.value = {
    nickname: userInfo.value.nickname || userInfo.value.account || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || ''
  }
  showEditProfileDialog.value = true
}

// 修改按钮点击事件
function onEditProfileClick() {
  openEditDialog()
}

// 简历管理相关
const showResumeDialog = ref(false)
const resumeData = ref<ResumeData>({
  major: '',
  educationLevel: '本科',
  achievements: ['']
})
const resumeFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const resumeSaving = ref(false)

// 获取用户简历信息
async function fetchUserResume() {
  try {
    const res = await getUserResume() as ApiResponse<ResumeData>
    if (res?.data) {
      resumeData.value = res.data
      
      // 确保至少有一个成就输入框
      if (!resumeData.value.achievements || resumeData.value.achievements.length === 0) {
        resumeData.value.achievements = ['']
      }
    }
  } catch (e: any) {
    console.error('获取简历信息失败:', e)
    // 初始化空数据
    resumeData.value = {
      major: '',
      educationLevel: '本科',
      achievements: ['']
    }
  }
}

// 添加成就
function addAchievement() {
  resumeData.value.achievements.push('')
}

// 删除成就
function removeAchievement(index: number) {
  if (resumeData.value.achievements.length > 1) {
    resumeData.value.achievements.splice(index, 1)
  } else {
    resumeData.value.achievements = ['']
  }
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

// 从URL中获取文件名
function getFileNameFromUrl(url: string): string {
  if (!url) return '未知文件'
  const parts = url.split('/')
  return parts[parts.length - 1]
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}

// 删除简历文件
async function deleteResume() {
  if (confirm('确定要删除当前简历文件吗？')) {
    try {
      await deleteResumeFile()
      resumeData.value.resumeUrl = undefined
      alert('简历文件已删除')
    } catch (e: any) {
      alert('删除失败：' + (e.message || '未知错误'))
    }
  }
}

// 保存简历信息
async function onSaveResume() {
  resumeSaving.value = true
  
  try {
    // 过滤掉空的成就
    const filteredAchievements = resumeData.value.achievements.filter(item => item.trim() !== '')
    
    // 更新基本信息
    await updateUserResume({
      major: resumeData.value.major,
      educationLevel: resumeData.value.educationLevel,
      achievements: filteredAchievements.length > 0 ? filteredAchievements : []
    })
    
    // 如果有新文件上传
    if (resumeFile.value) {
      const formData = new FormData()
      formData.append('file', resumeFile.value)
      
      const uploadRes = await uploadResumeFile(formData) as ApiResponse<{resumeUrl: string}>
      if (uploadRes?.data?.resumeUrl) {
        resumeData.value.resumeUrl = uploadRes.data.resumeUrl
      }
      
      // 清空文件选择
      resumeFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
    
    alert('简历信息保存成功')
    showResumeDialog.value = false
  } catch (e: any) {
    alert('保存失败：' + (e.message || '未知错误'))
  } finally {
    resumeSaving.value = false
  }
}
</script>

<style scoped>
.gradient-card {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>