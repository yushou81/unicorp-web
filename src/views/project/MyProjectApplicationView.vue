<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="mb-6">
        <button
          @click="router.back()"
          class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
      </div>
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">我的项目申请</h2>
      <!-- 筛选 Tabs -->
      <div class="flex justify-center mb-8 gap-4">
        <button
          v-for="item in statusOptions"
          :key="item.value"
          @click="currentStatus = item.value"
          :class="[
            'px-6 py-2 rounded-full font-semibold shadow transition',
            currentStatus === item.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-200'
          ]"
        >
          {{ item.label }}
        </button>
      </div>
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div v-if="loading" class="text-gray-500 text-center py-10">加载中...</div>
        <div v-else>
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2">项目名称</th>
                <th class="px-4 py-2">组织名称</th>
                <th class="px-4 py-2">简介</th>
                <th class="px-4 py-2">状态</th>
                <th class="px-4 py-2">操作</th>
                <th class="px-4 py-2">申请时间</th>
                <th class="px-4 py-2">同意时间</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredApplications"
                :key="item.applicationId"
                class="border-b hover:bg-blue-50 transition"
              >
                <td class="px-4 py-2 text-center font-medium text-blue-700">{{ item.projectName }}</td>
                <td class="px-4 py-2 text-center text-blue-600">{{ item.organizationName }}</td>
                <td class="px-4 py-2 text-center">
                  <button class="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs shadow hover:bg-blue-200 transition" @click="showDesc(item.projectDescription)">查看</button>
                </td>
                <td class="px-4 py-2 text-center">
                  <span :class="statusClass(item.status) + ' px-2 py-1 rounded text-xs font-semibold'">
                    {{ statusText(item.status) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-center">
                  <div class="flex flex-row gap-1 justify-center items-center">
                    <router-link
                      :to="`/project/detail/${item.projectId}`"
                    >
                      <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs shadow hover:bg-blue-600 transition">查看详情</button>
                    </router-link>
                    <template v-if="item.status === 'approved'">
                      <button 
                        v-if="item.hasContract"
                        @click="showContract(item.projectId)"
                        class="px-2 py-1 rounded-md bg-green-500 text-white text-xs shadow hover:bg-green-600 transition"
                      >
                        查看合同
                      </button>
                      <span 
                        v-else
                        class="px-2 py-1 rounded-md bg-gray-300 text-gray-600 text-xs"
                      >
                        待对方发起合同
                      </span>
                    </template>
                  </div>
                </td>
                <td class="px-4 py-2 text-center">{{ formatTime(item.createTime) }}</td>
                <td class="px-4 py-2 text-center">
                  {{ item.approveTime ? formatTime(item.approveTime) : '-' }}
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="7" class="text-center text-gray-400 py-6">暂无申请记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 简介弹窗 -->
      <div v-if="descDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full">
          <div class="font-bold mb-4 text-xl text-blue-700 flex items-center">
            项目简介
          </div>
          <div class="mb-6 whitespace-pre-line text-gray-700 text-base">{{ descContent }}</div>
          <div class="flex justify-end">
            <button class="px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition" @click="descDialog = false">关闭</button>
          </div>
        </div>
      </div>
      
      <!-- 合同弹窗 -->
      <div v-if="contractDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
          <div class="font-bold mb-4 text-xl text-blue-700 flex items-center justify-between">
            <span>合同详情</span>
            <button @click="contractDialog = false" class="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <div v-if="contractLoading" class="text-center py-8">
            <div class="text-gray-500">加载中...</div>
          </div>
          <div v-else-if="currentContract">
            <div class="mb-6">
              <div class="font-semibold text-base mb-2">合同名称：{{ currentContract.contractName || '无' }}</div>
              <div class="mb-4">备注：{{ currentContract.remark || '-' }}</div>
              <div class="mb-4">
                <div class="font-medium mb-2">合同附件：</div>
                <div class="flex flex-wrap gap-2">
                  <template v-for="(fileUrl, fileIdx) in currentContract.contractUrl.split(',')" :key="fileIdx">
                    <div class="flex items-center bg-gray-100 rounded px-3 py-2 shadow-sm">
                      <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v4" />
                      </svg>
                      <span class="truncate max-w-[200px] select-all" :title="fileUrl">{{ fileUrl.split('/').pop() }}</span>
                      <button @click="handleDownloadFile(fileUrl)" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-700">下载</button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            
            <!-- 根据合同状态显示不同操作 -->
            <div v-if="currentContract.status === 'pending'" class="flex justify-end gap-3">
              <button 
                @click="confirmSignContract('approved')"
                class="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
              >
                同意签署
              </button>
              <button 
                @click="confirmSignContract('rejected')"
                class="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
              >
                拒绝签署
              </button>
              <button 
                @click="contractDialog = false"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 transition"
              >
                取消
              </button>
            </div>
            
            <div v-else-if="currentContract.status === 'approved'" class="flex justify-end gap-3">
              <span class="px-4 py-2 bg-green-100 text-green-700 rounded text-sm font-medium">
                已签署
              </span>
              <button 
                @click="contractDialog = false"
                class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
              >
                返回
              </button>
            </div>
            
            <div v-else-if="currentContract.status === 'rejected'" class="flex justify-end gap-3">
              <span class="px-4 py-2 bg-red-100 text-red-700 rounded text-sm font-medium">
                已拒绝
              </span>
              <button 
                @click="contractDialog = false"
                class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMyProjectApplications, getContracts, updateContractStatus } from '@/lib/api/project';
import { downloadFile } from '@/lib/api/file';

interface ProjectApplicationVO {
  applicationId: number;
  projectId: number;
  applicantType: string;
  applicantId: number;
  message: string;
  status: string;
  organizationName: string;
  createTime: string;
  projectName: string;
  projectDescription: string;
  approveTime?: string | null;
  hasContract?: boolean;
}

const router = useRouter();
const applications = ref<ProjectApplicationVO[]>([]);
const loading = ref(true);

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'pending' },
  { label: '已同意', value: 'approved' },
  { label: '被拒绝', value: 'rejected' }
];
const currentStatus = ref('all');

const filteredApplications = computed(() => {
  if (currentStatus.value === 'all') return applications.value;
  return applications.value.filter(item => item.status === currentStatus.value);
});

function statusText(status: string) {
  switch (status) {
    case 'pending': return '待处理';
    case 'approved': return '已同意';
    case 'rejected': return '被拒绝';
    default: return status;
  }
}
function statusClass(status: string) {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'approved': return 'text-green-600 bg-green-100';
    case 'rejected': return 'text-red-500 bg-red-100';
    default: return '';
  }
}
function formatTime(time: string) {
  if (!time) return '-';
  return time.replace('T', ' ').slice(0, 16);
}

// 简介弹窗
const descDialog = ref(false);
const descContent = ref('');
function showDesc(desc: string) {
  descContent.value = desc;
  descDialog.value = true;
}

// 合同相关
const contractDialog = ref(false);
const contractLoading = ref(false);
const currentContract = ref<any>(null);
let currentProjectId: number | null = null;

async function showContract(projectId: number) {
  contractDialog.value = true;
  contractLoading.value = true;
  currentContract.value = null;
  currentProjectId = projectId;
  try {
    const res = await getContracts(projectId) as { data: any[] };
    const userContracts = res.data || [];
    // 优先找待签署的合同
    let contract = userContracts.find(c => c.status === 'pending');
    // 没有待签署的，找最新的
    if (!contract && userContracts.length > 0) {
      // 假设有 createdAt 字段，否则直接取最后一条
      contract = userContracts[userContracts.length - 1];
    }
    if (contract) {
      currentContract.value = contract;
    }
  } finally {
    contractLoading.value = false;
  }
}

async function handleDownloadFile(fileUrl: string) {
  const filename = fileUrl.split('/').pop();
  if (!filename) {
    alert('无法获取文件名');
    return;
  }
  try {
    const blob = await downloadFile(filename);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    alert('下载失败');
  }
}

function confirmSignContract(status: 'approved' | 'rejected') {
  if (!currentContract.value || !currentProjectId) return;
  const actionText = status === 'approved' ? '同意签署' : '拒绝签署';
  if (window.confirm(`确定要${actionText}该合同吗？`)) {
    updateContractStatus(currentProjectId, currentContract.value.contractId, { status })
      .then(() => {
        alert(`${actionText}成功`);
        // 更新当前合同状态
        currentContract.value.status = status;
        // 可选：刷新列表数据
        // await checkContracts(applications.value);
      })
      .catch(() => {
        alert('操作失败');
      });
  }
}

// 检查每个申请是否有合同
async function checkContracts(apps: ProjectApplicationVO[]) {
  for (const app of apps) {
    if (app.status === 'approved') {
      const res = await getContracts(app.projectId) as { data: any[] };
      const contracts = res.data || [];
      // 只要有待签署或已签署的合同就算有合同
      app.hasContract = contracts.some(c => c.status === 'pending' || c.status === 'approved');
    } else {
      app.hasContract = false;
    }
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const res = await getMyProjectApplications() as { data: ProjectApplicationVO[] };
    applications.value = res.data || [];
    await checkContracts(applications.value);
  } finally {
    loading.value = false;
  }
});
</script>