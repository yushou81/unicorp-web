<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      
      <h2 class="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">我的项目申请</h2>
      <!-- 筛选 Tabs -->
      <div class="flex justify-center mb-8 gap-4">
        <button
          v-for="item in statusOptions"
          :key="item.value"
          @click="currentStatus = item.value"
          :class="currentStatus === item.value ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'"
          class="px-6 py-2 rounded-full font-semibold shadow transition text-base border border-transparent hover:border-blue-300"
        >
          {{ item.label }}
        </button>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
        <div v-if="loading" class="text-gray-500 text-center py-10">加载中...</div>
        <div v-else>
          <table class="min-w-full">
            <thead>
              <tr class="bg-blue-50 text-blue-800 text-base">
                <th class="px-4 py-3 font-semibold">项目名称</th>
                <th class="px-4 py-3 font-semibold">组织名称</th>
                <th class="px-4 py-3 font-semibold">简介</th>
                <th class="px-4 py-3 font-semibold">状态</th>
                <th class="px-4 py-3 font-semibold">操作</th>
                <th class="px-4 py-3 font-semibold">申请时间</th>
                <th class="px-4 py-3 font-semibold">同意时间</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredApplications"
                :key="item.applicationId"
                class="border-b last:border-b-0 hover:bg-blue-50 transition"
              >
                <td class="px-4 py-3 text-center font-medium text-blue-700">{{ item.projectName }}</td>
                <td class="px-4 py-3 text-center text-blue-600">{{ item.organizationName }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 text-xs font-semibold shadow hover:from-blue-200 hover:to-indigo-200 transition" @click="showDesc(item.projectDescription)">查看</button>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="statusClass(item.status) + ' px-3 py-1 rounded-full text-xs font-semibold'">
                    {{ statusText(item.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex flex-row gap-1 justify-center items-center">
                    <router-link
                      :to="`/project/dock/detail/${item.projectId}`"
                    >
                      <button class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold shadow hover:from-blue-600 hover:to-indigo-600 transition">查看详情</button>
                    </router-link>
                    <template v-if="item.status === 'approved'">
                      <button 
                        v-if="item.hasContract"
                        @click="showContract(item.projectId)"
                        class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition"
                      >
                        查看合同
                      </button>
                      <span 
                        v-else
                        class="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-semibold"
                      >
                        待对方发起合同
                      </span>
                    </template>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">{{ formatTime(item.createTime) }}</td>
                <td class="px-4 py-3 text-center">
                  {{ item.approveTime ? formatTime(item.approveTime) : '-' }}
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="7" class="text-center text-gray-400 py-8 text-lg">暂无申请记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 分页按钮 -->
      <div class="flex justify-center mt-8 gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow disabled:opacity-50"
        >
          上一页
        </button>
        <span class="mx-2 text-base font-medium">第 {{ currentPage }} / {{ Math.max(1, Math.ceil(total / pageSize)) }} 页</span>
        <button
          :disabled="currentPage === Math.ceil(total / pageSize) || total === 0"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow disabled:opacity-50"
        >
          下一页
        </button>
      </div>
      <!-- 简介弹窗 -->
      <div v-if="descDialog" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-blue-200 animate-fade-in">
          <div class="font-bold mb-4 text-xl text-blue-700 flex items-center">
            项目简介
          </div>
          <div class="mb-6 whitespace-pre-line text-gray-700 text-base">{{ descContent }}</div>
          <div class="flex justify-end">
            <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition" @click="descDialog = false">关闭</button>
          </div>
        </div>
      </div>
      <!-- 合同弹窗 -->
      <div v-if="contractDialog" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-blue-200 animate-fade-in">
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
                      <span class="truncate max-w-[200px] select-all" :title="getOriginalName(fileIdx)">
                        {{ getOriginalName(fileIdx) }}
                      </span>
                      <button @click="handleDownloadFile(fileUrl)" class="ml-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded text-xs hover:from-blue-600 hover:to-indigo-600">下载</button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- 根据合同状态显示不同操作 -->
            <div v-if="currentContract.status === 'pending'" class="flex justify-end gap-3">
              <button 
                @click="confirmSignContract('approved')"
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow hover:from-green-600 hover:to-emerald-600 transition"
              >
                同意签署
              </button>
              <button 
                @click="confirmSignContract('rejected')"
                class="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow hover:from-red-600 hover:to-pink-600 transition"
              >
                拒绝签署
              </button>
              <button 
                @click="contractDialog = false"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
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
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition"
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
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition"
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