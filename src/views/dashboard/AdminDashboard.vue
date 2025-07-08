<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <UserProfileInfo
        :avatar="userAvatar"
        :name="userInfo.nickname || userInfo.account || '管理员'"
        :role="roleText"
        organization="平台"
        :phone="userInfo.phone"
        :email="userInfo.email"
        :editable="false"
        :verified="false"
      />
      <div class="text-gray-400 text-sm mt-2 ml-2">上次登录：{{ userInfo.lastLoginTime ? new Date(userInfo.lastLoginTime).toLocaleString() : '-' }}</div>
      <!-- Tab栏 -->
      <DashboardTabs :tabs="tabList" :activeTab="activeTab" @change="val => activeTab = val" />
      <div class="mt-8">
        <!-- 待审核企业 -->
        <div v-if="activeTab === 'pending'" class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-4 text-blue-700">待审核企业</h2>
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
        <!-- 企业列表 -->
        <div v-if="activeTab === 'enterprise'" class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-4 text-blue-700">企业列表</h2>
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
        <!-- 学校列表 -->
        <div v-if="activeTab === 'school'" class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-4 text-blue-700">学校列表</h2>
          <Button @click="showAddSchoolDialog = true" class="mb-4 bg-blue-600 text-white">添加学校</Button>
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
        <!-- 账号管理 -->
        <div v-if="activeTab === 'user'" class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-4 text-blue-700">账号管理</h2>
          <div class="flex justify-between items-center mb-4">
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
              <!-- 分页控件 ... 保持原有分页逻辑 ... -->
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
          <!-- 启用/禁用确认对话框 ... 保持原有逻辑 ... -->
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
        <!-- 岗位分类管理 -->
        <div v-if="activeTab === 'jobCategory'" class="bg-white rounded-xl shadow-lg p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-blue-700">岗位分类管理</h2>
          </div>
          <!-- 操作栏 -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-4">
              <input 
                v-model="jobCategorySearch" 
                placeholder="搜索分类名称..." 
                class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @input="onJobCategorySearch"
              />
              <Button @click="fetchJobCategoriesWithChildren" variant="outline" size="sm" :loading="jobCategoriesLoading" class="border-blue-600 text-blue-600">刷新</Button>
            </div>
            <Button @click="showAddJobCategoryDialog = true" class="bg-blue-600 hover:bg-blue-700">
              新增分类
            </Button>
          </div>
          <!-- 岗位分类列表 -->
          <div v-if="jobCategoriesLoading" class="text-center text-gray-400 py-8">加载中...</div>
          <div v-else-if="jobCategoriesError" class="text-center text-red-500 py-8">{{ jobCategoriesError }}</div>
          <div v-else>
            <div v-if="jobCategories.length === 0" class="text-gray-400 text-center py-8">暂无岗位分类</div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类名称</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">排序</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">子分类</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <CategoryRow
                    v-for="category in filteredJobCategories"
                    :key="category.id"
                    :category="category"
                    :level="0"
                    :onEdit="onEditJobCategory"
                    :onDelete="onDeleteJobCategory"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- 审计日志管理 -->
        <AuditLogManager v-if="activeTab === 'audit'" />
        <!-- 新增/编辑岗位分类弹窗、删除弹窗、添加学校弹窗等保留原有弹窗逻辑 -->
        <div v-if="showAddJobCategoryDialog || showEditJobCategoryDialog">
          <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-blue-700">{{ showEditJobCategoryDialog ? '编辑' : '新增' }}岗位分类</h3>
              <button @click="closeJobCategoryForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form @submit.prevent="onSubmitJobCategory" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类名称 *</label>
                <input 
                  v-model="jobCategoryForm.name" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入分类名称"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">父分类</label>
                <select 
                  v-model="jobCategoryForm.parentId" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option :value="null">顶级分类</option>
                  <option v-for="category in availableParentCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea 
                  v-model="jobCategoryForm.description" 
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入分类描述"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input 
                  v-model.number="jobCategoryForm.sortOrder" 
                  type="number" 
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="数字越小排序越靠前"
                />
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" @click="closeJobCategoryForm">取消</Button>
                <Button type="submit" :loading="jobCategorySubmitting" class="bg-blue-600 hover:bg-blue-700">
                  {{ jobCategorySubmitting ? '提交中...' : (showEditJobCategoryDialog ? '更新' : '创建') }}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div v-if="showDeleteJobCategoryDialog">
          <!-- ... existing code ... -->
        </div>
        <div v-if="showAddSchoolDialog">
          <!-- ... existing code ... -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineComponent, getCurrentInstance, h } from 'vue'
import { Building2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { ClipboardDocumentListIcon, UserGroupIcon, Cog6ToothIcon, TagIcon } from '@heroicons/vue/24/outline'
import { apiRequest } from '@/lib/api/apiClient'
import { createSchool, getPendingOrganizations, approveEnterprise, getPendingEnterprises, getUsers, updateUserStatus, getJobCategories, createJobCategory, updateJobCategory, deleteJobCategory, getRootJobCategories, getJobCategoryChildren, getHierarchicalJobCategories } from '@/lib/api/admin'
import { setToken } from '@/lib/api/apiClient'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getAllSchools, getAllEnterprises } from '@/lib/api/organization'
import Navbar from '@/components/layout/Navbar.vue'
import UserProfileInfo from '@/components/dashboard/UserProfileInfo.vue'
import DashboardTabs from '@/components/dashboard/DashboardTabs.vue'
import AuditLogManager from '@/components/dashboard/AuditLogManager.vue'

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

// 弹窗显示状态
const showPendingDialog = ref(false)
const showEnterpriseDialog = ref(false)
const showSchoolDialog = ref(false)
const showUserDialog = ref(false)
const showJobCategoryDialog = ref(false)
const showAddJobCategoryDialog = ref(false)
const showEditJobCategoryDialog = ref(false)
const showDeleteJobCategoryDialog = ref(false)

const router = useRouter()
const appStore = useAppStore()

// 在这里定义 CategoryRow 递归组件
const CategoryRow = defineComponent({
  name: 'CategoryRow',
  props: {
    category: { type: Object, required: true },
    level: { type: Number, default: 0 },
    onEdit: { type: Function, required: false },
    onDelete: { type: Function, required: false }
  },
  setup(props) {
    return () => [
      h('tr', { class: props.level === 0 ? '' : 'bg-gray-50' }, [
        h('td', { style: { paddingLeft: `${props.level * 32}px` } }, [
          `${'└ '.repeat(props.level)}${props.category.name}`
        ]),
        h('td', props.category.description || '-'),
        h('td', props.category.sortOrder || 0),
        h('td', Array.isArray(props.category.children) && props.category.children.length > 0
          ? h('span', { class: 'text-blue-600' }, `${props.category.children.length} 个子分类`)
          : h('span', { class: 'text-gray-400' }, '无')
        ),
        h('td', props.category.createdAt ? new Date(props.category.createdAt).toLocaleString() : '-'),
        h('td', [
          h(Button, { size: 'sm', variant: 'outline', onClick: () => props.onEdit && props.onEdit(props.category) }, '编辑'),
          h(Button, { size: 'sm', variant: 'outline', class: 'text-red-600 hover:text-red-700', onClick: () => props.onDelete && props.onDelete(props.category) }, '删除')
        ])
      ]),
      ...(Array.isArray(props.category.children)
        ? props.category.children.map(child =>
            h(CategoryRow, {
              category: child,
              level: props.level + 1,
              onEdit: props.onEdit,
              onDelete: props.onDelete
            })
          )
        : [])
    ]
  }
})

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

// 检查用户权限
const checkAdminPermissions = () => {
  const userRole = userInfo.value.role
  const allowedRoles = ['SYSADMIN', 'admin']
  
  if (!allowedRoles.includes(userRole)) {
    console.warn(`用户角色 ${userRole} 无权访问管理员面板`)
    return false
  }
  
  return true
}

onMounted(async () => {
  // 检查权限
  if (!checkAdminPermissions()) {
    alert('您没有权限访问管理员面板，即将跳转到首页')
    router.push('/')
    return
  }

  try {
    const res = await getPendingOrganizations()
    organizations.value = res.data || []
  } catch (e) {
    console.error('获取待审核组织失败:', e)
    organizations.value = []
  }
  
  // 获取用户列表
  await fetchUsers()
  
  // 获取岗位分类列表（包括子分类，用于统计显示）
  await fetchJobCategoriesWithChildren()
  
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
    console.error('获取学校列表失败:', e)
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
    console.error('获取企业列表失败:', e)
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

// 计算岗位分类总数（包括所有层级）
const totalJobCategories = computed(() => {
  let total = 0
  
  const countCategories = (categories: any[]) => {
    categories.forEach(category => {
      total++
      if (category.children && Array.isArray(category.children)) {
        countCategories(category.children)
      }
    })
  }
  
  countCategories(jobCategories.value)
  return total
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

// 岗位分类相关状态
const jobCategories = ref<any[]>([])
const jobCategoriesLoading = ref(false)
const jobCategoriesError = ref('')
const jobCategorySearch = ref('')
const expandedCategories = ref<number[]>([])
const expandedChildCategories = ref<string[]>([])
const jobCategoryForm = ref({
  name: '',
  description: '',
  sortOrder: 0,
  parentId: null as number | null
})
const jobCategorySubmitting = ref(false)
const deleteTargetCategory = ref<any>(null)
const deleteJobCategoryLoading = ref(false)

// 过滤后的分类数据（用于搜索）
const filteredJobCategories = computed(() => {
  if (!jobCategorySearch.value.trim()) {
    return jobCategories.value
  }
  
  const searchTerm = jobCategorySearch.value.toLowerCase()
  
  // 递归搜索分类及其子分类
  const searchInCategory = (category: any): any => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm) ||
                         (category.description && category.description.toLowerCase().includes(searchTerm))
    
    // 如果有子分类，递归搜索子分类
    if (Array.isArray(category.children) && category.children.length > 0) {
      const matchingChildren = category.children
        .map(searchInCategory)
        .filter(child => child !== null)
      
      // 如果当前分类匹配或者有匹配的子分类，返回该分类
      if (matchesSearch || matchingChildren.length > 0) {
        return {
          ...category,
          children: matchingChildren
        }
      }
    } else {
      // 没有子分类，只检查当前分类是否匹配
      return matchesSearch ? category : null
    }
    
    return null
  }
  
  return jobCategories.value
    .map(searchInCategory)
    .filter(category => category !== null)
})

// 计算可用的父分类（排除自己和子孙）
const availableParentCategories = computed(() => {
  // 编辑时排除自己和子孙，新增时全部可选
  const excludeIds = new Set<number>()
  if (showEditJobCategoryDialog.value && deleteTargetCategory.value) {
    excludeIds.add(deleteTargetCategory.value.id)
    const collectChildIds = (category: any) => {
      if (category.children) {
        category.children.forEach((child: any) => {
          excludeIds.add(child.id)
          collectChildIds(child)
        })
      }
    }
    collectChildIds(deleteTargetCategory.value)
  }

  // 递归收集所有分类
  const result: any[] = []
  const collectAll = (categories: any[]) => {
    categories.forEach(cat => {
      if (!excludeIds.has(cat.id)) {
        result.push(cat)
        if (cat.children && cat.children.length > 0) {
          collectAll(cat.children)
        }
      }
    })
  }
  collectAll(jobCategories.value)
  return result
})

// 获取所有分类及其子分类信息（推荐用 root 接口，children 字段递归）
async function fetchJobCategoriesWithChildren() {
  jobCategoriesLoading.value = true
  jobCategoriesError.value = ''
  try {
    // 优先用树形结构接口
    const res = await getHierarchicalJobCategories()
    if (res.data && Array.isArray(res.data)) {
      // 递归修正 children 为 null 的情况
      function fixNullChildren(node) {
        if (node.children === null) {
          node.children = []
        } else if (Array.isArray(node.children)) {
          node.children.forEach(fixNullChildren)
        }
      }
      res.data.forEach(fixNullChildren)
      jobCategories.value = res.data
      // 自动展开所有层级
      expandedCategories.value = []
      expandedChildCategories.value = []
      function collectExpandIds(categories, parentId = null) {
        for (const cat of categories) {
          if (cat.children && cat.children.length > 0) {
            if (parentId === null) {
              expandedCategories.value.push(cat.id)
            } else {
              expandedChildCategories.value.push(`${parentId}-${cat.id}`)
            }
            collectExpandIds(cat.children, cat.id)
          }
        }
      }
      collectExpandIds(jobCategories.value)
      // 调试输出
      console.log('[fetchJobCategoriesWithChildren] jobCategories.value:', JSON.parse(JSON.stringify(jobCategories.value)))
    } else {
      jobCategories.value = []
    }
  } catch (e) {
    jobCategoriesError.value = e.message || '获取岗位分类列表失败'
    jobCategories.value = []
  } finally {
    jobCategoriesLoading.value = false
  }
}

function toggleCategory(categoryId: number) {
  console.log('toggleCategory 被调用，categoryId:', categoryId)
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    console.log('收起分类:', categoryId)
    expandedCategories.value.splice(index, 1)
  } else {
    console.log('展开分类:', categoryId)
    expandedCategories.value.push(categoryId)
    // 加载子分类
    loadCategoryChildren(categoryId)
  }
}

function toggleChildCategory(parentId: number, childId: number) {
  const key = `${parentId}-${childId}`
  const index = expandedChildCategories.value.indexOf(key)
  if (index > -1) {
    expandedChildCategories.value.splice(index, 1)
  } else {
    expandedChildCategories.value.push(key)
    // 加载孙分类
    loadChildCategoryChildren(parentId, childId)
  }
}

async function loadCategoryChildren(categoryId: number) {
  const category = jobCategories.value.find(c => c.id === categoryId)
  if (!category) return
  // 如果已经有子分类数据，不再重复加载
  if (category.children && Array.isArray(category.children)) return
  // 设置加载状态
  category.childrenLoading = true
  category.childrenError = null
  try {
    const res = await getJobCategoryChildren(categoryId)
    console.log('获取子分类API响应:', res)
    if (res.data && Array.isArray(res.data)) {
      category.children = res.data
        .filter(item => item && typeof item === 'object' && item.id)
        .map(child => ({
          ...child,
          children: child.children || null,
          hasChildren: child.hasChildren || false, // 确保hasChildren字段存在
          childrenLoading: false,
          childrenError: null
        }))
      console.log('处理后的子分类数据:', category.children)
    } else {
      category.children = []
    }
  } catch (e: any) {
    category.childrenError = e.message || '加载子分类失败'
    category.children = []
  } finally {
    category.childrenLoading = false
  }
}

async function loadChildCategoryChildren(parentId: number, childId: number) {
  const parentCategory = jobCategories.value.find(c => c.id === parentId)
  if (!parentCategory || !parentCategory.children) return
  const childCategory = parentCategory.children.find(c => c.id === childId)
  if (!childCategory) return
  // 如果已经有子分类数据，不再重复加载
  if (childCategory.children && Array.isArray(childCategory.children)) return
  // 设置加载状态
  childCategory.childrenLoading = true
  childCategory.childrenError = null
  try {
    const res = await getJobCategoryChildren(childId)
    console.log('获取孙分类API响应:', res)
    if (res.data && Array.isArray(res.data)) {
      childCategory.children = res.data
        .filter(item => item && typeof item === 'object' && item.id)
        .map(grandChild => ({
          ...grandChild,
          children: grandChild.children || null,
          hasChildren: grandChild.hasChildren || false, // 确保hasChildren字段存在
          childrenLoading: false,
          childrenError: null
        }))
      console.log('处理后的孙分类数据:', childCategory.children)
    } else {
      childCategory.children = []
    }
  } catch (e: any) {
    childCategory.childrenError = e.message || '加载孙分类失败'
    childCategory.children = []
  } finally {
    childCategory.childrenLoading = false
  }
}

function onJobCategorySearch() {
  // 搜索功能现在通过computed属性实现，无需额外处理
  console.log('搜索关键词:', jobCategorySearch.value)
}

function onEditJobCategory(category: any) {
  jobCategoryForm.value = {
    name: category.name,
    description: category.description || '',
    sortOrder: category.sortOrder || 0,
    parentId: category.parentId || null
  }
  deleteTargetCategory.value = category
  showEditJobCategoryDialog.value = true
}

function onDeleteJobCategory(category: any) {
  deleteTargetCategory.value = category
  showDeleteJobCategoryDialog.value = true
}

function closeJobCategoryForm() {
  showAddJobCategoryDialog.value = false
  showEditJobCategoryDialog.value = false
  jobCategoryForm.value = {
    name: '',
    description: '',
    sortOrder: 0,
    parentId: null
  }
  deleteTargetCategory.value = null
}

async function onSubmitJobCategory() {
  if (!jobCategoryForm.value.name.trim()) {
    alert('请输入分类名称')
    return
  }
  
  jobCategorySubmitting.value = true
  try {
    const formData = {
      name: jobCategoryForm.value.name,
      description: jobCategoryForm.value.description,
      sortOrder: jobCategoryForm.value.sortOrder
    }
    
    // 只有当选择了父分类时才添加parentId
    if (jobCategoryForm.value.parentId !== null) {
      formData.parentId = jobCategoryForm.value.parentId
    }
    
    if (showEditJobCategoryDialog.value) {
      // 编辑模式
      await updateJobCategory(deleteTargetCategory.value.id, formData)
      alert('岗位分类更新成功')
    } else {
      // 新增模式
      await createJobCategory(formData)
      alert('岗位分类创建成功')
    }
    
    closeJobCategoryForm()
    fetchJobCategoriesWithChildren()
  } catch (e: any) {
    alert(showEditJobCategoryDialog.value ? '更新失败：' + e.message : '创建失败：' + e.message)
  } finally {
    jobCategorySubmitting.value = false
  }
}

async function onConfirmDeleteJobCategory() {
  if (!deleteTargetCategory.value) return
  
  deleteJobCategoryLoading.value = true
  try {
    await deleteJobCategory(deleteTargetCategory.value.id)
    alert('岗位分类删除成功')
    showDeleteJobCategoryDialog.value = false
    deleteTargetCategory.value = null
    fetchJobCategoriesWithChildren()
  } catch (e: any) {
    alert('删除失败：' + e.message)
  } finally {
    deleteJobCategoryLoading.value = false
  }
}

function onJobCategoryCardClick() {
  showJobCategoryDialog.value = true
  // 页面加载时已经获取了完整的分类数据，这里不需要重复获取
  // fetchJobCategoriesWithChildren()
}

const tabList = [
  { label: '待审核企业', value: 'pending' },
  { label: '企业列表', value: 'enterprise' },
  { label: '学校列表', value: 'school' },
  { label: '账号管理', value: 'user' },
  { label: '岗位分类管理', value: 'jobCategory' },
  { label: '审计日志', value: 'audit' }
]
const activeTab = ref('pending')
</script> 