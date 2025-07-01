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
    <!-- 编辑岗位弹窗 -->
    <div v-if="showEditJobDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        <button @click="showEditJobDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">编辑岗位</h2>
        <form @submit.prevent="onUpdateJob">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">岗位名称</label>
              <input v-model="editJobData.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入岗位名称" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">工作地点</label>
              <input v-model="editJobData.location" required class="w-full px-3 py-2 border rounded" placeholder="请输入工作地点" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">岗位类型</label>
              <select v-model="editJobData.jobType" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="full_time">全职</option>
                <option value="part_time">兼职</option>
                <option value="internship">实习</option>
                <option value="remote">远程</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">学历要求</label>
              <select v-model="editJobData.educationRequirement" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="bachelor">本科及以上</option>
                <option value="master">硕士及以上</option>
                <option value="doctor">博士及以上</option>
                <option value="any">不限</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">最低薪资 (k)</label>
              <input v-model.number="editJobData.salaryMin" type="number" min="0" class="w-full px-3 py-2 border rounded" placeholder="最低薪资" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">最高薪资 (k)</label>
              <input v-model.number="editJobData.salaryMax" type="number" min="0" class="w-full px-3 py-2 border rounded" placeholder="最高薪资" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">薪资单位</label>
              <select v-model="editJobData.salaryUnit" class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="per_month">元/月</option>
                <option value="per_year">元/年</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">招聘人数</label>
              <input v-model.number="editJobData.headcount" type="number" min="1" class="w-full px-3 py-2 border rounded" placeholder="招聘人数" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">经验要求</label>
              <select v-model="editJobData.experienceRequirement" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="fresh_graduate">应届毕业生</option>
                <option value="less_than_1_year">1年以下</option>
                <option value="1_to_3_years">1-3年</option>
                <option value="any">不限</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">截止日期</label>
              <input v-model="editJobData.applicationDeadline" type="date" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">技能标签（逗号分隔）</label>
              <input v-model="editJobData.skillTags" class="w-full px-3 py-2 border rounded" placeholder="如：Java,Vue,SQL" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">岗位分类</label>
              <select v-model="editJobData.categoryId" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option v-for="cat in jobCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 mb-1">岗位描述</label>
            <textarea v-model="editJobData.description" required class="w-full px-3 py-2 border rounded min-h-[80px]" placeholder="请输入岗位描述"></textarea>
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" @click="showEditJobDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="editJobLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ editJobLoading ? '保存中...' : '保存' }}</button>
          </div>
        </form>
      </div>
    </div>
    <!-- 编辑个人资料弹窗 -->
    <div v-if="showEditProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">编辑个人资料</h2>
        <form @submit.prevent="onUpdateProfile">
          <div class="mb-5 flex flex-col items-center">
            <div class="relative group">
              <img :src="mentor.avatar" class="w-28 h-28 rounded-full border-2 border-blue-200 mb-2 object-cover" alt="avatar" />
              <div class="absolute inset-0 rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200">
                <span class="text-white text-sm">更换头像</span>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">昵称</label>
            <input v-model="editProfile.nickname" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入昵称" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">邮箱</label>
            <input v-model="editProfile.email" type="email" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入邮箱" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">手机号</label>
            <input v-model="editProfile.phone" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入手机号" />
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showEditProfileDialog = false" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">取消</button>
            <button type="submit" :disabled="updateProfileLoading" class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center">
              <svg v-if="updateProfileLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ updateProfileLoading ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
        <!-- 修改密码区块 -->
        <div class="mt-6 pt-4 border-t">
          <h3 class="text-lg font-semibold mb-3">修改密码</h3>
          <form @submit.prevent="onChangePassword">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">原密码</label>
              <input v-model="passwordChange.oldPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入原密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">新密码</label>
              <input v-model="passwordChange.newPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入新密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">确认新密码</label>
              <input v-model="passwordChange.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请再次输入新密码" />
            </div>
            <div class="flex justify-end space-x-2">
              <button type="submit" :disabled="changePasswordLoading" class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition flex items-center">
                <svg v-if="changePasswordLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ changePasswordLoading ? '修改中...' : '修改密码' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- 创建岗位弹窗 -->
    <div v-if="showCreateJobDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        <button @click="showCreateJobDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">创建新岗位</h2>
        <form @submit.prevent="onCreateJob">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">岗位名称</label>
              <input v-model="newJob.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入岗位名称" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">工作地点</label>
              <input v-model="newJob.location" required class="w-full px-3 py-2 border rounded" placeholder="请输入工作地点" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">岗位类型</label>
              <select v-model="newJob.jobType" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="full_time">全职</option>
                <option value="part_time">兼职</option>
                <option value="internship">实习</option>
                <option value="remote">远程</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">学历要求</label>
              <select v-model="newJob.educationRequirement" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="bachelor">本科及以上</option>
                <option value="master">硕士及以上</option>
                <option value="doctor">博士及以上</option>
                <option value="any">不限</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">最低薪资 (k)</label>
              <input v-model.number="newJob.salaryMin" type="number" min="0" class="w-full px-3 py-2 border rounded" placeholder="最低薪资" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">最高薪资 (k)</label>
              <input v-model.number="newJob.salaryMax" type="number" min="0" class="w-full px-3 py-2 border rounded" placeholder="最高薪资" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">薪资单位</label>
              <select v-model="newJob.salaryUnit" class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="per_month">元/月</option>
                <option value="per_year">元/年</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">招聘人数</label>
              <input v-model.number="newJob.headcount" type="number" min="1" class="w-full px-3 py-2 border rounded" placeholder="招聘人数" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">经验要求</label>
              <select v-model="newJob.experienceRequirement" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option value="fresh_graduate">应届毕业生</option>
                <option value="less_than_1_year">1年以下</option>
                <option value="1_to_3_years">1-3年</option>
                <option value="any">不限</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">截止日期</label>
              <input v-model="newJob.applicationDeadline" type="date" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">技能标签（逗号分隔）</label>
              <input v-model="newJob.skillTags" class="w-full px-3 py-2 border rounded" placeholder="如：Java,Vue,SQL" />
            </div>
            <div>
              <label class="block text-gray-700 mb-1">岗位分类</label>
              <select v-model="newJob.categoryId" required class="w-full px-3 py-2 border rounded">
                <option value="">请选择</option>
                <option v-for="cat in jobCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 mb-1">岗位描述</label>
            <textarea v-model="newJob.description" required class="w-full px-3 py-2 border rounded min-h-[80px]" placeholder="请输入岗位描述"></textarea>
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" @click="showCreateJobDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="createJobLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ createJobLoading ? '创建中...' : '创建' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { UserGroupIcon, BriefcaseIcon, AcademicCapIcon, ArrowUpTrayIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getMe, updatePassword, updateUserInfo } from '@/lib/api/auth'
import Navbar from '@/components/layout/Navbar.vue'
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
const blocks = ref([
  {
    title: '双师课堂管理',
    icon: UserGroupIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: '大数据实战', extra: '2024-07-01' }
    ],
    empty: '暂无课程',
    footer: { text: '管理课程', link: '/courses' }
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

const userInfo = computed(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/men/34.jpg')
const roleText = computed(() => {
  const role = userInfo.value.role
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

const myUserId = computed(() => userInfo.value.id)

async function fetchMentorInfo() {
  try {
    const res = await getMe()
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

onMounted(() => {
  fetchMentorInfo()
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
    const res = await getMe()
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

const jobs = ref<Job[]>([])
const totalJobs = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
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
</script> 