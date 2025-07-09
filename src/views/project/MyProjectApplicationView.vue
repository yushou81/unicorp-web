<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <h2 class="text-3xl font-bold text-gray-800 mb-8">我的项目申请</h2>
      
      <!-- 筛选 Tabs -->
      <div class="bg-white rounded-lg shadow-sm mb-6 p-4 flex flex-wrap gap-2">
        <button
          v-for="item in statusOptions"
          :key="item.value"
          @click="currentStatus = item.value"
          :class="currentStatus === item.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="px-4 py-2 rounded-md font-medium transition-colors text-sm"
        >
          {{ item.label }}
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="loading" class="text-gray-500 text-center py-10">
          <div class="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          加载中...
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">组织名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">简介</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">同意时间</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in filteredApplications"
                :key="item.applicationId"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{{ item.projectName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.organizationName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button class="text-blue-600 hover:text-blue-800 font-medium text-xs" @click="showDesc(item.projectDescription)">查看</button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="statusClass(item.status) + ' px-2 py-1 rounded-full text-xs font-medium'">
                    {{ statusText(item.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex flex-row gap-2">
                    <router-link
                      :to="`/project/dock/detail/${item.projectId}`"
                    >
                      <button class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">查看详情</button>
                    </router-link>
                    <template v-if="item.status === 'approved'">
                      <button 
                        v-if="item.hasContract"
                        @click="showContract(item.projectId)"
                        class="px-3 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        查看合同
                      </button>
                      <span 
                        v-else
                        class="px-3 py-1 rounded-md bg-gray-200 text-gray-600 text-xs font-medium"
                      >
                        待对方发起合同
                      </span>
                    </template>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatTime(item.createTime) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.approveTime ? formatTime(item.approveTime) : '-' }}
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="7" class="text-center text-gray-400 py-8 text-sm">暂无申请记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 分页按钮 -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          共 {{ total }} 条记录
        </div>
        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="px-4 py-2 text-sm font-medium text-gray-700">第 {{ currentPage }} / {{ Math.max(1, Math.ceil(total / pageSize)) }} 页</span>
          <button
            :disabled="currentPage === Math.ceil(total / pageSize) || total === 0"
            @click="changePage(currentPage + 1)"
            class="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
      
      <!-- 简介弹窗 -->
      <div v-if="descDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">项目简介</h3>
            <button @click="descDialog = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mb-6 whitespace-pre-line text-gray-700 text-sm max-h-96 overflow-y-auto">{{ descContent }}</div>
          <div class="flex justify-end">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium" @click="descDialog = false">关闭</button>
          </div>
        </div>
      </div>
      
      <!-- 合同弹窗 -->
      <div v-if="contractDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">合同详情</h3>
            <button @click="contractDialog = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="contractLoading" class="text-center py-8">
            <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full text-blue-600"></div>
            <div class="mt-2 text-gray-600">加载中...</div>
          </div>
          <div v-else-if="currentContract">
            <div class="mb-6">
              <div class="mb-4">
                <span class="text-gray-500 text-sm">合同名称：</span>
                <span class="font-medium text-gray-900">{{ currentContract.contractName || '无' }}</span>
              </div>
              <div class="mb-4">
                <span class="text-gray-500 text-sm">备注：</span>
                <span class="text-gray-700">{{ currentContract.remark || '-' }}</span>
              </div>
              <div class="mb-4">
                <div class="text-gray-500 text-sm mb-2">合同附件：</div>
                <div class="flex flex-wrap gap-2">
                  <template v-for="(fileUrl, fileIdx) in currentContract.contractUrl.split(',')" :key="fileIdx">
                    <div class="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                      <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span class="truncate max-w-[200px] text-sm text-gray-700" :title="getOriginalName(fileIdx)">
                        {{ getOriginalName(fileIdx) }}
                      </span>
                      <button @click="handleDownloadFile(fileUrl)" class="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">下载</button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            
            <!-- 根据合同状态显示不同操作 -->
            <div v-if="currentContract.status === 'pending'" class="flex justify-end gap-3">
              <button 
                @click="confirmSignContract('approved')"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                同意签署
              </button>
              <button 
                @click="confirmSignContract('rejected')"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                拒绝签署
              </button>
              <button 
                @click="contractDialog = false"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                取消
              </button>
            </div>
            <div v-else-if="currentContract.status === 'approved'" class="flex justify-end gap-3">
              <span class="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                已签署
              </span>
              <button 
                @click="contractDialog = false"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                返回
              </button>
            </div>
            <div v-else-if="currentContract.status === 'rejected'" class="flex justify-end gap-3">
              <span class="px-4 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium">
                已拒绝
              </span>
              <button 
                @click="contractDialog = false"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
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
import { ref, computed, onMounted, watch } from 'vue';
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

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'pending' },
  { label: '已同意', value: 'approved' },
  { label: '被拒绝', value: 'rejected' }
];
const currentStatus = ref('all');

const filteredApplications = computed(() => {
  // 分页后直接展示 applications
  return applications.value;
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
    case 'pending': return 'text-yellow-800 bg-yellow-100';
    case 'approved': return 'text-green-800 bg-green-100';
    case 'rejected': return 'text-red-800 bg-red-100';
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

function getOriginalName(idx: number) {
  if (!currentContract.value) return '';
  if (currentContract.value.originalName) {
    const arr = currentContract.value.originalName.split(',');
    return arr[idx] || arr[0] || '附件';
  }
  return currentContract.value.contractUrl.split(',')[idx]?.split('/').pop() || '附件';
}

// 分页与筛选请求
async function fetchApplications(page = currentPage.value) {
  loading.value = true;
  try {
    const params: any = {
      page,
      pageSize: pageSize.value
    };
    if (currentStatus.value !== 'all') {
      params.status = currentStatus.value;
    }
    const res = await getMyProjectApplications(params) as { data: { list: ProjectApplicationVO[]; total: number } };
    applications.value = res.data?.list || [];
    total.value = res.data?.total || 0;
    await checkContracts(applications.value);
    currentPage.value = page;
  } finally {
    loading.value = false;
  }
}

function changePage(page: number) {
  currentPage.value = page;
  fetchApplications(page);
}

watch(currentStatus, () => {
  currentPage.value = 1;
  fetchApplications(1);
});

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.25s cubic-bezier(.4,0,.2,1);
}
</style>