<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <!-- 头部区域 -->
      <div class="bg-white rounded-xl shadow-sm mb-8 hover-card">
        <div class="relative">
          <div class="h-40 w-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl"></div>
          <div class="flex flex-col md:flex-row px-6 py-4">
            <div class="flex flex-col items-center md:items-start -mt-16 md:-mt-12">
              <div class="relative group avatar-hover">
                <img :src="mentor.avatar" class="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover" alt="导师头像" />
                <div @click="onEditProfileClick" class="absolute inset-0 rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200">
                  <span class="text-white text-sm">更换头像</span>
                </div>
              </div>
              <div class="mt-4 md:mt-6 flex flex-col items-center md:items-start">
                <div class="flex items-center flex-wrap justify-center md:justify-start">
                  <h1 class="text-2xl font-bold text-gray-900">{{ mentor.name }}</h1>
                  <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">企业导师</span>
                  <span v-if="mentor.verified" class="ml-2 mt-1 md:mt-0 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">已认证</span>
                </div>
                <p class="text-gray-500 mt-1">所属企业：{{ mentor.company || '未绑定' }}</p>
              </div>
            </div>
            <div class="ml-0 md:ml-auto mt-6 md:mt-0 flex flex-col md:flex-row items-center gap-3">
              <div class="flex flex-col items-center md:items-end">
                <div class="text-gray-600 text-sm">{{ mentor.email }}</div>
                <div class="text-gray-600 text-sm">{{ mentor.phone }}</div>
              </div>
              <div class="flex gap-2 mt-3 md:mt-0">
                <button @click="onEditProfileClick" class="px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                  编辑资料
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Tab 导航栏 -->
      <div class="flex gap-4 mb-8 mt-4">
        <button :class="['px-6 py-2 rounded-t-lg font-semibold', activeTab === 'job' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700']" @click="activeTab = 'job'">岗位管理</button>
        <button :class="['px-6 py-2 rounded-t-lg font-semibold', activeTab === 'apply' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700']" @click="activeTab = 'apply'">查看申请</button>
        <button :class="['px-6 py-2 rounded-t-lg font-semibold', activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700']" @click="activeTab = 'chat'">聊天</button>
      </div>
      <!-- Tab 内容 -->
      <div>
        <JobManagement
          v-if="activeTab === 'job'"
          :jobs="jobs"
          :jobsLoading="jobsLoading"
          :totalJobs="totalJobs"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @create-job="openCreateJobDialog"
          @update:currentPage="fetchJobs"
          @update:sortBy="onSortByChange"
          @edit-job="onEditJob"
        />
        <ApplicationSummary
          v-if="activeTab === 'apply'"
          :allApplications="allApplications"
          :allApplicationsLoading="allApplicationsLoading"
          :applicationStatusMap="applicationStatusMap"
          :statusOptions="statusOptions"
          @update-status="app => onUpdateStatus(app, true)"
        />
        <ChatPanel v-if="activeTab === 'chat'" :myUserId="myUserId" :myAvatar="userAvatar" />
      </div>
    </div>
    
    <!-- 课程详情对话框 -->
    <div v-if="showCourseDetailsDialog && currentCourse" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">课程详情</h2>
          <button @click="showCourseDetailsDialog = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold">{{ currentCourse.title }}</h3>
            <p class="text-gray-600 mt-1">{{ currentCourse.description }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">授课教师</p>
              <p>{{ currentCourse.teacherName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">企业导师</p>
              <p>{{ currentCourse.mentorName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程时间</p>
              <p>{{ formatDate(currentCourse.scheduledTime) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程地点</p>
              <p>{{ currentCourse.location || '未指定' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程类型</p>
              <p>{{ getCourseTypeText(currentCourse.courseType as CourseType) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">当前状态</p>
              <p>{{ getCourseStatusText(currentCourse.status as CourseStatus) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">已报名/最大人数</p>
              <p>{{ currentCourse.enrolledCount }}/{{ currentCourse.maxStudents }}</p>
            </div>
          </div>
          <div class="flex justify-end mt-4 space-x-2">
            <button @click="openResourceUploadDialog(currentCourse.id)" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              上传资源
            </button>
            <button @click="showCourseDetailsDialog = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              关闭
            </button>
          </div>
        </div>
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
import { getMe, updatePassword, updateUserInfo } from '@/lib/api/auth'
import Navbar from '@/components/layout/Navbar.vue'

// 导入双师课堂相关API
import { 
  getMentorCourses,
  updateCourse,
  CourseStatus,
  CourseType,
  DualTeacherCourseVO,
  CourseResourceDTO,
  uploadResource,
  deleteResource,
  getResourcesByCourseId
} from '@/lib/api/classroom'


import { getJobs, Job, createJob, JobCreationDTO, updateJob, getPublicJobCategories, getJobApplications, updateApplicationStatus } from '@/lib/api/job'
import GridJobList from '@/components/job/GridJobList.vue'
import { getResumeById } from '@/lib/api/resume'
import JobManagement from '@/components/dashboard/JobManagement.vue'
import ApplicationSummary from '@/components/dashboard/ApplicationSummary.vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'


const mentor = ref({
  avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
  name: '加载中...',
  email: '',
  phone: '',
  verified: false,
  company: '加载中...',
  school: ''
})

const students = [
  { id: 1, name: '李四', major: '计算机' },
  { id: 2, name: '王五', major: '人工智能' }
]
const projects = [
  { id: 1, title: 'AI创新项目', date: '2024-06-01' },
  { id: 2, title: '大数据分析', date: '2024-05-15' }
]
const resources = [
  { id: 1, title: '企业导师手册', date: '2024-06-20' }
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
  data: BlockDataItem[];
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
    footer: { text: '管理课程', link: '/classroom' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: 'AI创新项目', extra: '进行中' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/project' }
  },
  {
    title: '学生成果查看',
    icon: AcademicCapIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: 'AI创新项目论文', extra: '李四' }
    ],
    empty: '暂无成果',
    footer: { text: '查看全部成果', link: '/achievements' }
  },
  {
    title: '资源上传',
    icon: ArrowUpTrayIcon,
    color: 'text-purple-500',
    data: [],
    empty: '暂无上传资源',
    footer: { text: '上传资源', link: '/resources' }
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
const userAvatar = computed(() => userInfo.value.avatar || mentor.value.avatar)
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

// 添加课程相关响应式数据
const classroomCurrentPage = ref(1)
const classroomPageSize = ref(10)
const courseList = ref<DualTeacherCourseVO[]>([])
const totalCourses = ref(0)
const showCourseDetailsDialog = ref(false)
const currentCourse = ref<DualTeacherCourseVO | null>(null)

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

// 添加 fetchMentorInfo 函数
async function fetchMentorInfo() {
  try {
    const res = await getMe() as any
    const userData = res.data
    if (userData) {
      mentor.value = {
        avatar: userData.avatar || 'https://randomuser.me/api/portraits/men/34.jpg',
        name: userData.nickname || userData.account || '未知导师',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        company: userData.organizationName || '未绑定企业',
        school: ''
      }
    }
  } catch (e: any) {
    console.error('获取导师信息失败:', e)
    // 保持默认值
  }
}

// 添加获取导师参与的课程列表的方法
async function fetchMentorCourses() {
  try {
    const response = await getMentorCourses(classroomCurrentPage.value, classroomPageSize.value)
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
    console.error('获取导师课程列表失败:', error)
  }
}

// 查看课程详情
function viewCourseDetails(course: DualTeacherCourseVO) {
  currentCourse.value = course
  showCourseDetailsDialog.value = true
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

// 格式化日期显示
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取课程状态中文名称
function getCourseStatusText(status: CourseStatus) {
  const statusMap: Record<string, string> = {
    'planning': '筹备中',
    'open': '开放报名',
    'in_progress': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 获取课程类型中文名称
function getCourseTypeText(type: CourseType) {
  const typeMap: Record<string, string> = {
    'online': '线上',
    'offline': '线下',
    'hybrid': '混合'
  }
  return typeMap[type] || '未知类型'
}

onMounted(() => {
  fetchMentorInfo()
  fetchMentorCourses()
  fetchJobs()
  fetchAllApplications()

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

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    await updateUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    showEditProfileDialog.value = false
    await fetchMentorInfo() // 重新获取导师信息
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

const jobs = ref<Job[]>([])
const totalJobs = ref(0)
const totalPages = ref(1)
const jobsLoading = ref(false)
const sortBy = ref('latest')

function onSortByChange(newSort) {
  sortBy.value = newSort
  fetchJobs(1)
}

async function fetchJobs(page = 1) {
  jobsLoading.value = true
  try {
    const res = await getJobs({
      posterId: userInfo.value.id,
      page: page,
      size: pageSize.value,
      sortBy: sortBy.value
    })
    jobs.value = res.data.records
    totalJobs.value = res.data.total
    totalPages.value = res.data.pages
    currentPage.value = page
  } finally {
    jobsLoading.value = false
  }
}

const showCreateJobDialog = ref(false)
const createJobLoading = ref(false)
const newJob = ref<JobCreationDTO>({
  title: '',
  description: '',
  location: '',
  jobType: '',
  educationRequirement: '',
  salaryMin: undefined,
  salaryMax: undefined,
  salaryUnit: '',
  headcount: undefined,
  experienceRequirement: '',
  applicationDeadline: '',
  skillTags: '',
  categoryId: 0
})

const jobCategories = ref<{ id: number; name: string }[]>([])

async function fetchJobCategories() {
  // 只查三级分类，假设后端返回全部分类，前端筛选 level===3
  const res = await getPublicJobCategories({ page: 1, size: 100 })
  if (res && res.data && Array.isArray(res.data)) {
    jobCategories.value = res.data.filter((cat: any) => cat.level === 3).map((cat: any) => ({ id: cat.id, name: cat.name }))
  }
}

// 打开创建岗位弹窗时拉取分类
function openCreateJobDialog() {
  fetchJobCategories()
  showCreateJobDialog.value = true
}

async function onCreateJob() {
  createJobLoading.value = true
  try {
    await createJob(newJob.value)
    showCreateJobDialog.value = false
    // 重置表单
    newJob.value = {
      title: '',
      description: '',
      location: '',
      jobType: '',
      educationRequirement: '',
      salaryMin: undefined,
      salaryMax: undefined,
      salaryUnit: '',
      headcount: undefined,
      experienceRequirement: '',
      applicationDeadline: '',
      skillTags: '',
      categoryId: 0
    }
    await fetchJobs()
    alert('岗位创建成功！')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    createJobLoading.value = false
  }
}

const showEditJobDialog = ref(false)
const editJobLoading = ref(false)
const editJobId = ref<number | null>(null)
const editJobData = ref<JobCreationDTO>({
  title: '',
  description: '',
  location: '',
  jobType: '',
  educationRequirement: '',
  salaryMin: undefined,
  salaryMax: undefined,
  salaryUnit: '',
  headcount: undefined,
  experienceRequirement: '',
  applicationDeadline: '',
  skillTags: '',
  categoryId: 0
})

function onEditJob(job: Job) {
  fetchJobCategories()
  editJobId.value = job.id
  editJobData.value = {
    title: job.title,
    description: job.description,
    location: job.location,
    jobType: job.jobType,
    educationRequirement: job.educationRequirement,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryUnit: job.salaryUnit ?? '',
    headcount: job.headcount ?? undefined,
    experienceRequirement: job.experienceRequirement ?? '',
    applicationDeadline: job.applicationDeadline ?? '',
    skillTags: job.skillTags ?? '',
    categoryId: job.category?.id || 0
  }
  showEditJobDialog.value = true
}

async function onUpdateJob() {
  if (!editJobId.value) return
  editJobLoading.value = true
  try {
    await updateJob(editJobId.value, editJobData.value)
    showEditJobDialog.value = false
    await fetchJobs(currentPage.value)
    alert('岗位信息已更新！')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    editJobLoading.value = false
  }
}

const showApplicationsDialog = ref(false)
const applications = ref<any[]>([])
const applicationsLoading = ref(false)
const selectedJob = ref<Job | null>(null)
const applicationsPage = ref(1)
const applicationsTotal = ref(0)
const applicationsPageSize = ref(10)

const showResumeDialog = ref(false)
const resumeDetail = ref<any>(null)
const resumeLoading = ref(false)

const statusOptions = [
  { value: 'submitted', label: '已提交' },
  { value: 'viewed', label: '已查看' },
  { value: 'interviewing', label: '面试中' },
  { value: 'offered', label: '已录用' },
  { value: 'rejected', label: '已拒绝' }
]

// 用于临时存储每个申请的下拉状态
const applicationStatusMap = ref<Record<number, string>>({})

async function onUpdateStatus(app, isAll = false) {
  const newStatus = applicationStatusMap.value[app.id]
  if (!newStatus || newStatus === app.status) {
    alert('请选择不同的状态')
    return
  }
  await updateApplicationStatus(app.id, { status: newStatus })
  if (isAll) {
    await fetchAllApplications()
  } else {
    await fetchApplications(applicationsPage.value)
  }
  alert('状态已更新')
}

async function openApplicationsDialog(job: Job) {
  selectedJob.value = job
  showApplicationsDialog.value = true
  await fetchApplications()
}

async function fetchApplications(page = 1) {
  if (!selectedJob.value) return
  applicationsLoading.value = true
  try {
    const res = await getJobApplications(selectedJob.value.id, page, applicationsPageSize.value)
    applications.value = res.data.records || []
    applicationsTotal.value = res.data.total || 0
    applicationsPage.value = page
    // 初始化下拉状态
    applicationStatusMap.value = {}
    for (const app of applications.value) {
      applicationStatusMap.value[app.id] = app.status
    }
  } finally {
    applicationsLoading.value = false
  }
}

async function onViewResume(resumeId: number) {
  resumeLoading.value = true
  showResumeDialog.value = true
  try {
    const res = await getResumeById(resumeId)
    resumeDetail.value = res.data
  } finally {
    resumeLoading.value = false
  }
}

// 一次性展示所有岗位的所有申请人
const allApplications = ref<any[]>([])
const showAllApplicationsDialog = ref(false)
const allApplicationsLoading = ref(false)

async function fetchAllApplications() {
  allApplicationsLoading.value = true
  try {
    const jobsRes = await getJobs({ posterId: userInfo.value.id, page: 1, size: 100 })
    const jobs = jobsRes.data.records || []
    let applications: any[] = []
    for (const job of jobs) {
      const res = await getJobApplications(job.id, 1, 100)
      const apps = (res.data.records || []).map(app => ({
        ...app,
        jobTitle: job.title,
        jobId: job.id
      }))
      applications = applications.concat(apps)
    }
    // 批量补全 resumeUrl
    for (const app of applications) {
      if (!app.resumeUrl && app.resumeId) {
        try {
          const resumeRes = await getResumeById(app.resumeId)
          app.resumeUrl = resumeRes.data?.resumeUrl || ''
        } catch (e) {
          app.resumeUrl = ''
        }
      }
    }
    allApplications.value = applications
    // 初始化下拉状态
    applicationStatusMap.value = {}
    for (const app of applications) {
      applicationStatusMap.value[app.id] = app.status
    }
  } finally {
    allApplicationsLoading.value = false
  }
}

const activeTab = ref('job') // 'job' or 'apply' or 'chat'
const myUserId = computed(() => userInfo.value.id)
</script> 