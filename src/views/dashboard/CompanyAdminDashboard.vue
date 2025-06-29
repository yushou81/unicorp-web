<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white/90 shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="container mx-auto px-4 flex items-center justify-between h-14">
        <div class="flex items-center space-x-4">
          <span class="text-lg font-bold text-blue-700 tracking-wide">企业管理平台</span>
          <span class="text-gray-400 text-sm ml-4">（可在此展示全局信息）</span>
        </div>
        <div class="flex items-center space-x-4">
          <Button @click="onLogout" variant="outline" size="sm">退出登录</Button>
        </div>
      </div>
    </nav>
    <!-- 大标题区 -->
    <div class="w-full py-10 bg-gradient-to-r from-blue-400 to-indigo-400 mb-8 shadow-lg">
      <div class="container mx-auto px-4 flex flex-col items-center">
        <h1 class="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2 tracking-wide">企业管理后台</h1>
        <p class="text-lg md:text-xl text-blue-100 font-medium mb-2">欢迎来到企业管理平台</p>
        <p class="text-base text-blue-200">高效管理企业导师与个人信息</p>
      </div>
    </div>
    <!-- 个人信息板块 -->
    <div class="flex flex-col items-center mb-8">
      <img :src="company.logo || 'https://randomuser.me/api/portraits/lego/1.jpg'" class="w-20 h-20 rounded-full shadow-lg border-4 border-white mb-2" />
      <div class="text-xl font-bold text-gray-800">{{ userInfo.nickname || userInfo.account || '企业管理员' }}</div>
      <div class="mt-1 flex items-center space-x-2">
        <span class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">企业管理员</span>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{{ company.organizationName || '加载中...' }}</span>
        <span v-if="company.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
      </div>
    </div>
    <!-- 数据统计区 -->
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-white/80 rounded-2xl shadow flex flex-col items-center p-6">
          <UserGroupIcon class="w-8 h-8 text-blue-500 mb-2" />
          <span class="text-2xl font-bold text-blue-700">{{ mentorTotal }}</span>
          <span class="text-gray-500 mt-1">企业导师数</span>
        </div>
        <!-- 可扩展更多统计卡片 -->
      </div>
      <!-- 功能入口卡片区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        <div
          class="group cursor-pointer bg-gradient-to-br from-blue-100 to-blue-300 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl"
          @click="showMentorDialog = true"
        >
          <UserGroupIcon class="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
          <span class="text-lg font-bold text-blue-800 mb-1">企业导师管理</span>
          <span class="text-sm text-blue-500">管理企业导师账号与权限</span>
        </div>
        <div
          class="group cursor-pointer bg-gradient-to-br from-purple-100 to-purple-300 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl"
          @click="onEditProfileClick"
        >
          <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-200 mb-4"><span class="text-2xl text-purple-700 font-bold">我</span></span>
          <span class="text-lg font-bold text-purple-800 mb-1">编辑个人资料</span>
          <span class="text-sm text-purple-500">修改个人信息与密码</span>
        </div>
      </div>
      <!-- 企业导师管理弹窗 -->
      <div v-if="showMentorDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl overflow-y-auto max-h-[80vh] relative">
          <button @click="showMentorDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-blue-700">企业导师列表</h2>
            <Button @click="showAddMentorDialog = true">添加企业导师账号</Button>
          </div>
          <!-- 复用原有导师表格和分页 -->
          <div v-if="mentorLoading" class="text-center text-gray-400 py-8">加载中...</div>
          <div v-else-if="mentorError" class="text-center text-red-500 py-8">{{ mentorError }}</div>
          <div v-else>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="mentor in mentors" :key="mentor.id">
                  <td class="px-4 py-2">{{ mentor.email }}</td>
                  <td class="px-4 py-2">{{ mentor.nickname || '-' }}</td>
                  <td class="px-4 py-2">{{ mentor.phone || '-' }}</td>
                  <td class="px-4 py-2">{{ mentor.status || '-' }}</td>
                  <td class="px-4 py-2 space-x-2">
                    <Button size="sm" @click="onEditMentor(mentor)">编辑</Button>
                    <Button 
                      v-if="mentor.status === 'active'" 
                      size="sm" 
                      variant="destructive" 
                      @click="onUpdateMentorStatus(mentor, 'inactive')"
                    >
                      禁用
                    </Button>
                    <Button 
                      v-else 
                      size="sm" 
                      variant="default" 
                      @click="onUpdateMentorStatus(mentor, 'active')"
                    >
                      启用
                    </Button>
                  </td>
                </tr>
                <tr v-if="mentors.length === 0">
                  <td colspan="5" class="text-center text-gray-400 py-4">暂无导师</td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-end mt-4" v-if="mentorTotal > mentorSize">
              <button @click="mentorPage > 0 && (mentorPage--, fetchMentors())" :disabled="mentorPage === 0" class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2">上一页</button>
              <span class="text-sm text-gray-500">第 {{ mentorPage + 1 }} 页 / 共 {{ Math.ceil(mentorTotal / mentorSize) }} 页</span>
              <button @click="(mentorPage + 1) * mentorSize < mentorTotal && (mentorPage++, fetchMentors())" :disabled="(mentorPage + 1) * mentorSize >= mentorTotal" class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2">下一页</button>
            </div>
          </div>
          <!-- 复用原有添加/编辑/禁用导师弹窗 -->
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
        <Button @click="showMentorDialog = false" class="mt-6">关闭</Button>
      </div>
      <!-- 编辑个人资料弹窗 -->
      <div v-if="showProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[80vh] relative">
          <button @click="showProfileDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-purple-600 text-2xl font-bold focus:outline-none">×</button>
          <h2 class="text-2xl font-bold mb-4 text-purple-700">编辑个人资料</h2>
          <!-- 复用原有个人资料表单 -->
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
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BriefcaseIcon, AcademicCapIcon, DocumentTextIcon, ShieldCheckIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { createMentor, getMentorList, updateMentorStatus, updateMentorInfo } from '@/lib/api/enterpriseAdmin'
import { getMe, updatePassword, updateUserInfo } from '@/lib/api/auth'
import { updateUser } from '@/lib/api/admin'
import Button from '@/components/ui/Button.vue'

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

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    await updateUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    showEditProfileDialog.value = false
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
</script> 