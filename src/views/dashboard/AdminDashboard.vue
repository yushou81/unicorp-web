<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">系统管理平台</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ userInfo.nickname || userInfo.account || '管理员' }}</span>
            <Button @click="onLogout" variant="outline" size="sm">退出登录</Button>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="py-10">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h1 class="text-3xl font-bold mb-2 text-blue-700">平台管理后台</h1>
          <p class="text-gray-600">系统概览与数据统计</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
              <span class="text-2xl font-bold text-blue-700">{{ totalUsers }}</span>
              <span class="text-gray-500 mt-2">用户总数</span>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
              <span class="text-2xl font-bold text-blue-700">56</span>
              <span class="text-gray-500 mt-2">机构数量</span>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
              <span class="text-2xl font-bold text-blue-700">789</span>
              <span class="text-gray-500 mt-2">申报项目</span>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
              <span class="text-2xl font-bold text-blue-700">98%</span>
              <span class="text-gray-500 mt-2">系统活跃度</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <!-- 操作日志卡片 -->
          <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <ClipboardDocumentListIcon class="w-7 h-7 mr-2 text-yellow-500" />
              <span class="font-semibold text-lg">操作日志</span>
            </div>
            <div class="flex-1 text-gray-500 text-sm mb-2">点击下方进入</div>
            <router-link to="/logs" class="text-blue-600 hover:underline text-xs font-medium mt-auto">查看操作日志</router-link>
          </div>
          <!-- 账户管理卡片 -->
          <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <UserGroupIcon class="w-7 h-7 mr-2 text-blue-500" />
              <span class="font-semibold text-lg">账户管理</span>
            </div>
            <div v-if="usersLoading" class="flex-1 text-gray-500 text-sm mb-2">加载中...</div>
            <div v-else-if="usersError" class="flex-1 text-red-500 text-sm mb-2">{{ usersError }}</div>
            <div v-else class="flex-1 mb-2">
              <div v-if="safeUsers.length === 0" class="text-gray-500 text-sm">暂无用户数据</div>
              <div v-else class="space-y-1">
                <div v-for="user in safeUsers.slice(0, 3)" :key="user.id" class="flex justify-between items-center text-gray-700 text-sm">
                  <span>{{ user.nickname || user.account || '未设置昵称' }}</span>
                  <span class="text-xs text-gray-400">{{ getUserRoleText(user.role) }}</span>
                </div>
                <div v-if="safeUsers.length > 3" class="text-xs text-gray-400">...还有 {{ safeUsers.length - 3 }} 个用户</div>
              </div>
            </div>
            <router-link to="/accounts" class="text-blue-600 hover:underline text-xs font-medium mt-auto">管理所有账户</router-link>
          </div>
          <!-- 常见操作卡片 -->
          <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <Cog6ToothIcon class="w-7 h-7 mr-2 text-green-500" />
              <span class="font-semibold text-lg">常见操作</span>
            </div>
            <ul class="flex-1 mb-2">
              <li class="text-gray-700 text-sm mb-1">添加学校</li>
              <li class="text-gray-700 text-sm mb-1">添加企业</li>
              <li class="text-gray-700 text-sm mb-1">重置用户密码</li>
            </ul>
            <router-link to="/admin/actions" class="text-blue-600 hover:underline text-xs font-medium mt-auto">查看更多操作</router-link>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-blue-700">学校与企业列表</h2>
          <Button class="ml-2" @click="showAddSchoolDialog = true">添加学校</Button>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-4 text-blue-700">待审核企业</h2>
          <div v-if="pendingEnterprises.length === 0" class="text-gray-400 text-center py-8">暂无待审核企业</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">企业名称</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">简介</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">网址</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">地址</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="org in pendingEnterprises" :key="org.id">
                  <td class="px-4 py-2">{{ org.organizationName }}</td>
                  <td class="px-4 py-2">{{ org.description || '-' }}</td>
                  <td class="px-4 py-2">{{ org.website || '-' }}</td>
                  <td class="px-4 py-2">{{ org.address || '-' }}</td>
                  <td class="px-4 py-2">
                    <Button variant="outline" size="sm" :loading="approveLoadingId === org.id" @click="onApproveEnterprise(org.id)">审核</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-4 text-blue-700">学校列表</h2>
          <div v-if="publicSchoolsLoading" class="text-center text-gray-400 py-8">加载中...</div>
          <div v-else-if="publicSchoolsError" class="text-center text-red-500 py-8">{{ publicSchoolsError }}</div>
          <div v-else>
            <div v-if="publicSchools.length === 0" class="text-gray-400 text-center py-8">暂无已批准学校</div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th v-for="key in schoolTableKeys" :key="key" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ schoolTableHeaders[key] }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="school in publicSchools" :key="school.id">
                    <td v-for="key in schoolTableKeys" :key="key" class="px-4 py-2">
                      <template v-if="key === 'website'">
                        <a v-if="school[key]" :href="school[key]" target="_blank" class="text-blue-600 hover:underline">{{ school[key] }}</a>
                        <span v-else>-</span>
                      </template>
                      <template v-else>
                        {{ school[key] ?? '-' }}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-4 text-blue-700">企业列表</h2>
          <div v-if="publicEnterprisesLoading" class="text-center text-gray-400 py-8">加载中...</div>
          <div v-else-if="publicEnterprisesError" class="text-center text-red-500 py-8">{{ publicEnterprisesError }}</div>
          <div v-else>
            <div v-if="publicEnterprises.length === 0" class="text-gray-400 text-center py-8">暂无已批准企业</div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th v-for="key in enterpriseTableKeys" :key="key" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ enterpriseTableHeaders[key] }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="enterprise in publicEnterprises" :key="enterprise.id">
                    <td v-for="key in enterpriseTableKeys" :key="key" class="px-4 py-2">
                      <template v-if="key === 'website'">
                        <a v-if="enterprise[key]" :href="enterprise[key]" target="_blank" class="text-blue-600 hover:underline">{{ enterprise[key] }}</a>
                        <span v-else>-</span>
                      </template>
                      <template v-else>
                        {{ enterprise[key] ?? '-' }}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-blue-700">用户列表管理</h2>
            <div class="flex items-center space-x-4">
              <select 
                v-model="selectedRole" 
                @change="onRoleChange"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <Button @click="fetchUsers" variant="outline" size="sm" :loading="usersLoading">刷新</Button>
            </div>
          </div>
          
          <div v-if="usersLoading" class="text-center text-gray-400 py-8">加载中...</div>
          <div v-else-if="usersError" class="text-center text-red-500 py-8">{{ usersError }}</div>
          <div v-else>
            <div v-if="safeUsers.length === 0" class="text-gray-400 text-center py-8">暂无用户数据</div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">用户ID</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">账号</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="user in safeUsers" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ user.id }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ user.account }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ user.nickname || '-' }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ user.email || '-' }}</td>
                    <td class="px-4 py-2 text-sm">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ getUserRoleText(user.role) }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-sm">
                      <span
                        :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                      >
                        {{ user.status === 'active' ? '启用' : '禁用' }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-500">{{ user.createdAt ? new Date(user.createdAt).toLocaleString() : '-' }}</td>
                    <td class="px-4 py-2 text-sm space-x-2">
                      <Button size="sm" @click="onShowStatusDialog(user)">
                        {{ user.status === 'active' ? '禁用' : '启用' }}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- 分页控件 -->
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">每页显示:</span>
                  <select 
                    :value="pageSize" 
                    @change="onPageSizeChange(Number($event.target.value))"
                    class="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span class="text-sm text-gray-700">条</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">
                    第 {{ currentPage }} 页，共 {{ totalPages }} 页，总计 {{ totalUsers }} 条记录
                  </span>
                  <div class="flex space-x-1">
                    <Button 
                      @click="onPageChange(currentPage - 1)" 
                      :disabled="!hasPrevPage"
                      variant="outline" 
                      size="sm"
                    >
                      上一页
                    </Button>
                    <Button 
                      @click="onPageChange(currentPage + 1)" 
                      :disabled="!hasNextPage"
                      variant="outline" 
                      size="sm"
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showAddSchoolDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border-t-4 border-blue-600">
            <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center"><Building2 class="w-6 h-6 mr-2" />添加新学校</h2>
            <form @submit.prevent="onAddSchool">
              <div class="mb-4">
                <label class="block text-gray-700 mb-1 font-medium">学校名称</label>
                <input v-model="newSchool.organizationName" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入学校名称" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 mb-1 font-medium">学校简介</label>
                <textarea v-model="newSchool.description" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入简介"></textarea>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 mb-1 font-medium">地址</label>
                <input v-model="newSchool.address" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入地址" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 mb-1 font-medium">网址</label>
                <input v-model="newSchool.website" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入网址" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 mb-1 font-medium">管理员邮箱</label>
                <input v-model="newSchool.adminEmail" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员邮箱" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 mb-1 font-medium">管理员昵称</label>
                <input v-model="newSchool.adminNickname" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员昵称（可选）" />
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 mb-1 font-medium">初始密码</label>
                <input v-model="newSchool.adminPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入初始密码" />
              </div>
              <div class="flex justify-end space-x-2 mt-4">
                <button type="button" @click="showAddSchoolDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">取消</button>
                <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">添加</button>
              </div>
            </form>
          </div>
        </div>
        <!-- 启用/禁用确认对话框 -->
        <div v-if="showStatusDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm border-t-4 border-blue-600">
            <h2 class="text-xl font-bold mb-4 text-blue-700">{{ statusTargetAction === 'inactive' ? '禁用' : '启用' }}用户</h2>
            <div class="mb-6 text-gray-700">确定要{{ statusTargetAction === 'inactive' ? '禁用' : '启用' }}该用户账号（{{ statusTargetUser?.nickname || statusTargetUser?.account }}）吗？</div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showStatusDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
              <button type="button" @click="onConfirmStatusChange" :disabled="statusLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ statusLoading ? '处理中...' : '确认' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Building2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { ClipboardDocumentListIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { apiRequest } from '@/lib/api/apiClient'
import { createSchool, getPendingOrganizations, approveEnterprise, getPendingEnterprises, getUsers, updateUserStatus } from '@/lib/api/admin'
import { setToken } from '@/lib/api/apiClient'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getAllSchools, getAllEnterprises } from '@/lib/api/organization'

const showAddSchoolDialog = ref(false)
const newSchool = ref({
  organizationName: '',
  description: '',
  address: '',
  website: '',
  adminEmail: '',
  adminNickname: '',
  adminPassword: ''
})
const organizations = ref([])
const publicSchools = ref<any[]>([])
const publicSchoolsLoading = ref(true)
const publicSchoolsError = ref('')
const schoolTableKeys = ref<string[]>([])
const schoolTableHeaders = ref<Record<string, string>>({})
const approveLoadingId = ref<number | null>(null)
const publicEnterprises = ref<any[]>([])
const publicEnterprisesLoading = ref(true)
const publicEnterprisesError = ref('')
const enterpriseTableKeys = ref<string[]>([])
const enterpriseTableHeaders = ref<Record<string, string>>({})

// 用户列表相关状态
const users = ref<any[]>([])
const usersLoading = ref(false)
const usersError = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRole = ref('')
const totalUsers = ref(0)

// 启用/禁用相关状态
const showStatusDialog = ref(false)
const statusTargetUser = ref<any>(null)
const statusTargetAction = ref<'active' | 'inactive' | null>(null)
const statusLoading = ref(false)

const router = useRouter()
const appStore = useAppStore()

// 获取用户列表
async function fetchUsers() {
  usersLoading.value = true
  usersError.value = ''
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    if (selectedRole.value) {
      params.role = selectedRole.value
    }
    
    console.log('获取用户列表参数:', params)
    const res = await getUsers(params)
    console.log('用户列表API响应:', res)
    console.log('响应数据类型:', typeof res.data)
    console.log('响应数据是否为数组:', Array.isArray(res.data))
    console.log('响应数据结构:', JSON.stringify(res.data, null, 2))
    
    // 确保 users 始终是数组
    if (res.data && Array.isArray(res.data)) {
      users.value = res.data
      totalUsers.value = res.data.length
    } else if (res.data && res.data.content && Array.isArray(res.data.content)) {
      users.value = res.data.content
      totalUsers.value = res.data.totalElements || res.data.total || res.data.content.length
    } else if (res.data && Array.isArray(res.data.records)) {
      users.value = res.data.records
      totalUsers.value = res.data.total || res.data.records.length
    } else {
      console.warn('未识别的响应数据结构，设置为空数组')
      users.value = []
      totalUsers.value = 0
    }
    
    console.log('处理后的用户数据:', users.value)
    console.log('用户数据是否为数组:', Array.isArray(users.value))
  } catch (e: any) {
    console.error('获取用户列表失败:', e)
    usersError.value = e.message || '获取用户列表失败'
    users.value = []
    totalUsers.value = 0
  } finally {
    usersLoading.value = false
  }
}

// 页面加载时自动设置 token
const token = localStorage.getItem('token')
if (token) setToken(token)

onMounted(async () => {
  try {
    const res = await getPendingOrganizations()
    organizations.value = res.data || []
  } catch (e) {
    organizations.value = []
  }
  
  // 获取用户列表
  await fetchUsers()
  
  // 获取公开学校列表
  publicSchoolsLoading.value = true
  publicSchoolsError.value = ''
  try {
    const res = await getAllSchools('detailed')
    publicSchools.value = res.data || []
    // 自动提取所有字段作为表头，过滤掉id字段
    if (publicSchools.value.length > 0) {
      const allKeys = Object.keys(publicSchools.value[0])
      schoolTableKeys.value = allKeys.filter(key => key !== 'id')
      // 设置中文表头映射
      schoolTableHeaders.value = {
        organizationName: '学校名称',
        description: '简介',
        website: '网址',
        address: '地址',
        adminEmail: '管理员邮箱',
        adminNickname: '管理员昵称',
        status: '状态',
        type: '类型',
        createdAt: '创建时间',
        updatedAt: '更新时间'
      }
    }
  } catch (e: any) {
    publicSchoolsError.value = e.message || '获取学校列表失败'
  } finally {
    publicSchoolsLoading.value = false
  }
  // 获取公开企业列表
  publicEnterprisesLoading.value = true
  publicEnterprisesError.value = ''
  try {
    const res = await getAllEnterprises('detailed')
    publicEnterprises.value = res.data || []
    // 自动提取所有字段作为表头，过滤掉id字段
    if (publicEnterprises.value.length > 0) {
      const allKeys = Object.keys(publicEnterprises.value[0])
      enterpriseTableKeys.value = allKeys.filter(key => key !== 'id')
      // 设置中文表头映射
      enterpriseTableHeaders.value = {
        organizationName: '企业名称',
        description: '简介',
        website: '网址',
        address: '地址',
        industry: '行业',
        companySize: '企业规模',
        adminEmail: '管理员邮箱',
        adminNickname: '管理员昵称',
        status: '状态',
        type: '类型',
        createdAt: '创建时间',
        updatedAt: '更新时间'
      }
    }
  } catch (e: any) {
    publicEnterprisesError.value = e.message || '获取企业列表失败'
  } finally {
    publicEnterprisesLoading.value = false
  }
})

const pendingEnterprises = computed(() =>
  organizations.value.filter(org => org.type === 'Enterprise')
)

async function onAddSchool() {
  // 简单校验
  if (!newSchool.value.organizationName || !newSchool.value.adminEmail || !newSchool.value.adminPassword) {
    alert('学校名称、管理员邮箱和初始密码为必填项！')
    return
  }
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('请先登录管理员账号！')
      return
    }
    await createSchool(newSchool.value)
    alert(`已添加学校：${newSchool.value.organizationName}`)
    showAddSchoolDialog.value = false
    newSchool.value = { organizationName: '', description: '', address: '', website: '', adminEmail: '', adminNickname: '', adminPassword: '' }
  } catch (e: any) {
    alert('添加失败：' + (e.message || '未知错误'))
  }
}

function onLogout() {
  appStore.logout()
  router.push('/login')
}

async function onApproveEnterprise(id: number) {
  if (approveLoadingId.value) return
  approveLoadingId.value = id
  try {
    await approveEnterprise(id)
    // 审核成功后刷新待审核企业列表
    const res = await getPendingEnterprises()
    organizations.value = res.data || []
  } catch (e: any) {
    alert(e.message || '审核失败')
  } finally {
    approveLoadingId.value = null
  }
}

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

// 角色选项
const roleOptions = [
  { value: '', label: '全部角色' },
  { value: 'STUDENT', label: '学生' },
  { value: 'TEACHER', label: '教师' },
  { value: 'SCH_ADMIN', label: '学校管理员' },
  { value: 'ENT_ADMIN', label: '企业管理员' },
  { value: 'EN_TEACHER', label: '企业导师' }
]

// 用户角色映射
const getUserRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    'STUDENT': '学生',
    'TEACHER': '教师',
    'SCH_ADMIN': '学校管理员',
    'ENT_ADMIN': '企业管理员',
    'EN_ADMIN': '企业管理员',
    'EN_TEACHER': '企业导师'
  }
  return roleMap[role] || role
}

// 分页计算
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))
const hasNextPage = computed(() => currentPage.value < totalPages.value)
const hasPrevPage = computed(() => currentPage.value > 1)

// 安全的用户数组
const safeUsers = computed(() => {
  return Array.isArray(users.value) ? users.value : []
})

// 处理角色筛选
function onRoleChange() {
  currentPage.value = 1
  fetchUsers()
}

// 处理分页
function onPageChange(page: number) {
  currentPage.value = page
  fetchUsers()
}

// 处理页面大小变化
function onPageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

function onShowStatusDialog(user: any) {
  statusTargetUser.value = user
  statusTargetAction.value = user.status === 'active' ? 'inactive' : 'active'
  showStatusDialog.value = true
}

async function onConfirmStatusChange() {
  if (!statusTargetUser.value || !statusTargetAction.value) return
  statusLoading.value = true
  try {
    await updateUserStatus(statusTargetUser.value.id, statusTargetAction.value)
    showStatusDialog.value = false
    await fetchUsers()
  } catch (e: any) {
    alert('操作失败：' + (e.message || '未知错误'))
  } finally {
    statusLoading.value = false
    statusTargetUser.value = null
    statusTargetAction.value = null
  }
}
</script> 