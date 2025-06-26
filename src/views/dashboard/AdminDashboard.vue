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
              <input v-model="newSchool.name" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入学校名称" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">学校简介</label>
              <textarea v-model="newSchool.desc" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入简介"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">管理员账号</label>
              <input v-model="newSchool.adminAccount" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入账号" />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Building2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const showAddSchoolDialog = ref(false)
const newSchool = ref({
  name: '',
  desc: '',
  adminAccount: '',
  adminPassword: ''
})
const organizations = [
  { id: 1, name: '清华大学', type: '高校', status: '已审核' },
  { id: 2, name: '字节跳动科技有限公司', type: '企业', status: '已审核' },
  { id: 3, name: '某某服务有限公司', type: '服务企业', status: '待审核' },
]
function onAddSchool() {
  // TODO: 调用API添加学校和分配账号
  alert(`已添加学校：${newSchool.value.name}，管理员账号：${newSchool.value.adminAccount}`)
  showAddSchoolDialog.value = false
  newSchool.value = { name: '', desc: '', adminAccount: '', adminPassword: '' }
}
</script> 