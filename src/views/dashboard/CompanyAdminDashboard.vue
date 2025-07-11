<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <!-- 个人信息卡片 -->
      <UserProfileInfo
        :avatar="userAvatar"
        :name="userInfo.nickname || userInfo.account || '企业管理员'"
        :role="'企业管理员'"
        :organization="organizationName || company.organizationName"
        :organizationLogo="organizationLogo"
        :phone="userInfo.phone"
        :email="userInfo.email"
        :editable="true"
        :onEdit="onEditProfileClick"
      />
      <!-- Tab 导航栏 -->
      <DashboardTabs :tabs="tabList" :activeTab="activeTab" @change="val => activeTab = val" />
     
      <div class="mt-6">
        <!-- 企业导师管理 -->
        <div v-if="activeTab === 'mentor'">
          <!-- 企业导师管理表格、分页、添加/编辑/禁用弹窗等内容 -->
          <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl mx-auto overflow-x-auto">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-blue-700">企业导师列表</h2>
              <Button @click="showAddMentorDialog = true">添加企业导师账号</Button>
            </div>
            <div v-if="mentorLoading" class="text-center text-gray-400 py-8">加载中...</div>
            <div v-else-if="mentorError" class="text-center text-red-500 py-8">{{ mentorError }}</div>
            <div v-else>
              <table class="min-w-full divide-y divide-gray-200 text-base">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">邮箱</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">昵称</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">手机号</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">状态</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="mentor in mentors" :key="mentor.id">
                    <td class="px-6 py-4">{{ mentor.email }}</td>
                    <td class="px-6 py-4">{{ mentor.nickname || '-' }}</td>
                    <td class="px-6 py-4">{{ mentor.phone || '-' }}</td>
                    <td class="px-6 py-4">{{ mentor.status || '-' }}</td>
                    <td class="px-6 py-4 space-x-2">
                      <Button size="sm" @click="onEditMentor(mentor)">编辑</Button>
                      <Button 
                        v-if="mentor.status === 'active'" 
                        size="sm" 
                        variant="destructive" 
                        @click="onUpdateMentorStatus(mentor, 'inactive')"
                      >禁用</Button>
                      <Button 
                        v-else 
                        size="sm" 
                        variant="default" 
                        @click="onUpdateMentorStatus(mentor, 'active')"
                      >启用</Button>
                    </td>
                  </tr>
                  <tr v-if="mentors.length === 0">
                    <td colspan="5" class="text-center text-gray-400 py-6 text-base">暂无导师</td>
                  </tr>
                </tbody>
              </table>
              <div class="flex justify-end mt-4" v-if="mentorTotal > mentorSize">
                <button @click="mentorPage > 0 && (mentorPage--, fetchMentors())" :disabled="mentorPage === 0" class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2">上一页</button>
                <span class="text-sm text-gray-500">第 {{ mentorPage + 1 }} 页 / 共 {{ Math.ceil(mentorTotal / mentorSize) }} 页</span>
                <button @click="(mentorPage + 1) * mentorSize < mentorTotal && (mentorPage++, fetchMentors())" :disabled="(mentorPage + 1) * mentorSize >= mentorTotal" class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2">下一页</button>
              </div>
            </div>
            <!-- 添加/编辑/禁用导师弹窗 -->
            <div v-if="showAddMentorDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">添加企业导师账号</h2>
                <form @submit.prevent="onAddMentor">
                  <div class="mb-3">
                    <label class="block text-gray-700 mb-1">邮箱</label>
                    <input v-model="newMentor.email" required class="w-full px-3 py-2 border rounded" placeholder="请输入导师邮箱" />
                  </div>
                  <div class="mb-3">
                    <label class="block text-gray-700 mb-1">昵称</label>
                    <input v-model="newMentor.nickname" class="w-full px-3 py-2 border rounded" placeholder="请输入导师昵称（可选）" />
                  </div>
                  <div class="mb-3">
                    <label class="block text-gray-700 mb-1">手机号</label>
                    <input v-model="newMentor.phone" class="w-full px-3 py-2 border rounded" placeholder="请输入手机号（可选）" />
                  </div>
                  <div class="mb-3">
                    <label class="block text-gray-700 mb-1">初始密码</label>
                    <input v-model="newMentor.password" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入初始密码" />
                  </div>
                  <div class="flex justify-end space-x-2 mt-4">
                    <button type="button" @click="showAddMentorDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
                    <button type="submit" :disabled="addMentorLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ addMentorLoading ? '添加中...' : '添加' }}</button>
                  </div>
                </form>
              </div>
            </div>
            <div v-if="showEditMentorDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">编辑导师信息</h2>
                <form @submit.prevent="onUpdateMentor">
                  <div class="mb-3">
                    <label class="block text-gray-700 mb-1">邮箱</label>
                    <input v-model="editMentor.email" required class="w-full px-3 py-2 border rounded" />
                  </div>
                  <div class="mb-3">
                    <label class="block text-gray-700 mb-1">昵称</label>
                    <input v-model="editMentor.nickname" class="w-full px-3 py-2 border rounded" />
                  </div>
                  <div class="mb-3">
                    <label class="block text-gray-700 mb-1">手机号</label>
                    <input v-model="editMentor.phone" class="w-full px-3 py-2 border rounded" />
                  </div>
                  <div class="flex justify-end space-x-2 mt-4">
                    <button type="button" @click="showEditMentorDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
                    <button type="submit" :disabled="editMentorLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ editMentorLoading ? '保存中...' : '保存' }}</button>
                  </div>
                </form>
              </div>
            </div>
            <div v-if="showDisableMentorDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
                <h2 class="text-xl font-bold mb-4">确认{{ statusActionText }}该导师账号？</h2>
                <div class="mb-6 text-gray-700">{{ statusActionDescription }}</div>
                <div class="flex justify-center space-x-4">
                  <button @click="showDisableMentorDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
                  <button @click="onConfirmUpdateStatus" :disabled="statusUpdateLoading" class="px-4 py-1 rounded bg-red-600 text-white">{{ statusUpdateLoading ? '处理中...' : '确认' }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 岗位管理 -->
        <div v-if="activeTab === 'job'">
          <GridJobList
            :jobs="jobs"
            :loading="jobsLoading"
            :totalJobs="totalJobs"
            :currentPage="currentPage"
            :totalPages="totalPages"
            @update:currentPage="fetchJobs"
            @update:sortBy="onSortByChange"
          />
        </div>
      </div>
    </div>
    <!-- 编辑个人资料弹窗 -->
    <div v-if="showProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[80vh] relative">
        <button @click="showProfileDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-purple-600 text-2xl font-bold focus:outline-none">×</button>
        <h2 class="text-2xl font-bold mb-4 text-purple-700">编辑个人资料</h2>
        <!-- 复用原有个人资料表单 -->
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
              >选择头像</button>
              <button 
                v-if="avatarFile" 
                type="button" 
                @click="cancelAvatarUpload" 
                class="px-3 py-1 rounded bg-red-100 text-red-600 text-sm hover:bg-red-200 transition ml-2"
              >取消</button>
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
            <button type="button" @click="showProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
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
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
              <button type="submit" :disabled="updateProfileLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ updateProfileLoading ? '修改中...' : '修改密码' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BriefcaseIcon, AcademicCapIcon, DocumentTextIcon, ShieldCheckIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { createMentor, getMentorList, updateMentorStatus, updateMentorInfo } from '@/lib/api/enterpriseAdmin'
import { getMe, updatePassword, updateUserInfo, uploadAvatar } from '@/lib/api/auth'
import { updateUser } from '@/lib/api/admin'
import Button from '@/components/ui/Button.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { getJobs, Job } from '@/lib/api/job'
import GridJobList from '@/components/job/GridJobList.vue'
import UserProfileInfo from '@/components/dashboard/UserProfileInfo.vue'
import DashboardTabs from '@/components/dashboard/DashboardTabs.vue'
import JobManagement from '@/components/dashboard/JobManagement.vue'
import { getSchoolById, getEnterpriseById } from '@/lib/api/organization'

const company = ref({
  logo: 'https://randomuser.me/api/portraits/lego/1.jpg',
  organizationName: '加载中...',
  verified: false
})

const blocks = ref([
  {
    title: '导师管理',
    icon: AcademicCapIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: '导师总数', extra: '8人' }
    ],
    empty: '暂无导师',
    footer: { text: '管理导师', link: '/mentors' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: '进行中项目', extra: '5个' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/projects' }
  },
  {
    title: '学生管理',
    icon: DocumentTextIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: '参与学生', extra: '23人' }
    ],
    empty: '暂无学生',
    footer: { text: '管理学生', link: '/students' }
  },
  {
    title: '系统设置',
    icon: ShieldCheckIcon,
    color: 'text-yellow-500',
    data: [
      { id: 1, label: '企业信息', extra: '已配置' }
    ],
    empty: '需要配置',
    footer: { text: '系统设置', link: '/settings' }
  }
])

// 导师相关
const mentors = ref<any[]>([])
const mentorTotal = ref(0)
const mentorPage = ref(0)
const mentorSize = ref(10)
const mentorLoading = ref(false)
const mentorError = ref('')

async function fetchMentors() {
  mentorLoading.value = true
  mentorError.value = ''
  try {
    const res = await getMentorList({ page: mentorPage.value, size: mentorSize.value })
    mentors.value = res.data?.records || []
    mentorTotal.value = res.data?.total || mentors.value.length
  } catch (e: any) {
    mentorError.value = e.message || '获取导师列表失败'
    mentors.value = []
  } finally {
    mentorLoading.value = false
  }
}

const showAddMentorDialog = ref(false)
const newMentor = ref({ email: '', nickname: '', password: '', phone: '' })
const addMentorLoading = ref(false)

async function onAddMentor() {
  addMentorLoading.value = true
  try {
    await createMentor(newMentor.value)
    showAddMentorDialog.value = false
    newMentor.value = { email: '', nickname: '', password: '', phone: '' }
    await fetchMentors()
    alert('导师账号创建成功')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    addMentorLoading.value = false
  }
}

const showEditMentorDialog = ref(false)
const editMentor = ref<any>({})
const editMentorLoading = ref(false)
const showDisableMentorDialog = ref(false)
const statusUpdateId = ref<number | null>(null)
const statusUpdateTarget = ref<'active' | 'inactive' | 'pending_approval' | null>(null)
const statusUpdateLoading = ref(false)

const statusActionText = computed(() => {
  if (statusUpdateTarget.value === 'inactive') return '禁用'
  if (statusUpdateTarget.value === 'active') return '启用'
  return '更新状态'
})

const statusActionDescription = computed(() => {
  if (statusUpdateTarget.value === 'inactive') return '禁用后该导师将无法登录，操作可逆。'
  if (statusUpdateTarget.value === 'active') return '启用后该导师可以正常登录。'
  return '更新导师状态。'
})

function onEditMentor(mentor: any) {
  editMentor.value = { ...mentor }
  showEditMentorDialog.value = true
}

async function onUpdateMentor() {
  editMentorLoading.value = true
  try {
    await updateMentorInfo(editMentor.value.id, {
      email: editMentor.value.email,
      nickname: editMentor.value.nickname,
      phone: editMentor.value.phone
    })
    showEditMentorDialog.value = false
    await fetchMentors()
    alert('导师信息已更新')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    editMentorLoading.value = false
  }
}

function onUpdateMentorStatus(mentor: any, status: 'active' | 'inactive' | 'pending_approval') {
  statusUpdateId.value = mentor.id
  statusUpdateTarget.value = status
  showDisableMentorDialog.value = true
}

async function onConfirmUpdateStatus() {
  if (!statusUpdateId.value || !statusUpdateTarget.value) return
  statusUpdateLoading.value = true
  try {
    await updateMentorStatus(statusUpdateId.value, statusUpdateTarget.value)
    showDisableMentorDialog.value = false
    await fetchMentors()
    alert(`导师账号已${statusActionText.value}`)
  } catch (e: any) {
    alert(`${statusActionText.value}失败：` + (e.message || '未知错误'))
  } finally {
    statusUpdateLoading.value = false
    statusUpdateId.value = null
    statusUpdateTarget.value = null
  }
}

async function fetchCompanyInfo() {
  try {
    const res = await getMe()
    const userData = res.data
    if (userData) {
      company.value = {
        logo: userData.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
        organizationName: userData.organizationName || userData.nickname || '未知企业',
        verified: userData.verified || false
      }
    }
  } catch (e: any) {
    console.error('获取企业信息失败:', e)
    // 保持默认值
  }
}

onMounted(() => {
  console.log('【当前页面】CompanyAdminDashboard.vue onMounted 被调用')
  fetchCompanyInfo()
  fetchMentors()
})

const router = useRouter()
const appStore = useAppStore()
const userInfo = computed(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg')
const roleText = computed(() => {
  const role = userInfo.value.role
  const roleMap: Record<string, string> = {
    'admin': '系统管理员',
    'SYSADMIN': '系统管理员',
    'schoolAdmin': '学校管理员',
    'SCHOOL_ADMIN': '学校管理员',
    'companyAdmin': '企业管理员',
    'ENTERPRISE_ADMIN': '企业管理员',
    'teacher': '教师',
    'TEACHER': '教师',
    'mentor': '企业导师',
    'MENTOR': '企业导师',
    'student': '学生',
    'STUDENT': '学生'
  }
  return roleMap[role] || '未知角色'
})

function onLogout() {
  appStore.logout()
  router.push('/login')
}

const showEditProfileDialog = ref(false)
const editProfile = ref({ nickname: '', email: '', phone: '' })
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
    
    await fetchCompanyInfo()
    
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

function onEditProfileClick() {
  editProfile.value = {
    nickname: userInfo.value.nickname || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || ''
  }
  showProfileDialog.value = true
}

const showMentorDialog = ref(false)
const showProfileDialog = ref(false)
const showJobDialog = ref(false)

const jobs = ref<Job[]>([])
const totalJobs = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const jobsLoading = ref(false)
const sortBy = ref('latest')

function onSortByChange(newSort) {
  sortBy.value = newSort
  fetchJobs(1) // 切换排序时回到第一页
}

async function fetchJobs(page = 1) {
  jobsLoading.value = true
  try {
    const res = await getJobs({
      organizeId: userInfo.value.organizationId,
      page: page,
      size: pageSize.value,
      sortBy: sortBy.value // 传递排序参数
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

// tab 配置
const tabList = [
  { label: '企业导师管理', value: 'mentor' },
  { label: '岗位管理', value: 'job' }
 
]
const activeTab = ref('mentor')

const organizationLogo = ref('')
const organizationName = ref('')

async function fetchUserInfo() {
  console.log('【当前页面】CompanyAdminDashboard.vue fetchUserInfo 被调用')
  // 假设 userInfo 已经有 role 和 organizationId
  await fetchOrganizationInfo()
}

async function fetchOrganizationInfo() {
  // 打印所有相关对象，便于调试
  console.log('company:', company)
  console.log('userInfo:', userInfo)
  // 优先从company.id、userInfo.organizationId、userInfo.companyId等字段获取组织ID
  const organizationId = company.value?.id || company.id || userInfo.organizationId || userInfo.companyId || userInfo.value?.organizationId || userInfo.value?.companyId
  const role = company.role || company.value?.role || userInfo.role || userInfo.value?.role || 'company'
  console.log('【当前页面】CompanyAdminDashboard.vue fetchOrganizationInfo 被调用', role, organizationId)
  if (role && organizationId) {
    let orgRes = await getEnterpriseById(organizationId)
    console.log('getEnterpriseById 返回:', orgRes)
    if (orgRes && orgRes.data) {
      organizationLogo.value = orgRes.data.logoUrl
      organizationName.value = orgRes.data.organizationName
      console.log('设置 organizationLogo:', organizationLogo.value, 'organizationName:', organizationName.value)
    }
  }
}

onMounted(() => {
  console.log('【当前页面】CompanyAdminDashboard.vue onMounted 被调用')
  fetchUserInfo()
})
</script>

<style scoped>
/* 保留原有样式 */
</style> 