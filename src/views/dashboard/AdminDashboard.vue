<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h1 class="text-3xl font-bold mb-2 text-blue-700">平台管理后台</h1>
        <p class="text-gray-600">系统概览与数据统计</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
            <span class="text-2xl font-bold text-blue-700">1,234</span>
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
          <ul class="flex-1 mb-2">
            <li class="flex justify-between items-center text-gray-700 text-sm mb-1"><span>admin</span><span class="text-xs text-gray-400">平台管理员</span></li>
            <li class="flex justify-between items-center text-gray-700 text-sm mb-1"><span>school_admin</span><span class="text-xs text-gray-400">学校管理员</span></li>
            <li class="flex justify-between items-center text-gray-700 text-sm mb-1"><span>company_admin</span><span class="text-xs text-gray-400">企业管理员</span></li>
          </ul>
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
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="org in organizations" :key="org.id" class="hover:bg-blue-50 transition">
                <td class="px-4 py-2 flex items-center space-x-2">
                  <span class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-2">
                    <Building2 class="w-5 h-5 text-blue-600" />
                  </span>
                  <span class="font-medium text-gray-900">{{ org.name }}</span>
                </td>
                <td class="px-4 py-2 text-gray-700">{{ org.type }}</td>
                <td class="px-4 py-2">
                  <span :class="org.status === '已审核' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="px-2 py-0.5 rounded text-xs font-semibold">{{ org.status }}</span>
                </td>
                <td class="px-4 py-2">
                  <Button variant="outline" size="sm">编辑</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="showAddSchoolDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border-t-4 border-blue-600">
          <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center"><Building2 class="w-6 h-6 mr-2" />添加新学校</h2>
          <form @submit.prevent="onAddSchool">
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">学校名称</label>
              <input v-model="newSchool.organization_name" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入学校名称" />
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
              <input v-model="newSchool.admin_email" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员邮箱" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">管理员昵称</label>
              <input v-model="newSchool.admin_nickname" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员昵称（可选）" />
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 mb-1 font-medium">初始密码</label>
              <input v-model="newSchool.admin_password" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入初始密码" />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showAddSchoolDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">取消</button>
              <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Building2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { ClipboardDocumentListIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { apiRequest } from '@/lib/api/apiClient'

const showAddSchoolDialog = ref(false)
const newSchool = ref({
  organization_name: '',
  description: '',
  address: '',
  website: '',
  admin_email: '',
  admin_nickname: '',
  admin_password: ''
})
const organizations = [
  { id: 1, name: '清华大学', type: '高校', status: '已审核' },
  { id: 2, name: '字节跳动科技有限公司', type: '企业', status: '已审核' },
  { id: 3, name: '某某服务有限公司', type: '服务企业', status: '待审核' },
]

async function onAddSchool() {
  // 简单校验
  if (!newSchool.value.organization_name || !newSchool.value.admin_email || !newSchool.value.admin_password) {
    alert('学校名称、管理员邮箱和初始密码为必填项！')
    return
  }
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('请先登录管理员账号！')
      return
    }
    await apiRequest('/admin/organizations/schools', {
      method: 'POST',
      body: JSON.stringify(newSchool.value),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    alert(`已添加学校：${newSchool.value.organization_name}`)
    showAddSchoolDialog.value = false
    newSchool.value = { organization_name: '', description: '', address: '', website: '', admin_email: '', admin_nickname: '', admin_password: '' }
  } catch (e: any) {
    alert('添加失败：' + (e.message || '未知错误'))
  }
}
</script> 