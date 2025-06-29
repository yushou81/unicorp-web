<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">学校管理平台</h1>
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
          <img :src="school.logo" class="w-20 h-20 rounded border-2 border-blue-200 mr-6" alt="logo" />
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="text-2xl font-bold text-gray-900 mr-2">{{ school.name }}</span>
              <span v-if="school.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
            </div>
            <div class="text-gray-500 text-sm mb-1">学校代码：{{ school.code || '暂无' }}</div>
            <div class="text-gray-500 text-sm">联系人：{{ school.contact || '暂无' }}</div>
          </div>
          <div class="flex space-x-2">
            <Button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑学校信息</Button>
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
            <h2 class="text-xl font-bold text-blue-700">用户列表</h2>
            <Button @click="showAddTeacherDialog = true">添加用户账号</Button>
          </div>
          <div v-if="teacherLoading" class="text-center text-gray-400 py-8">加载中...</div>
          <div v-else-if="teacherError" class="text-center text-red-500 py-8">{{ teacherError }}</div>
          <div v-else>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">身份</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="teacher in teachers" :key="teacher.id">
                  <td class="px-4 py-2">{{ teacher.email }}</td>
                  <td class="px-4 py-2">{{ teacher.nickname || '-' }}</td>
                  <td class="px-4 py-2">{{ teacher.phone || '-' }}</td>
                  <td class="px-4 py-2">{{ teacher.roleName || teacher.role || (teacher.roles ? teacher.roles.join(',') : '-') }}</td>
                  <td class="px-4 py-2">{{ teacher.status || '-' }}</td>
                  <td class="px-4 py-2 space-x-2">
                    <Button size="sm" @click="onEditUser(teacher)">编辑</Button>
                    <Button 
                      v-if="teacher.status === 'active'" 
                      size="sm" 
                      variant="destructive" 
                      @click="onUpdateTeacherStatus(teacher, 'inactive')"
                    >
                      禁用
                    </Button>
                    <Button 
                      v-else 
                      size="sm" 
                      variant="default" 
                      @click="onUpdateTeacherStatus(teacher, 'active')"
                    >
                      启用
                    </Button>
                  </td>
                </tr>
                <tr v-if="teachers.length === 0">
                  <td colspan="6" class="text-center text-gray-400 py-4">暂无用户</td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-end mt-4" v-if="teacherTotal > teacherSize">
              <button @click="teacherPage > 0 && (teacherPage--, fetchTeachers())" :disabled="teacherPage === 0" class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2">上一页</button>
              <span class="text-sm text-gray-500">第 {{ teacherPage + 1 }} 页 / 共 {{ Math.ceil(teacherTotal / teacherSize) }} 页</span>
              <button @click="(teacherPage + 1) * teacherSize < teacherTotal && (teacherPage++, fetchTeachers())" :disabled="(teacherPage + 1) * teacherSize >= teacherTotal" class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2">下一页</button>
            </div>
          </div>
        </div>
        <div v-if="showAddTeacherDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">添加用户账号</h2>
            <form @submit.prevent="onAddTeacher">
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">邮箱</label>
                <input v-model="newTeacher.email" required class="w-full px-3 py-2 border rounded" placeholder="请输入用户邮箱" />
              </div>
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">昵称</label>
                <input v-model="newTeacher.nickname" class="w-full px-3 py-2 border rounded" placeholder="请输入用户昵称（可选）" />
              </div>
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">手机号</label>
                <input v-model="newTeacher.phone" class="w-full px-3 py-2 border rounded" placeholder="请输入手机号（可选）" />
              </div>
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">初始密码</label>
                <input v-model="newTeacher.password" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入初始密码" />
              </div>
              <div class="flex justify-end space-x-2 mt-4">
                <button type="button" @click="showAddTeacherDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
                <button type="submit" :disabled="addTeacherLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ addTeacherLoading ? '添加中...' : '添加' }}</button>
              </div>
            </form>
          </div>
        </div>
        <div v-if="showEditTeacherDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">编辑用户信息</h2>
            <form @submit.prevent="onUpdateTeacher">
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">邮箱</label>
                <input v-model="editTeacher.email" required class="w-full px-3 py-2 border rounded" />
              </div>
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">昵称</label>
                <input v-model="editTeacher.nickname" class="w-full px-3 py-2 border rounded" />
              </div>
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">手机号</label>
                <input v-model="editTeacher.phone" class="w-full px-3 py-2 border rounded" />
              </div>
              <div class="flex justify-end space-x-2 mt-4">
                <button type="button" @click="showEditTeacherDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
                <button type="submit" :disabled="editTeacherLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ editTeacherLoading ? '保存中...' : '保存' }}</button>
              </div>
            </form>
          </div>
        </div>
        <div v-if="showDisableTeacherDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
            <h2 class="text-xl font-bold mb-4">确认{{ statusActionText }}该用户账号？</h2>
            <div class="mb-6 text-gray-700">{{ statusActionDescription }}</div>
            <div class="flex justify-center space-x-4">
              <button @click="showDisableTeacherDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
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
import { getAllUsers, createTeacher, updateUserInfo as updateSchoolUserInfo, updateUserStatus } from '@/lib/api/schoolAdmin'
import { getMe, updatePassword, updateUserInfo as updateAuthUserInfo } from '@/lib/api/auth'
import Button from '@/components/ui/Button.vue'

const school = ref({
  logo: 'https://randomuser.me/api/portraits/lego/2.jpg',
  name: '加载中...',
  code: '',
  contact: '',
  verified: false
})
const partnerCompanies = [
  '字节跳动科技有限公司',
  '阿里巴巴集团',
  '腾讯科技有限公司'
]

const blocks = ref([
  {
    title: '用户管理',
    icon: AcademicCapIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: '用户总数', extra: '12人' }
    ],
    empty: '暂无用户',
    footer: { text: '管理用户', link: '/users' }
  },
  {
    title: '学生管理',
    icon: DocumentTextIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: '学生总数', extra: '156人' }
    ],
    empty: '暂无学生',
    footer: { text: '管理学生', link: '/students' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: '进行中项目', extra: '8个' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/projects' }
  },
  {
    title: '企业合作',
    icon: BuildingOffice2Icon,
    color: 'text-purple-500',
    data: partnerCompanies.map((company, index) => ({ id: index + 1, label: company })),
    empty: '暂无合作企业',
    footer: { text: '管理合作', link: '/partners' }
  },
  {
    title: '系统设置',
    icon: ShieldCheckIcon,
    color: 'text-yellow-500',
    data: [
      { id: 1, label: '学校信息', extra: '已配置' }
    ],
    empty: '需要配置',
    footer: { text: '系统设置', link: '/settings' }
  }
])

// 用户相关
const teachers = ref<any[]>([])
const teacherTotal = ref(0)
const teacherPage = ref(0)
const teacherSize = ref(10)
const teacherLoading = ref(false)
const teacherError = ref('')

async function fetchTeachers() {
  teacherLoading.value = true
  teacherError.value = ''
  try {
    const res = await getAllUsers({ page: teacherPage.value, size: teacherSize.value })
    teachers.value = res.data?.records || []
    teacherTotal.value = res.data?.total || teachers.value.length
  } catch (e: any) {
    teacherError.value = e.message || '获取用户列表失败'
    teachers.value = []
  } finally {
    teacherLoading.value = false
  }
}

const showAddTeacherDialog = ref(false)
const newTeacher = ref({ email: '', nickname: '', password: '', phone: '' })
const addTeacherLoading = ref(false)

async function onAddTeacher() {
  addTeacherLoading.value = true
  try {
    await createTeacher(newTeacher.value)
    showAddTeacherDialog.value = false
    newTeacher.value = { email: '', nickname: '', password: '', phone: '' }
    await fetchTeachers()
    alert('用户账号创建成功')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    addTeacherLoading.value = false
  }
}

const showEditTeacherDialog = ref(false)
const editTeacher = ref<any>({})
const editTeacherLoading = ref(false)
const showDisableTeacherDialog = ref(false)
const statusUpdateId = ref<number | null>(null)
const statusUpdateTarget = ref<'active' | 'inactive' | 'pending_approval' | null>(null)
const statusUpdateLoading = ref(false)

const statusActionText = computed(() => {
  if (statusUpdateTarget.value === 'inactive') return '禁用'
  if (statusUpdateTarget.value === 'active') return '启用'
  return '更新状态'
})

const statusActionDescription = computed(() => {
  if (statusUpdateTarget.value === 'inactive') return '禁用后该用户将无法登录，操作可逆。'
  if (statusUpdateTarget.value === 'active') return '启用后该用户可以正常登录。'
  return '更新用户状态。'
})

function onEditUser(teacher: any) {
  editTeacher.value = { ...teacher }
  showEditTeacherDialog.value = true
}

async function onUpdateTeacher() {
  editTeacherLoading.value = true
  try {
    await updateSchoolUserInfo(editTeacher.value.id, {
      email: editTeacher.value.email,
      nickname: editTeacher.value.nickname,
      phone: editTeacher.value.phone
    })
    showEditTeacherDialog.value = false
    await fetchTeachers()
    alert('用户信息已更新')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    editTeacherLoading.value = false
  }
}

function onUpdateTeacherStatus(teacher: any, status: 'active' | 'inactive' | 'pending_approval') {
  statusUpdateId.value = teacher.id
  statusUpdateTarget.value = status
  showDisableTeacherDialog.value = true
}

async function onConfirmUpdateStatus() {
  if (!statusUpdateId.value || !statusUpdateTarget.value) return
  statusUpdateLoading.value = true
  try {
    await updateUserStatus(statusUpdateId.value, statusUpdateTarget.value)
    showDisableTeacherDialog.value = false
    await fetchTeachers()
    alert(`用户账号已${statusActionText.value}`)
  } catch (e: any) {
    alert(`${statusActionText.value}失败：` + (e.message || '未知错误'))
  } finally {
    statusUpdateLoading.value = false
    statusUpdateId.value = null
    statusUpdateTarget.value = null
  }
}

async function fetchSchoolInfo() {
  try {
    const res = await getMe()
    const userData = res.data
    if (userData) {
      school.value = {
        logo: userData.avatarUrl || 'https://randomuser.me/api/portraits/lego/2.jpg',
        name: userData.organizationName || userData.nickname || '未知学校',
        code: userData.organizationCode || '',
        contact: userData.nickname || userData.email || '',
        verified: userData.verified || false
      }
    }
  } catch (e: any) {
    console.error('获取学校信息失败:', e)
    // 保持默认值
  }
}

onMounted(() => {
  fetchSchoolInfo()
  fetchTeachers()
})

const router = useRouter()
const appStore = useAppStore()
const userInfo = computed(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/lego/2.jpg')
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
const updateProfileLoading = ref(false)

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    // 使用auth API更新用户信息
    await updateAuthUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    showEditProfileDialog.value = false
    await fetchSchoolInfo() // 重新获取学校信息
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

const passwordChange = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const changePasswordLoading = ref(false)

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