<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">企业管理平台</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ userInfo.nickname || userInfo.account || '用户' }}</span>
            <Button @click="onLogout" variant="outline" size="sm">退出登录</Button>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="py-10">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
          <img :src="company.logo || 'https://randomuser.me/api/portraits/lego/1.jpg'" class="w-20 h-20 rounded border-2 border-blue-200 mr-6" alt="logo" />
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="text-2xl font-bold text-gray-900 mr-2">{{ company.organizationName || '加载中...' }}</span>
              <span v-if="company.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <Button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑企业信息</Button>
            <Button @click="onEditProfileClick" class="px-4 py-1 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 transition shadow">编辑个人资料</Button>
          </div>
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
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xl font-bold text-blue-700">企业导师列表</h2>
            <Button @click="showAddMentorDialog = true">添加企业导师账号</Button>
          </div>
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
        </div>
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
</script> 