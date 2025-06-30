<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <div class="py-10">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
          <img :src="mentor.avatar" class="w-20 h-20 rounded-full border-2 border-blue-200 mr-6" alt="avatar" />
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="text-2xl font-bold text-gray-900 mr-2">{{ mentor.name }}</span>
              <span v-if="mentor.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
            </div>
            <div class="text-gray-500 text-sm mb-1">{{ mentor.email }}</div>
            <div class="text-gray-500 text-sm">{{ mentor.phone }}</div>
            <div class="text-gray-500 text-sm mt-1">所属企业：{{ mentor.company || '未绑定' }}</div>
          </div>
          <button @click="onEditProfileClick" class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑资料</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div v-for="(block, idx) in blocks" :key="idx" class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 flex flex-col mb-2">
            <div class="flex items-center mb-4">
              <component :is="block.icon" class="w-7 h-7 mr-2" :class="block.color" />
              <span class="font-semibold text-lg">{{ block.title }}</span>
            </div>
            <ul>
              <li v-for="item in block.data" :key="item.id || item" class="flex justify-between items-center mb-2 text-gray-700">
                <span>{{ item.label || item }}</span>
                <span v-if="item.extra" class="text-xs text-gray-400 ml-2">{{ item.extra }}</span>
              </li>
              <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
            </ul>
            <div v-if="block.footer">
              <router-link :to="block.footer.link" class="text-blue-600 hover:underline text-xs font-medium mt-2">{{ block.footer.text }}</router-link>
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
        <!-- 我发布的岗位区块 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-blue-700">我发布的岗位</h2>
            <button @click="openCreateJobDialog" class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">创建新岗位</button>
          </div>
          <GridJobList
            :jobs="jobs"
            :loading="jobsLoading"
            :totalJobs="totalJobs"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :showEdit="true"
            @update:currentPage="fetchJobs"
            @update:sortBy="onSortByChange"
            @edit="onEditJob"
          />
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
import { getJobs, Job, createJob, JobCreationDTO, updateJob, getPublicJobCategories } from '@/lib/api/job'
import GridJobList from '@/components/job/GridJobList.vue'

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

async function fetchMentorInfo() {
  try {
    const res = await getMe()
    const userData = res.data
    if (userData) {
      mentor.value = {
        avatar: userData.avatarUrl || 'https://randomuser.me/api/portraits/men/34.jpg',
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

onMounted(() => {
  fetchJobs()
})

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
</script> 