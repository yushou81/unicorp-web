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
                <th class="px-4 py-2">项目详情</th>
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
                  <router-link
                    :to="`/project/detail/${item.projectId}`"
                  >
                    <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs shadow hover:bg-blue-600 transition">查看</button>
                  </router-link>
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
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
            </svg>
            项目简介
          </div>
          <div class="mb-6 whitespace-pre-line text-gray-700 text-base">{{ descContent }}</div>
          <div class="flex justify-end">
            <button class="px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition" @click="descDialog = false">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMyProjectApplications } from '@/lib/api/project';

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

onMounted(async () => {
  loading.value = true;
  try {
    const res = await getMyProjectApplications() as { data: ProjectApplicationVO[] };
    applications.value = res.data || [];
  } finally {
    loading.value = false;
  }
});
</script>