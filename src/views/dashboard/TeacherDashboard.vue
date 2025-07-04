<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <div class="py-10">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
          <img :src="userAvatar" class="w-20 h-20 rounded-full border-2 border-blue-200 mr-6" alt="avatar" />
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="text-2xl font-bold text-gray-900 mr-2">{{ teacher.name }}</span>
              <span v-if="teacher.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
            </div>
            <div class="text-gray-500 text-sm mb-1">{{ teacher.email }}</div>
            <div class="text-gray-500 text-sm">{{ teacher.phone }}</div>
            <div class="text-gray-500 text-sm mt-1">所属学校：{{ teacher.school || '未绑定' }}</div>
          </div>
          <button @click="onEditProfileClick" class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑资料</button>
        </div>
        
        <!-- 添加创建课程按钮 -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">我的双师课堂</h2>
          <button 
            @click="openCreateCourseDialog" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            创建新课程
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div v-for="(block, idx) in blocks" :key="idx" class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 flex flex-col mb-2">
            <div class="flex items-center mb-4">
              <component :is="block.icon" class="w-7 h-7 mr-2" :class="block.color" />
              <span class="font-semibold text-lg">{{ block.title }}</span>
            </div>
            <ul>
              <li v-for="item in block.data" :key="typeof item === 'string' ? item : item.id" class="flex justify-between items-center mb-2 text-gray-700">
                <span>{{ typeof item === 'string' ? item : item.label }}</span>
                <span v-if="typeof item !== 'string' && item.extra" class="text-xs text-gray-400 ml-2">{{ item.extra }}</span>
              </li>
              <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
            </ul>
            <div v-if="block.footer">
              <router-link :to="block.footer.link" class="text-blue-600 hover:underline text-xs font-medium mt-2">{{ block.footer.text }}</router-link>
            </div>
          </div>
        </div>
        
        <!-- 快速审核成果 -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">快速访问</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link to="/classroom/manage" class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 flex items-center shadow-md hover:shadow-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div class="font-medium">课程管理</div>
                <div class="text-xs opacity-80">管理您的全部课程</div>
              </div>
            </router-link>
            
            <router-link to="/achievement/teacher" class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 flex items-center shadow-md hover:shadow-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div class="font-medium">成果审核</div>
                <div class="text-xs opacity-80">审核学生的成果展示</div>
              </div>
            </router-link>
            
            <router-link to="/teacher/projects" class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 flex items-center shadow-md hover:shadow-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <div class="font-medium">项目管理</div>
                <div class="text-xs opacity-80">管理您的项目</div>
              </div>
            </router-link>
          </div>
        </div>
        
        <!-- 课程列表 -->
        <div v-if="courseList.length > 0" class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">我的全部课程</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程名称</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程时间</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程类型</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报名人数</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="course in courseList" :key="course.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ course.title }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ new Date(course.scheduledTime).toLocaleString() }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ course.courseType }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ course.enrolledCount }}/{{ course.maxStudents }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(course.status)">{{ getStatusText(course.status) }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <button @click="openEditCourseDialog(course)" class="text-blue-600 hover:text-blue-900">编辑</button>
                    <button @click="openResourceUploadDialog(course.id)" class="text-green-600 hover:text-green-900">上传资源</button>
                    <button @click="onDeleteCourse(course.id)" class="text-red-600 hover:text-red-900">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 编辑个人资料对话框 -->
        <div v-if="showEditProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">编辑个人资料</h2>
            <form @submit.prevent="onUpdateProfile">
          <!-- 头像上传 -->
          <div class="mb-5 flex flex-col items-center">
            <img :src="previewAvatar || userAvatar" class="w-24 h-24 rounded-full border-2 border-blue-200 mb-2" alt="avatar" />
            <div class="flex items-center mt-2">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              />
              <button 
                type="button" 
                @click="fileInput?.click()"
                class="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition"
              >
                选择头像
              </button>
              <button 
                v-if="avatarFile" 
                type="button" 
                @click="cancelAvatarUpload" 
                class="px-3 py-1 rounded bg-red-100 text-red-600 text-sm hover:bg-red-200 transition ml-2"
              >
                取消
              </button>
            </div>
            <p v-if="avatarFile" class="text-xs text-gray-500 mt-1">
              {{ avatarFile.name }} ({{ formatFileSize(avatarFile.size) }})
            </p>
          </div>

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
      </div>
    </div>
    
    <!-- 课程创建/编辑对话框 -->
    <div v-if="showCourseDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4">{{ isEditingCourse ? '编辑课程' : '创建新课程' }}</h2>
        <form @submit.prevent="saveCourse">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程标题</label>
            <input v-model="courseForm.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入课程标题" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程描述</label>
            <textarea v-model="courseForm.description" rows="3" class="w-full px-3 py-2 border rounded" placeholder="请输入课程描述"></textarea>
          </div>
          
          <!-- 企业导师搜索部分 -->
          <div class="mb-5 border-b pb-5">
            <label class="block text-gray-700 mb-1">企业导师</label>
            
            <div v-if="selectedMentor" class="flex items-center justify-between bg-blue-50 p-3 rounded mb-2">
              <div>
                <div class="font-semibold">{{ selectedMentor.name }}</div>
                <div class="text-xs text-gray-500">导师ID: {{ selectedMentor.id }}</div>
              </div>
              <button 
                type="button" 
                @click="clearSelectedMentor" 
                class="text-red-600 text-sm hover:text-red-800"
              >
                移除
              </button>
            </div>
            
            <div v-else>
              <div class="flex mb-2">
                <input 
                  v-model="mentorSearchKeyword" 
                  class="flex-1 px-3 py-2 border rounded-l" 
                  placeholder="输入导师邮箱或手机号查询" 
                />
                <button 
                  type="button" 
                  @click="searchMentor" 
                  :disabled="mentorSearching" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
                >
                  {{ mentorSearching ? '查询中...' : '查询' }}
                </button>
              </div>
              
              <div v-if="mentorSearchResults.length > 0" class="border rounded mt-2 max-h-40 overflow-y-auto">
                <div 
                  v-for="mentor in mentorSearchResults" 
                  :key="mentor.id"
                  class="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                  @click="selectMentor(mentor)"
                >
                  <div class="font-medium">{{ mentor.nickname || mentor.account }}</div>
                  <div class="text-xs text-gray-500">
                    {{ mentor.email || '无邮箱' }} | {{ mentor.phone || '无手机号' }}
                  </div>
                </div>
              </div>
              
              <div v-if="!selectedMentor" class="text-xs text-gray-500 mt-1">
                必须选择一位企业导师进行双师课堂的创建
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程时间</label>
              <input v-model="courseForm.scheduledTime" type="datetime-local" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">最大学生人数</label>
              <input v-model="courseForm.maxStudents" type="number" min="1" class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程地点</label>
              <input v-model="courseForm.location" class="w-full px-3 py-2 border rounded" placeholder="请输入课程地点" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程类型</label>
              <select v-model="courseForm.courseType" class="w-full px-3 py-2 border rounded">
                <option value="online">线上</option>
                <option value="offline">线下</option>
                <option value="hybrid">混合</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showCourseDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white">保存</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 资源上传对话框 -->
    <div v-if="showResourceDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">上传课程资源</h2>
        <form @submit.prevent="uploadCourseResource">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源标题</label>
            <input v-model="resourceForm.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入资源标题" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源描述</label>
            <textarea v-model="resourceForm.description" rows="2" class="w-full px-3 py-2 border rounded" placeholder="请输入资源描述"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源类型</label>
            <select v-model="resourceForm.resourceType" class="w-full px-3 py-2 border rounded">
              <option value="document">文档</option>
              <option value="video">视频</option>
              <option value="code">代码</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="mb-5">
            <label class="block text-gray-700 mb-1">选择文件</label>
            <input
              ref="resourceFileInput"
              type="file"
              @change="handleResourceFileChange"
              class="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showResourceDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="uploadingResource" class="px-4 py-1 rounded bg-blue-600 text-white">
              {{ uploadingResource ? '上传中...' : '上传' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserGroupIcon, BriefcaseIcon, AcademicCapIcon, ArrowUpTrayIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getMe, updatePassword, updateUserInfo, uploadAvatar, searchUser } from '@/lib/api/auth'
import Navbar from '@/components/layout/Navbar.vue'
// 导入双师课堂相关API
import { 
  createCourse, 
  updateCourse,
  deleteCourse, 
  updateCourseStatus, 
  getTeacherCourses,
  CourseStatus,
  CourseType,
  DualTeacherCourseDTO,
  DualTeacherCourseVO,
  CourseResourceDTO,
  uploadResource,
  deleteResource,
  getResourcesByCourseId
} from '@/lib/api/classroom'

const teacher = ref({
  avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  name: '加载中...',
  email: '',
  phone: '',
  verified: false,
  school: '加载中...',
  company: ''
})

const students = [
  { id: 1, name: '王五', major: '计算机' },
  { id: 2, name: '赵六', major: '人工智能' }
]
const projects = [
  { id: 1, title: '智慧校园课题', date: '2024-06-01' },
  { id: 2, title: 'AI创新实验', date: '2024-05-15' }
]
const resources = [
  { id: 1, title: '教师教学资源', date: '2024-06-20' }
]

// 定义更具体的类型
interface BlockDataItem {
  id: number;
  label: string;
  extra?: string;
}

interface BlockItem {
  title: string;
  icon: any;
  color: string;
  data: BlockDataItem[] | string[];
  empty: string;
  footer: { text: string; link: string };
}

// 修改blocks的定义使用具体类型
const blocks = ref<BlockItem[]>([
  {
    title: '双师课堂管理',
    icon: UserGroupIcon,
    color: 'text-blue-500',
    data: [],
    empty: '暂无课程',
    footer: { text: '管理课程', link: '/classroom/manage' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: '智慧校园课题', extra: '进行中' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/teacher/projects' }
  },
  {
    title: '学生成果查看',
    icon: AcademicCapIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: '全国大学生数学建模竞赛一等奖', extra: '张三' }
    ],
    empty: '暂无成果',
    footer: { text: '查看全部成果', link: '/achievement/teacher' }
  },
  {
    title: '资源上传',
    icon: ArrowUpTrayIcon,
    color: 'text-purple-500',
    data: [],
    empty: '暂无上传资源',
    footer: { text: '上传资源', link: '/resource/upload' }
  },
  {
    title: '学校信息浏览',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部学校', link: '/school/list' }
  },
  {
    title: '企业信息浏览',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部企业', link: '/company/list' }
  }
])

const router = useRouter()
const appStore = useAppStore()

const userInfo = computed(() => appStore.user as any || {})
const userAvatar = computed(() => (userInfo.value?.avatar as string) || 'https://randomuser.me/api/portraits/men/33.jpg')
const roleText = computed(() => {
  const role = userInfo.value?.role as string
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

async function fetchTeacherInfo() {
  try {
    const res = await getMe() as any
    const userData = res.data
    if (userData) {
      teacher.value = {
        avatar: userData.avatarUrl || 'https://randomuser.me/api/portraits/men/33.jpg',
        name: userData.nickname || userData.account || '未知教师',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        school: userData.organizationName || '未绑定学校',
        company: ''
      }
    }
  } catch (e: any) {
    console.error('获取教师信息失败:', e)
    // 保持默认值
  }
}

onMounted(() => {
  fetchTeacherInfo()
  fetchTeacherCourses()
})

function onLogout() {
  appStore.logout()
  router.push('/login')
}

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

// 头像上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const previewAvatar = ref<string | null>(null)
const avatarUploading = ref(false)

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    // 先更新用户基本信息
    await updateUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    
    // 如果选择了新头像，则上传头像
    if (avatarFile.value) {
      avatarUploading.value = true
      try {
        await uploadAvatar(avatarFile.value)
        console.log('头像上传成功')
      } catch (avatarError: any) {
        console.error('头像上传失败:', avatarError)
        alert('头像上传失败: ' + (avatarError.message || '未知错误'))
        // 继续执行，不影响其他信息的保存
      } finally {
        avatarUploading.value = false
      }
    }
    
    showEditProfileDialog.value = false
    
    // 重置头像上传状态
    avatarFile.value = null
    previewAvatar.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    await fetchTeacherInfo() // 重新获取教师信息
    
    // 更新store中的用户信息
    const res = await getMe() as any
    if (res.data) {
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

// 处理头像上传相关函数
function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    avatarFile.value = target.files[0]
    previewAvatar.value = URL.createObjectURL(avatarFile.value)
  }
}

function cancelAvatarUpload() {
  avatarFile.value = null
  previewAvatar.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}

// 当打开编辑对话框时，初始化表单数据
function openEditDialog() {
  editProfile.value = {
    nickname: userInfo.value?.nickname || userInfo.value?.account || '',
    email: userInfo.value?.email || '',
    phone: userInfo.value?.phone || ''
  }
  showEditProfileDialog.value = true
}

// 修改按钮点击事件
function onEditProfileClick() {
  openEditDialog()
}

// 添加课程相关响应式数据
const courseList = ref<DualTeacherCourseVO[]>([])
const totalCourses = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const showCourseDialog = ref(false)
const isEditingCourse = ref(false)
const currentCourseId = ref<number | null>(null)

// 课程表单数据
const courseForm = ref<DualTeacherCourseDTO>({
  title: '',
  description: '',
  scheduledTime: '',
  maxStudents: 30,
  location: '',
  courseType: CourseType.HYBRID,
  mentorId: undefined
})

// 企业导师搜索相关
const mentorSearchKeyword = ref('')
const mentorSearching = ref(false)
const mentorSearchResults = ref<any[]>([])
const selectedMentor = ref<{id: number, name: string, role: string} | null>(null)

// 根据关键词搜索企业导师
async function searchMentor() {
  if (!mentorSearchKeyword.value.trim()) {
    alert('请输入企业导师的邮箱或手机号')
    return
  }
  
  mentorSearching.value = true
  try {
    const res = await searchUser(mentorSearchKeyword.value.trim()) as any
    const user = res.data
    
    if (user && (user.role === 'MENTOR' || user.role === 'mentor' || user.role === 'EN_ADMIN' || user.role === 'EN_TEACHER')) {
      mentorSearchResults.value = [user]
    } else if (user) {
      alert('搜索到的用户不是企业导师')
      mentorSearchResults.value = []
    } else {
      alert('未找到匹配的用户')
      mentorSearchResults.value = []
    }
  } catch (error) {
    console.error('搜索企业导师失败:', error)
    alert('搜索失败: ' + (error as any).message || '未知错误')
    mentorSearchResults.value = []
  } finally {
    mentorSearching.value = false
  }
}

// 选择企业导师
function selectMentor(mentor: any) {
  selectedMentor.value = {
    id: mentor.id,
    name: mentor.nickname || mentor.account || '未知导师',
    role: mentor.role
  }
  courseForm.value.mentorId = mentor.id
  mentorSearchResults.value = []
}

// 清除已选择的企业导师
function clearSelectedMentor() {
  selectedMentor.value = null
  courseForm.value.mentorId = undefined
}

// 资源上传相关
const showResourceDialog = ref(false)
const resourceForm = ref<CourseResourceDTO>({
  courseId: 0,
  title: '',
  description: '',
  resourceType: 'document'
})
const resourceFile = ref<File | null>(null)
const resourceFileInput = ref<HTMLInputElement | null>(null)
const uploadingResource = ref(false)

// 添加获取教师课程列表的方法
async function fetchTeacherCourses() {
  try {
    const response = await getTeacherCourses(currentPage.value, pageSize.value)
    if (response && response.data) {
      courseList.value = response.data.records
      totalCourses.value = response.data.total
      
      // 更新数据块中的课程信息
      const courseData: BlockDataItem[] = courseList.value.map(course => ({
        id: course.id,
        label: course.title,
        extra: new Date(course.scheduledTime).toLocaleDateString()
      }))
      
      // 更新blocks中的课程数据
      const courseBlockIndex = blocks.value.findIndex(block => block.title === '双师课堂管理')
      if (courseBlockIndex !== -1) {
        blocks.value[courseBlockIndex].data = courseData
      }
    }
  } catch (error) {
    console.error('获取教师课程列表失败:', error)
  }
}

// 添加创建/编辑课程的方法
async function saveCourse() {
  // 验证导师选择
  if (!courseForm.value.mentorId) {
    alert('请选择一位企业导师')
    return
  }
  
  try {
    if (isEditingCourse.value && currentCourseId.value) {
      await updateCourse(currentCourseId.value, courseForm.value)
      console.log('课程更新成功')
    } else {
      await createCourse(courseForm.value)
      console.log('课程创建成功')
    }
    
    showCourseDialog.value = false
    resetCourseForm()
    await fetchTeacherCourses()
  } catch (error) {
    console.error('保存课程失败:', error)
    alert('保存课程失败: ' + (error as any).message || '未知错误')
  }
}

// 添加删除课程的方法
async function onDeleteCourse(courseId: number) {
  if (confirm('确定要删除此课程吗？此操作不可恢复。')) {
    try {
      await deleteCourse(courseId)
      console.log('课程删除成功')
      await fetchTeacherCourses()
    } catch (error) {
      console.error('删除课程失败:', error)
      alert('删除课程失败: ' + (error as any).message || '未知错误')
    }
  }
}

// 添加更新课程状态的方法
async function onUpdateCourseStatus(courseId: number, status: CourseStatus) {
  try {
    await updateCourseStatus(courseId, status)
    console.log('课程状态更新成功')
    await fetchTeacherCourses()
  } catch (error) {
    console.error('更新课程状态失败:', error)
    alert('更新课程状态失败: ' + (error as any).message || '未知错误')
  }
}

// 打开创建课程对话框
function openCreateCourseDialog() {
  isEditingCourse.value = false
  currentCourseId.value = null
  resetCourseForm()
  showCourseDialog.value = true
}

// 打开编辑课程对话框
async function openEditCourseDialog(course: DualTeacherCourseVO) {
  isEditingCourse.value = true
  currentCourseId.value = course.id
  courseForm.value = {
    title: course.title,
    description: course.description,
    scheduledTime: course.scheduledTime,
    maxStudents: course.maxStudents,
    location: course.location,
    courseType: course.courseType as CourseType,
    mentorId: course.mentorId
  }
  
  // 如果有导师信息，则设置已选择导师
  if (course.mentorId && course.mentorName) {
    selectedMentor.value = {
      id: course.mentorId,
      name: course.mentorName,
      role: 'mentor'
    }
  } else {
    selectedMentor.value = null
  }
  
  showCourseDialog.value = true
}

// 重置课程表单
function resetCourseForm() {
  courseForm.value = {
    title: '',
    description: '',
    scheduledTime: '',
    maxStudents: 30,
    location: '',
    courseType: CourseType.HYBRID,
    mentorId: undefined
  }
  
  // 清空导师搜索相关状态
  mentorSearchKeyword.value = ''
  mentorSearchResults.value = []
  selectedMentor.value = null
}

// 资源上传相关方法
function openResourceUploadDialog(courseId: number) {
  resourceForm.value.courseId = courseId
  resourceForm.value.title = ''
  resourceForm.value.description = ''
  resourceForm.value.resourceType = 'document'
  resourceFile.value = null
  showResourceDialog.value = true
}

function handleResourceFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    resourceFile.value = target.files[0]
  }
}

async function uploadCourseResource() {
  if (!resourceFile.value) {
    alert('请选择要上传的文件')
    return
  }
  
  uploadingResource.value = true
  try {
    const formData = new FormData()
    formData.append('file', resourceFile.value)
    formData.append('data', JSON.stringify(resourceForm.value))
    
    await uploadResource(formData)
    showResourceDialog.value = false
    alert('资源上传成功')
  } catch (error) {
    console.error('资源上传失败:', error)
    alert('资源上传失败: ' + (error as any).message || '未知错误')
  } finally {
    uploadingResource.value = false
  }
}

// 获取课程状态显示文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'planning': '筹备中',
    'open': '开放报名',
    'in_progress': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取课程状态样式类
function getStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    'planning': 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800',
    'open': 'px-2 py-1 rounded text-xs bg-green-100 text-green-800',
    'in_progress': 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-800',
    'completed': 'px-2 py-1 rounded text-xs bg-purple-100 text-purple-800',
    'cancelled': 'px-2 py-1 rounded text-xs bg-red-100 text-red-800'
  }
  return classMap[status] || 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'
}
</script> 