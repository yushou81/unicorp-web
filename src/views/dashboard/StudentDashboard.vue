<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-sm mb-8 animate-pulse">
        <div class="h-40 w-full bg-gray-200 rounded-t-xl"></div>
        <div class="px-6 py-4">
          <div class="flex flex-col md:flex-row">
            <div class="flex flex-col items-center md:items-start -mt-16 md:-mt-12">
              <div class="w-28 h-28 rounded-full bg-gray-300"></div>
              <div class="mt-4 w-40 h-6 bg-gray-300 rounded-md"></div>
              <div class="mt-2 w-24 h-4 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
        <div class="px-6 pt-2 pb-2 border-b">
          <div class="h-8 w-full bg-gray-100"></div>
        </div>
      </div>
      
      <div class="h-8 w-40 bg-gray-200 rounded-md mb-4"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-64 bg-white rounded-xl shadow-sm animate-pulse"></div>
      </div>
    </div>
    
    <!-- 主内容 -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- 个人信息卡片 -->
      <UserProfileInfo
        :avatar="userAvatar"
        :name="user.nickname"
        :role="roleText"
        :organization="user.school"
        :phone="user.phone"
        :email="user.email"
        :editable="true"
        :verified="user.verified"
        :onEdit="onEditProfileClick"
      />
      <!-- Tab栏 -->
      <DashboardTabs :tabs="tabList" :activeTab="activeTab" @change="val => activeTab = val" />
      <div class="mt-6">
        <div v-if="activeTab === 'record'">
          <!-- 求职记录tab内容 -->
          <div class="bg-white rounded-xl shadow-sm p-8">
            <h2 class="text-xl font-bold mb-6">我的岗位申请记录</h2>
            <div v-if="applicationsLoading" class="text-center py-10">加载中...</div>
            <div v-else>
              <div v-if="applications.length === 0" class="text-gray-400 text-center py-8">暂无岗位申请记录</div>
              <div v-else class="overflow-x-auto rounded-lg shadow">
                <table class="min-w-full bg-white rounded-lg">
                  <thead>
                    <tr class="bg-indigo-50">
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">岗位名称</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">公司</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">状态</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">申请时间</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">简历ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in applications" :key="item.applicationId" class="hover:bg-indigo-50 transition">
                      <td class="px-6 py-4 font-medium text-gray-900">{{ item.jobInfo?.jobTitle || '未知岗位' }}</td>
                      <td class="px-6 py-4">{{ item.jobInfo?.organizationName || '-' }}</td>
                      <td class="px-6 py-4">
                        <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                          :class="getStatusColor(item.status)">
                          {{ formatApplicationStatus(item.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4">{{ formatDate(item.appliedAt) }}</td>
                      <td class="px-6 py-4">{{ item.resumeId }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex justify-between items-center mt-6">
                <span>共 {{ applicationsTotal }} 条</span>
                <div>
                  <button
                    :disabled="applicationsPage === 1"
                    @click="changeApplicationsPage(applicationsPage-1)"
                    class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2 disabled:opacity-50"
                  >上一页</button>
                  <span class="mx-2">第 {{ applicationsPage }} / {{ applicationsPages }} 页</span>
                  <button
                    :disabled="applicationsPage === applicationsPages"
                    @click="changeApplicationsPage(applicationsPage+1)"
                    class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2 disabled:opacity-50"
                  >下一页</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'study'">
          <!-- 学习记录tab内容 -->
          <!-- ... existing code ... -->
        </div>
        <div v-else-if="activeTab === 'course'">
          <!-- 课程管理tab内容 -->
          <div class="bg-white rounded-xl shadow-sm p-8">
            <h2 class="text-xl font-bold mb-6">我已报名的课程</h2>
            <div v-if="enrolledCoursesLoading" class="text-center py-10">加载中...</div>
            <div v-else>
              <div v-if="enrolledCourses.length === 0" class="text-gray-400 text-center py-8">暂无已报名课程</div>
              <div v-else class="overflow-x-auto rounded-lg shadow">
                <table class="min-w-full bg-white rounded-lg">
                  <thead>
                    <tr class="bg-indigo-50">
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">课程名称</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">授课教师</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">企业导师</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">时间</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">状态</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in enrolledCourses" :key="item.id" class="hover:bg-indigo-50 transition">
                      <td class="px-6 py-4 font-medium text-gray-900">{{ item.title }}</td>
                      <td class="px-6 py-4">{{ item.teacherName }}</td>
                      <td class="px-6 py-4">{{ item.mentorName }}</td>
                      <td class="px-6 py-4">{{ new Date(item.scheduledTime).toLocaleString() }}</td>
                      <td class="px-6 py-4">
                        <span
                          :class="{
                            'bg-green-100 text-green-800': item.status === 'open',
                            'bg-blue-100 text-blue-800': item.status === 'in_progress',
                            'bg-gray-100 text-gray-800': item.status === 'planning',
                            'bg-purple-100 text-purple-800': item.status === 'completed',
                            'bg-red-100 text-red-800': item.status === 'cancelled'
                          }"
                          class="px-2 py-1 rounded text-xs font-semibold"
                        >
                          {{ statusText(item.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <router-link
                          :to="`/classroom/${item.id}`"
                          class="inline-block px-4 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                        >详情</router-link>
                        <button
                          class="inline-block px-4 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition ml-2"
                          @click="onCancelEnrollment(item.id)"
                          :disabled="cancelingId === item.id"
                        >
                          <span v-if="cancelingId === item.id">取消中...</span>
                          <span v-else>取消报名</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 分页控件 -->
              <div class="flex justify-between items-center mt-6">
                <span>共 {{ enrolledCoursesTotal }} 条</span>
                <div>
                  <button
                    :disabled="enrolledCoursesPage === 1"
                    @click="changeEnrolledCoursesPage(enrolledCoursesPage-1)"
                    class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2 disabled:opacity-50"
                  >上一页</button>
                  <span class="mx-2">第 {{ enrolledCoursesPage }} / {{ enrolledCoursesPages }} 页</span>
                  <button
                    :disabled="enrolledCoursesPage === enrolledCoursesPages"
                    @click="changeEnrolledCoursesPage(enrolledCoursesPage+1)"
                    class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2 disabled:opacity-50"
                  >下一页</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'resume'">
          <div class="bg-white rounded-xl shadow-sm p-8">
            <h2 class="text-xl font-bold mb-6">我的简历</h2>
            <div v-if="resumes.length === 0" class="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <p class="text-gray-600">您还没有创建简历</p>
              <button @click="showResumeDialog = true" class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">开始创建简历</button>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="resume in resumes" :key="resume.id" class="p-5 border rounded-lg shadow hover:shadow-lg transition bg-white flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="font-bold text-lg text-blue-700">{{ resume.major || '未设置专业' }}</div>
                    <span class="px-2 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">{{ resume.educationLevel }}</span>
                  </div>
                  <div class="text-sm text-gray-500 mb-2">更新时间: {{ resume.updatedAt ? new Date(resume.updatedAt).toLocaleString() : '未知' }}</div>
                  <div class="text-gray-700 line-clamp-2 mb-2">{{ resume.achievements || '暂无成就描述' }}</div>
                </div>
                <div class="flex space-x-2 mt-2">
                  <button v-if="resume.resumeUrl" @click="window.open(resume.resumeUrl, '_blank')" class="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">预览</button>
                  <button @click="onDeleteResume(resume.id)" class="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs">删除</button>
                </div>
              </div>
            </div>
            <button @click="showResumeDialog = true" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              新建简历
            </button>
          </div>
          <ResumeManager v-model:visible="showResumeDialog" :resumes="resumes" @resume-updated="onResumeUpdated" />
        </div>
        <div v-else-if="activeTab === 'chat'">
          <ChatPanel :myUserId="myUserId" :myAvatar="userAvatar" />
        </div>
      </div>
    </div>
    
    <!-- 编辑个人资料对话框 -->
    <div v-if="showEditProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">编辑个人资料</h2>
        <form @submit.prevent="onUpdateProfile">
          <!-- 头像上传 -->
          <div class="mb-5 flex flex-col items-center">
            <div class="relative group">
              <img 
                :src="previewAvatar || userAvatar" 
                class="w-28 h-28 rounded-full border-2 border-blue-200 mb-2 object-cover" 
                alt="avatar" 
              />
              <div 
                @click="fileInput?.click()" 
                class="absolute inset-0 rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200"
              >
                <span class="text-white text-sm">更换头像</span>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
            <p v-if="avatarFile" class="text-xs text-gray-500 mt-1 flex items-center">
              <span>{{ avatarFile.name }} ({{ formatFileSize(avatarFile.size) }})</span>
              <button 
                type="button" 
                @click="cancelAvatarUpload" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </p>
          </div>

          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">昵称</label>
            <input v-model="editProfile.nickname" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入昵称" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">邮箱</label>
            <input v-model="editProfile.email" type="email" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入邮箱" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">手机号</label>
            <input v-model="editProfile.phone" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入手机号" />
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showEditProfileDialog = false" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">取消</button>
            <button type="submit" :disabled="updateProfileLoading" class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center">
              <svg v-if="updateProfileLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ updateProfileLoading ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
        <div class="mt-6 pt-4 border-t">
          <h3 class="text-lg font-semibold mb-3">修改密码</h3>
          <form @submit.prevent="onChangePassword">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">原密码</label>
              <input v-model="passwordChange.oldPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入原密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">新密码</label>
              <input v-model="passwordChange.newPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入新密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">确认新密码</label>
              <input v-model="passwordChange.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请再次输入新密码" />
            </div>
            <div class="flex justify-end space-x-2">
              <button type="submit" :disabled="changePasswordLoading" class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition flex items-center">
                <svg v-if="changePasswordLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ changePasswordLoading ? '修改中...' : '修改密码' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Toast提示组件 -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      :class="{'opacity-0 translate-y-2': toast.hiding, 'opacity-100 translate-y-0': !toast.hiding}"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ref, computed, onMounted, watch } from 'vue'
import { BriefcaseIcon, BookmarkIcon, AcademicCapIcon, CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
import { getMe, updatePassword, updateUserInfo, uploadAvatar } from '@/lib/api/auth'
import { getMyResumes, createMyResume, updateMyResume, deleteMyResume } from '@/lib/api/resume'
import { getFavoriteJobs, unfavoriteJob, getMyApplications, Job, JobApplication } from '@/lib/api/job'
import Button from '@/components/ui/Button.vue'
import Navbar from '@/components/layout/Navbar.vue'
import ResumeManager from '@/components/resume/ResumeManager.vue'
import { apiRequest } from '@/lib/api/apiClient'
import { getChatSessions, getSessionMessages, sendChatMessage } from '@/lib/api/chat'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import UserProfileInfo from '@/components/dashboard/UserProfileInfo.vue'
import DashboardTabs from '@/components/dashboard/DashboardTabs.vue'
import { getStudentEnrolledCourses, cancelEnrollment } from '@/lib/api/classroom'

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 定义User类型
interface User {
  avatar?: string;
  nickname: string;
  email: string;
  phone: string;
  verified: boolean;
  school: string;
}

// 定义AppUser类型，这应该与您的store中定义的用户类型匹配
interface AppUser {
  id?: number;
  account?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  organizationId?: number;
  organizationName?: string;
}

// 定义数据项类型
interface DataItem {
  id: number;
  label: string;
  extra?: string;
  status?: string;
  statusColor?: string;
  jobId?: number; // 岗位ID，用于收藏/申请操作
}

// 定义区块类型
interface Block {
  title: string;
  icon: any;
  color: string;
  type: string;
  data: DataItem[];
  empty: string;
  count?: number;
  loading?: boolean;
  footer?: {
    text: string;
    link: string;
  };
}

// 简历数据类型 - 与API保持一致
interface ResumeData {
  id?: number;
  major: string;
  educationLevel: string;
  achievements: string;
  resumeUrl?: string;
}

const user = ref<User>({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '加载中...',
  email: '',
  phone: '',
  verified: false,
  school: '加载中...'
})

async function fetchUserInfo() {
  try {
    const res = await getMe() as ApiResponse<any>
    const userData = res?.data
    if (userData) {
      user.value = {
        avatar: userData.avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: userData.nickname || userData.account || '未知用户',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        school: userData.organizationName || '未绑定学校'
      }
    }
  } catch (e: any) {
    console.error('获取用户信息失败:', e)
    // 保持默认值
  }
}

// 更新blocks数据
const blocks = ref<Block[]>([
  {
    title: '收藏/投递职位',
    icon: BriefcaseIcon,
    color: 'text-blue-500',
    type: 'list',
    data: [],
    loading: false,
    empty: '暂无职位记录',
    footer: { text: '查看全部职位', link: '/job' }
  },
  {
    title: '学习记录',
    icon: AcademicCapIcon,
    color: 'text-green-500',
    type: 'list',
    data: [
      { id: 1, label: 'AI创新项目论文', extra: '2024-04-22' }
    ],
    empty: '暂无学习记录',
    footer: { text: '管理我的学习', link: '/learn' }
  },
  {
    title: '报名课程',
    icon: CalendarDaysIcon,
    color: 'text-indigo-500',
    type: 'list',
    data: [
      { id: 1, label: '大数据实战', extra: '2024-07-01' }
    ],
    empty: '暂无报名课程',
    footer: { text: '查看全部课程', link: '/courses' }
  },
  {
    title: '企业申请入口',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-500',
    type: 'list',
    data: [],
    empty: '如有意向加入企业项目，请点击下方入口',
    footer: { text: '申请加入企业项目', link: '/apply' }
  },
  {
    title: '学校信息浏览',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    type: 'list',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部学校', link: '/school/list' }
  },
  {
    title: '企业信息浏览',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-600',
    type: 'list',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部企业', link: '/company/list' }
  }
])

// 添加我的申请区块
const myApplicationsBlock = ref<Block>({
  title: '我的岗位申请',
  icon: BookmarkIcon,
  color: 'text-purple-500',
  type: 'list',
  data: [],
  loading: false,
  empty: '暂无申请记录',
  footer: { text: '查看所有申请', link: '/me/applications' }
})

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const userInfo = computed<AppUser>(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || user.value.avatar || 'https://randomuser.me/api/portraits/men/32.jpg')
const roleText = computed(() => {
  const role = userInfo.value.role || ''
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

// 头像上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const previewAvatar = ref<string | null>(null)
const avatarUploading = ref(false)

// 简历管理相关
const showResumeDialog = ref(false)
const resumes = ref<ResumeData[]>([])

// 监听 showResumeDialog 打开时拉取简历
watch(showResumeDialog, (val) => {
  if (val) {
    fetchResumes()
  }
})

async function fetchResumes() {
  try {
    const res = await getMyResumes()
    if (res.code === 200 && res.data) {
      resumes.value = res.data.records || res.data || []
    } else {
      resumes.value = []
    }
  } catch (e) {
    resumes.value = []
  }
}

// Toast提示
const toast = ref({
  show: false,
  message: '',
  hiding: false
})

// 获取收藏的岗位
async function fetchFavoriteJobs() {
  blocks.value[0].loading = true
  try {
    const response = await getFavoriteJobs({ page: 0, size: 5 })
    if (response.code === 200 && response.data) {
      blocks.value[0].data = response.data.records.map(job => ({
        id: job.id,
        jobId: job.id,
        label: job.title,
        extra: job.organizationName,
        status: formatJobStatus(job.status)
      }))
    }
  } catch (error) {
    console.error('获取收藏岗位失败:', error)
  } finally {
    blocks.value[0].loading = false
  }
}

// 获取我的申请
async function fetchMyApplications() {
  myApplicationsBlock.value.loading = true
  try {
    const response = await getMyApplications({ page: 0, size: 5 })
    if (response.code === 200 && response.data) {
      myApplicationsBlock.value.data = response.data.records.map(app => ({
        id: app.id,
        jobId: app.jobId,
        label: app.jobTitle,
        extra: app.companyName,
        status: formatApplicationStatus(app.status),
        statusColor: getStatusColor(app.status)
      }))
    }
  } catch (error) {
    console.error('获取岗位申请失败:', error)
  } finally {
    myApplicationsBlock.value.loading = false
  }
}

// 格式化岗位状态
function formatJobStatus(status: string): string {
  switch (status) {
    case 'open': return '招聘中'
    case 'closed': return '已关闭'
    default: return status
  }
}

// 格式化申请状态
function formatApplicationStatus(status: string): string {
  switch (status) {
    case 'submitted': return '已提交'
    case 'viewed': return '已查看'
    case 'interviewing': return '面试中'
    case 'offered': return '已录用'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

// 获取状态颜色
function getStatusColor(status: string): string {
  switch (status) {
    case 'submitted': return 'bg-blue-100 text-blue-700'
    case 'viewed': return 'bg-yellow-100 text-yellow-700'
    case 'interviewing': return 'bg-purple-100 text-purple-700'
    case 'offered': return 'bg-green-100 text-green-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

// 取消收藏岗位
async function handleUnfavorite(jobId: number) {
  try {
    const response = await unfavoriteJob(jobId)
    if (response.code === 200) {
      showToast('取消收藏成功')
      // 从列表中移除该岗位
      blocks.value[0].data = blocks.value[0].data.filter(item => item.jobId !== jobId)
    } else {
      showToast(response.message || '取消收藏失败')
    }
  } catch (error: any) {
    showToast(error.message || '操作失败')
  }
}

// 显示Toast消息
function showToast(message: string, duration = 2000) {
  // 如果已经有Toast在显示，先关闭它
  if (toast.value.show) {
    hideToast()
  }
  
  // 显示新Toast
  setTimeout(() => {
    toast.value.message = message
    toast.value.show = true
    toast.value.hiding = false
    
    // 设置自动隐藏
    setTimeout(hideToast, duration)
  }, toast.value.show ? 300 : 0)
}

// 隐藏Toast
function hideToast() {
  toast.value.hiding = true
  setTimeout(() => {
    toast.value.show = false
  }, 300)
}

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    // 先更新用户基本信息
    await updateUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    
    // 如果选择了新头像，则上传头像
    if (avatarFile.value) {
      avatarUploading.value = true
      try {
        await uploadAvatar(avatarFile.value)
        console.log('头像上传成功')
      } catch (avatarError: any) {
        console.error('头像上传失败:', avatarError)
        alert('头像上传失败: ' + (avatarError.message || '未知错误'))
        // 继续执行，不影响其他信息的保存
      } finally {
        avatarUploading.value = false
      }
    }
    
    showEditProfileDialog.value = false
    
    // 重置头像上传状态
    avatarFile.value = null
    previewAvatar.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    await fetchUserInfo() // 重新获取用户信息
    
    // 更新store中的用户信息
    const res = await getMe() as ApiResponse<any>
    if (res?.data) {
      appStore.setUser(res.data)
    }
    
    showToast('个人资料更新成功')
  } catch (e: any) {
    showToast('更新失败：' + (e.message || '未知错误'))
  } finally {
    updateProfileLoading.value = false
  }
}

async function onChangePassword() {
  if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
    showToast('新密码与确认密码不一致')
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
    showToast('密码修改成功')
  } catch (e: any) {
    showToast('密码修改失败：' + (e.message || '未知错误'))
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

// 处理头像上传相关函数
function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    avatarFile.value = target.files[0]
    previewAvatar.value = URL.createObjectURL(avatarFile.value)
  }
}

function cancelAvatarUpload() {
  avatarFile.value = null
  previewAvatar.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}

// 简历更新回调
function onResumeUpdated() {
  // 可以在这里执行一些操作，如更新数据卡片中的简历信息
  console.log('简历已更新')
}

// 添加页面加载状态
const isLoading = ref(true)
const mobileMenuOpen = ref(false)

// 在onMounted中模拟加载
onMounted(async () => {
  try {
    await fetchUserInfo()
    
    // 获取收藏岗位和申请记录
    await Promise.all([
      fetchFavoriteJobs(),
      fetchMyApplications()
    ])
    
    // 获取完成后设置加载状态为false
    setTimeout(() => {
      isLoading.value = false
    }, 300) // 短暂延迟以确保平滑过渡
  } catch (e) {
    console.error('获取数据失败:', e)
    isLoading.value = false
  }

  // 支持通过 query 参数 tab=chat&sessionId=xxx 自动切换
  if (route.query.tab === 'chat') {
    activeTab.value = 'chat'
    await fetchChatSessions()
    if (route.query.sessionId) {
      const sessionIdNum = Number(route.query.sessionId)
      if (sessionIdNum) {
        selectedSessionId.value = sessionIdNum
        await fetchSessionMessages(sessionIdNum)
      }
    }
  }
})

// 移动菜单切换
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 跳转到职位详情页
function goToJobDetail(jobId: number) {
  router.push(`/job/${jobId}`)
}

const activeTab = ref('home')
// 求职记录tab相关
const applications = ref<any[]>([])
const applicationsLoading = ref(false)
const applicationsPage = ref(1)
const applicationsSize = ref(10)
const applicationsTotal = ref(0)
const applicationsPages = ref(1)

watch(activeTab, (val) => {
  if (val === 'record') {
    fetchApplications()
  }
  if (val === 'resume') {
    fetchResumes()
  }
})

async function fetchApplications() {
  applicationsLoading.value = true
  try {
    const res = await getMyApplications({ page: applicationsPage.value - 1, size: applicationsSize.value })
    if (res.code === 200 && res.data) {
      applications.value = res.data.records
      applicationsTotal.value = res.data.total
      applicationsPages.value = res.data.pages
    }
  } finally {
    applicationsLoading.value = false
  }
}
function changeApplicationsPage(newPage: number) {
  applicationsPage.value = newPage
  fetchApplications()
}
function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 聊天相关
const chatSessions = ref<any[]>([])
const chatMessages = ref<any[]>([])
const selectedSessionId = ref<number|null>(null)
const selectedSession = computed(() => chatSessions.value.find(s => s.id === selectedSessionId.value))
const newMessage = ref('')
const myUserId = computed(() => userInfo.value.id)
// 新增：存储每个会话的otherUserId
const sessionOtherUserIds = ref<Record<number, number>>({})

async function fetchChatSessions() {
  try {
    const res = await getChatSessions()
    chatSessions.value = res.data || []
  } catch (e) {
    chatSessions.value = []
  }
}

async function fetchSessionMessages(sessionId: number) {
  try {
    const res = await getSessionMessages(sessionId)
    chatMessages.value = res.data || []
    // 新增：存储otherUserId
    if (typeof res.otherUserId === 'number') {
      sessionOtherUserIds.value[sessionId] = res.otherUserId
    }
  } catch (e) {
    chatMessages.value = []
  }
}

function selectSession(sessionId: number) {
  selectedSessionId.value = sessionId
  fetchSessionMessages(sessionId)
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedSession.value) return
  // 优先用otherUserId
  const receiverId = sessionOtherUserIds.value[selectedSession.value.id] || selectedSession.value.user?.id || selectedSession.value.toUserId || selectedSession.value.targetUserId
  if (!receiverId) {
    alert('无法获取对方用户ID，无法发送消息')
    return
  }
  try {
    await sendChatMessage({
      sessionId: selectedSession.value.id,
      receiverId,
      content: newMessage.value.trim()
    })
    newMessage.value = ''
    fetchSessionMessages(selectedSession.value.id)
  } catch (e) {}
}

// 获取当前用户ID
onMounted(async () => {
  try {
    const res = await apiRequest<any>('/v1/auth/me')
    myUserId.value = res.data?.id || null
  } catch {}
})

// 监听tab切换到聊天时加载会话
watch(activeTab, (val) => {
  if (val === 'chat') {
    fetchChatSessions()
  }
})

const tabList = [
  { label: '求职记录', value: 'record' },
  { label: '学习记录', value: 'study' },
  { label: '课程管理', value: 'course' },
  { label: '我的简历', value: 'resume' },
  { label: '聊天', value: 'chat' }
]

const enrolledCourses = ref<any[]>([])
const enrolledCoursesLoading = ref(false)
const enrolledCoursesPage = ref(1)
const enrolledCoursesSize = ref(10)
const enrolledCoursesTotal = ref(0)
const enrolledCoursesPages = ref(1)

watch(activeTab, (val) => {
  if (val === 'course') {
    fetchEnrolledCourses()
  }
})

async function fetchEnrolledCourses() {
  enrolledCoursesLoading.value = true
  try {
    const res = await getStudentEnrolledCourses(enrolledCoursesPage.value, enrolledCoursesSize.value)
    if (res.code === 200 && res.data) {
      enrolledCourses.value = res.data.records
      enrolledCoursesTotal.value = res.data.total
      enrolledCoursesPages.value = res.data.pages
    }
  } finally {
    enrolledCoursesLoading.value = false
  }
}
function changeEnrolledCoursesPage(newPage: number) {
  enrolledCoursesPage.value = newPage
  fetchEnrolledCourses()
}
function statusText(status: string) {
  const map: Record<string, string> = {
    planning: '筹备中',
    open: '开放报名',
    in_progress: '进行中',
    completed: '已结束',
    cancelled: '已取消'
  }
  return map[status] || status
}

function onDeleteResume(resumeId) {
  if (!resumeId) return
  if (confirm('确定要删除这份简历吗？此操作不可恢复。')) {
    deleteMyResume(resumeId).then(() => {
      fetchResumes()
      showToast('简历删除成功')
    }).catch(e => {
      showToast('删除失败：' + (e.message || '未知错误'))
    })
  }
}

const cancelingId = ref<number | null>(null)

async function onCancelEnrollment(courseId: number) {
  if (!confirm('确定要取消报名该课程吗？')) return
  cancelingId.value = courseId
  try {
    const res = await cancelEnrollment(courseId)
    if (res.code === 200) {
      await fetchEnrolledCourses()
      showToast('取消报名成功')
    } else {
      showToast(res.message || '取消报名失败')
    }
  } catch (e: any) {
    showToast(e.message || '取消报名失败')
  } finally {
    cancelingId.value = null
  }
}
</script>

<style scoped>
.gradient-card {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 页面过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片悬停效果 */
.hover-card {
  transition: all 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* 隐藏滚动条但保留功能 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}

/* 响应式卡片高度匹配 */
@media (min-width: 768px) {
  .equal-height-cards {
    display: grid;
    grid-auto-rows: 1fr;
  }
}

/* 加载动画 */
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 头像悬停效果增强 */
.avatar-hover {
  position: relative;
  overflow: hidden;
}

.avatar-hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  border-radius: 9999px;
  transition: opacity 0.2s ease;
}

.avatar-hover:hover::after {
  opacity: 1;
}
</style>