<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <div class="container mx-auto px-4 py-6 max-w-6xl">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>
      
      <!-- Toast提示 -->
      <div v-if="toast.show" class="fixed top-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300" :class="{'opacity-0': toast.hiding, 'opacity-100': !toast.hiding}">
        {{ toast.message }}
      </div>
      
      <template v-else-if="job">
        <!-- 面包屑导航 -->
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <router-link to="/" class="hover:text-blue-600">首页</router-link>
          <span class="mx-2">/</span>
          <router-link to="/job" class="hover:text-blue-600">招聘</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-700">职位详情页</span>
        </div>
        
        <!-- 职位标题区域 -->
        <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ job.title }}
                <span class="text-blue-500 ml-2 text-base">{{ formatJobType(job.jobType) }}</span>
              </h1>
              
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div class="flex items-center">
                  <MapPinIcon class="w-4 h-4 mr-1" />
                  <span>{{ job.location }}</span>
                </div>
                <div class="flex items-center">
                  <GraduationCapIcon class="w-4 h-4 mr-1" />
                  <span>{{ formatEducation(job.educationRequirement) }}</span>
                </div>
                <div class="flex items-center">
                  <ClockIcon class="w-4 h-4 mr-1" />
                  <span>{{ formatDate(job.createdAt) }}</span>
                </div>
              </div>
              
              <div class="text-blue-600 text-xl font-medium">
                {{ formatSalary(job.salaryMin, job.salaryMax, job.salaryUnit) }}
              </div>
            </div>
            
            <div class="flex flex-col items-center mt-4 md:mt-0">
              <img 
                :src="displayLogoUrl" 
                alt="公司Logo" 
                class="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2 border border-gray-100"
              />
              <div class="text-sm text-gray-500 mt-2">{{ job.organizationName }}</div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-4 mt-6">
            <button 
              @click="showApplicationModal" 
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <SendIcon class="w-4 h-4 mr-2" />
              立即申请
            </button>
            <button 
              @click="handleFavorite" 
              class="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
              :disabled="favoriteLoading"
            >
              <BookmarkIcon class="w-4 h-4 mr-2" />
              {{ favoriteLoading ? '处理中...' : (isFavorited ? '取消收藏' : '收藏') }}
            </button>
            <button class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
              <ShareIcon class="w-4 h-4 mr-2" />
              分享
            </button>
            <div class="flex items-center text-sm text-gray-500 ml-auto">
              <EyeIcon class="w-4 h-4 mr-1" />
              <span>浏览 {{ job.viewCount || 0 }} 次</span>
            </div>
          </div>
        </div>
        
        <!-- 职位详情和公司信息 -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <!-- 左侧：职位详情 -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileTextIcon class="w-5 h-5 mr-2 text-blue-600" />
                职位描述
              </h2>
              <div class="prose max-w-none text-gray-700">
                <p>{{ job.description }}</p>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ClipboardCheckIcon class="w-5 h-5 mr-2 text-blue-600" />
                岗位要求
              </h2>
              <div class="prose max-w-none text-gray-700">
                <div v-if="job.requirements" v-html="formatContentWithNumbers(job.requirements)"></div>
                <div v-else class="text-gray-500 italic">暂无详细岗位要求描述</div>
              </div>
            </div>
            
            <!-- 福利待遇 -->
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <GiftIcon class="w-5 h-5 mr-2 text-blue-600" />
                福利待遇
              </h2>
              <div class="prose max-w-none text-gray-700">
                <div v-if="job.benefits" v-html="formatContentWithNumbers(job.benefits)"></div>
                <div v-else class="text-gray-500 italic">暂无详细福利待遇描述</div>
              </div>
            </div>
            
            <!-- 公司位置地图 -->
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5" v-if="hasCompanyLocation">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPinIcon class="w-5 h-5 mr-2 text-blue-600" />
                公司位置
              </h2>
              <div class="w-full">
                <LocationMap 
                  :position="companyPosition"
                  :location-name="job.organizationName"
                  :zoom="15"
                  height="400px"
                />
              </div>
            </div>
          </div>
          
          <!-- 右侧：公司信息和联系方式 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BuildingIcon class="w-5 h-5 mr-2 text-blue-600" />
                公司信息
              </h2>
              <div class="flex items-center mb-4">
                <img 
                  :src="displayLogoUrl" 
                  alt="公司Logo" 
                  class="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2 border border-gray-100 mr-4"
                />
                <div>
                  <div class="font-medium text-gray-900">{{ job.organizationName }}</div>
                  <div class="text-sm text-gray-500 mt-1">{{ job.industry || '未知行业' }}</div>
                </div>
              </div>
              
              <div class="space-y-3 text-gray-700 text-sm">
                <div class="flex items-start">
                  <UsersIcon class="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <div class="font-medium">公司规模</div>
                    <div class="text-gray-600">{{ job.companySize || '未知' }}</div>
                  </div>
                </div>
                <div class="flex items-start">
                  <MapPinIcon class="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <div class="font-medium">公司地址</div>
                    <div class="text-gray-600">{{ job.location }}</div>
                  </div>
                </div>
              </div>
              
              <!-- 移除公司主页链接div -->
              <!-- <div class="mt-4 pt-4 border-t border-gray-100">
                <router-link :to="`/company/${job.organizationId}`" class="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <ExternalLinkIcon class="w-4 h-4 mr-1" />
                  查看公司主页
                </router-link>
              </div> -->
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <PhoneIcon class="w-5 h-5 mr-2 text-blue-600" />
                联系方式
              </h2>
              <div class="space-y-3 text-gray-700 text-sm">
                <div v-if="job.postedByUser?.nickname" class="flex items-start">
                  <UserIcon class="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <div class="font-medium">联系人</div>
                    <div class="text-gray-600">{{ job.postedByUser.nickname }}</div>
                  </div>
                </div>
                <div v-if="job.postedByUser?.email" class="flex items-start">
                  <MailIcon class="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <div class="font-medium">邮箱</div>
                    <div class="text-gray-600">{{ job.postedByUser.email }}</div>
                  </div>
                </div>
                <div v-if="job.postedByUser?.phone" class="flex items-start">
                  <PhoneIcon class="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <div class="font-medium">电话</div>
                    <div class="text-gray-600">{{ job.postedByUser.phone }}</div>
                  </div>
                </div>
                <div v-if="!job.postedByUser?.nickname && !job.postedByUser?.email && !job.postedByUser?.phone" class="text-gray-500 italic">
                  暂无联系方式
                </div>
                <div v-if="job.postedByUser?.id" class="mt-4 flex justify-center">
                  <button
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    @click="startChatWithMentor"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22L4.8 17A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    发起聊天
                  </button>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CalendarIcon class="w-5 h-5 mr-2 text-blue-600" />
                投递时间
              </h2>
              <div class="text-gray-700">
                <div v-if="job.applicationDeadline" class="flex items-center">
                  <CalendarIcon class="w-4 h-4 mr-2 text-gray-400" />
                  <span>截止日期：{{ formatDate(job.applicationDeadline) }}</span>
                </div>
                <div v-else class="text-gray-500 italic">
                  长期有效
                </div>
              </div>
            </div>
            
            <!-- 推荐岗位区块 -->
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="w-5 h-5 mr-2 text-blue-600">🔗</span>
                推荐岗位
              </h2>
              <div v-if="recommendedLoading">加载中...</div>
              <div v-else>
                <div v-if="recommendedJobs.length > 0">
                  <GridJobCard
                    v-for="recJob in recommendedJobs"
                    :key="recJob.id"
                    :job="recJob"
                    class="mb-4"
                  />
                </div>
                <div v-else class="text-gray-500 italic">暂无推荐岗位</div>
              </div>
            </div>

          </div>
        </div>
      </template>
    </div>
    
    <!-- 页脚 -->
    <Footer 
      copyright="© 2023-2024 校企联盟平台 版权所有"
      contactInfo="联系方式：contact@example.com"
    />
    
    <!-- 申请岗位模态框 -->
    <JobApplicationModal 
      :visible="applicationModalVisible" 
      :job="job || {}" 
      :user-resumes="userResumes"
      v-model:selected-resume-id="selectedResumeId"
      :loading="applyLoading"
      @close="applicationModalVisible = false"
      @submit="handleApplicationSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getJobDetail, Job, favoriteJob, unfavoriteJob, ApiResponse, applyJob } from '@/lib/api/job'
import { getEnterpriseById } from '@/lib/api/organization'
import { getMyResumes } from '@/lib/api/resume'
import { getRecommendedJobs } from '@/lib/api/recommendation'
import GridJobCard from '@/components/job/GridJobCard.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import JobApplicationModal from '@/components/job/JobApplicationModal.vue'
import LocationMap from '@/components/map/LocationMap.vue'
import { 
  MapPin as MapPinIcon,
  GraduationCap as GraduationCapIcon,
  Clock as ClockIcon,
  Send as SendIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Eye as EyeIcon,
  FileText as FileTextIcon,
  ListChecks as ListChecksIcon,
  ClipboardCheck as ClipboardCheckIcon,
  Building as BuildingIcon,
  Users as UsersIcon,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Calendar as CalendarIcon,
  ExternalLink as ExternalLinkIcon,
  Gift as GiftIcon
} from 'lucide-vue-next'
import { getMe } from '@/lib/api/auth'
import { apiRequest } from '@/lib/api/apiClient'

// 组织接口
interface Organization {
  id: number;
  organizationName: string;
  type: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

// 简历接口
interface Resume {
  id?: number;
  major: string;
  educationLevel: string;
  achievements: string;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const route = useRoute()
const jobId = route.params.id as string
const router = useRouter()

const job = ref<Job | null>(null)
const loading = ref(true)
const error = ref('')
const favoriteLoading = ref(false)
const isFavorited = ref(false) // 是否已收藏
// Toast状态
const toast = ref({
  show: false,
  message: '',
  hiding: false
})

const applicationModalVisible = ref(false)
const organizationLogo = ref<string | null>(null)
const userResumes = ref<Resume[]>([])
const selectedResumeId = ref<number | null>(null)
const applyLoading = ref(false)

const recommendedJobs = ref<any[]>([])
const recommendedLoading = ref(false)

const fetchRecommendedJobs = async () => {
  recommendedLoading.value = true
  try {
    const res = await getRecommendedJobs({ size: 4 })
    if (res.data?.records) {
      recommendedJobs.value = res.data.records
    }
  } catch (e) {
    // 可选：处理错误
    recommendedJobs.value = []
  } finally {
    recommendedLoading.value = false
  }
}

// 公司位置相关
const companyPosition = computed(() => {
  if (job.value?.organization?.latitude && job.value?.organization?.longitude) {
    return {
      latitude: job.value.organization.latitude,
      longitude: job.value.organization.longitude
    }
  }
  // 默认位置（可以根据需要调整）
  return { latitude: 30.67, longitude: 104.06 }
})

// 判断是否有公司位置信息
const hasCompanyLocation = computed(() => {
  return !!(job.value?.organization?.latitude && job.value?.organization?.longitude)
})

// 获取岗位详情
const fetchJobDetail = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await getJobDetail(jobId)
    if (response.code === 200 && response.data) {
      job.value = response.data
      
      // 增加浏览次数记录
      if (job.value.viewCount !== undefined) {
        job.value.viewCount += 1
      }
      
      // 处理可能为null的字段
      if (!job.value.responsibilities) job.value.responsibilities = ''
      // 使用jobRequirements作为requirements的备选项
      if (!job.value.requirements && job.value.jobRequirements) {
        job.value.requirements = job.value.jobRequirements
      } else if (!job.value.requirements) {
        job.value.requirements = ''
      }
      // 使用jobBenefits作为benefits的备选项
      if (!job.value.benefits && job.value.jobBenefits) {
        job.value.benefits = job.value.jobBenefits
      } else if (!job.value.benefits) {
        job.value.benefits = ''
      }
      
      // 获取企业详情中的行业和规模信息
      if (job.value.enterpriseDetail) {
        if (!job.value.industry) {
          job.value.industry = job.value.enterpriseDetail.industry
        }
        if (!job.value.companySize) {
          job.value.companySize = job.value.enterpriseDetail.companySize
        }
      }
      
      // 获取组织Logo
      if (job.value.organizationId) {
        fetchOrganizationLogo(job.value.organizationId)
      }
      
      console.log('岗位详情数据:', job.value)
    } else {
      error.value = response.message || '获取岗位详情失败'
    }
  } catch (err) {
    console.error('获取岗位详情出错:', err)
    error.value = err instanceof Error ? err.message : '获取岗位详情出错'
  } finally {
    loading.value = false
  }
}

// 获取组织Logo
const fetchOrganizationLogo = async (organizationId: number) => {
  try {
    const response = await getEnterpriseById(organizationId) as ApiResponse<Organization>
    if (response.code === 200 && response.data && response.data.logoUrl) {
      organizationLogo.value = response.data.logoUrl
    }
  } catch (err) {
    console.error('获取组织Logo出错:', err)
  }
}

// 计算属性：获取要显示的Logo URL
const displayLogoUrl = computed(() => {
  return organizationLogo.value || job.value?.logo || '/company-placeholder.png'
})

// 格式化职位类型
const formatJobType = (jobType: string) => {
  switch (jobType) {
    case 'full_time':
      return '全职'
    case 'part_time':
      return '兼职'
    case 'internship':
      return '实习'
    case 'temporary':
      return '临时'
    case 'contract':
      return '合同制'
    case 'remote':
      return '远程'
    default:
      return jobType || '未知'
  }
}

// 格式化教育要求
const formatEducation = (education: string) => {
  switch (education) {
    case 'any':
      return '学历不限'
    case 'high_school':
      return '高中及以上'
    case 'associate':
      return '大专及以上'
    case 'bachelor':
      return '本科及以上'
    case 'master':
      return '硕士及以上'
    case 'phd':
      return '博士及以上'
    default:
      return education || '未知'
  }
}

// 格式化薪资
const formatSalary = (min: number | null, max: number | null, unit: string | null) => {
  if (min === null && max === null) {
    return '薪资面议'
  }
  
  let result = ''
  
  if (min !== null) {
    result += `${min}k`
  }
  
  if (max !== null) {
    result += `${result ? '-' : ''}${max}k`
  }
  
  // 添加薪资单位
  if (unit) {
    switch (unit) {
      case 'per_month':
        result += '/月'
        break
      case 'per_year':
        result += '/年'
        break
      default:
        break
    }
  }
  
  return result
}

// 格式化日期
const formatDate = (dateString: string | null) => {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// 格式化内容，将数字列表格式化
const formatContentWithNumbers = (content: string): string => {
  if (!content) return '';
  
  // 先按换行符分割
  const lines = content.split('\n');
  
  // 检查每行是否已经有数字序号
  const formattedLines = lines.map(line => {
    // 去除前后空格
    const trimmedLine = line.trim();
    if (!trimmedLine) return '';
    
    // 检查是否已经有数字序号格式（如"1. "、"1、"等）
    if (/^\d+[\.\、\:]/.test(trimmedLine)) {
      return `<p>${trimmedLine}</p>`;
    } else {
      return `<p>${trimmedLine}</p>`;
    }
  });
  
  return formattedLines.join('');
}

// 显示Toast消息
const showToast = (message: string, duration = 2000) => {
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
const hideToast = () => {
  toast.value.hiding = true
  setTimeout(() => {
    toast.value.show = false
  }, 300)
}

// 收藏岗位
const handleFavorite = async () => {
  if (!job.value) return
  
  favoriteLoading.value = true
  
  try {
    if (isFavorited.value) {
      // 取消收藏
      const response = await unfavoriteJob(jobId)
      if (response.code === 200) {
        isFavorited.value = false
        showToast('已取消收藏')
      } else {
        showToast(response.message || '取消收藏失败')
      }
    } else {
      // 添加收藏
      const response = await favoriteJob(jobId)
      if (response.code === 200) {
        isFavorited.value = true
        showToast('收藏成功')
      } else if (response.code === 400) {
        isFavorited.value = true
        showToast('已经收藏过该岗位')
      } else {
        showToast(response.message || '收藏失败')
      }
    }
  } catch (err) {
    console.error('收藏/取消收藏岗位出错:', err)
    if (err instanceof Error && err.message.includes('已收藏')) {
      isFavorited.value = true
      showToast('已经收藏过该岗位')
    } else {
      showToast(err instanceof Error ? err.message : '操作失败，请稍后再试')
    }
  } finally {
    favoriteLoading.value = false
  }
}

// 检查是否已收藏该岗位
const checkIfFavorited = async () => {
  try {
    // 这里应该调用API检查是否已收藏
    // 由于接口文档中没有提供检查是否已收藏的API，这里暂时使用try-catch方式
    // 实际项目中应该添加专门的API来检查
    const response = await favoriteJob(jobId)
    // 如果能成功收藏，说明之前没有收藏过
    isFavorited.value = false
  } catch (err) {
    // 如果收藏失败且错误信息包含"已收藏"，说明已经收藏过
    if (err instanceof Error && err.message.includes('已收藏')) {
      isFavorited.value = true
    }
  }
}

// 获取用户简历列表
const fetchUserResumes = async () => {
  try {
    const response = await getMyResumes()
    if (response.code === 200 && response.data) {
      userResumes.value = response.data
      // 如果有简历，默认选择第一个
      if (userResumes.value.length > 0 && userResumes.value[0].id) {
        selectedResumeId.value = userResumes.value[0].id
      }
      console.log('用户简历列表:', userResumes.value)
    }
  } catch (err) {
    console.error('获取用户简历出错:', err)
  }
}

// 显示申请模态框
const showApplicationModal = async () => {
  // 检查用户是否已登录
  const isLoggedIn = localStorage.getItem('token')
  if (!isLoggedIn) {
    // 如果未登录，重定向到登录页面
    alert('请先登录后再申请职位')
    // 保存当前URL，以便登录后返回
    localStorage.setItem('redirect_after_login', window.location.href)
    window.location.href = '/login'
    return
  }
  
  // 获取用户简历列表
  await fetchUserResumes()
  
  // 显示申请模态框
  applicationModalVisible.value = true
}

// 处理岗位申请提交
const handleApplicationSubmit = async (applicationData: any) => {
  if (!job.value) return
  
  applyLoading.value = true
  
  try {
    // 调用申请岗位API，传递 jobId 和 applicationData.resumeId
    const response = await applyJob(jobId, applicationData.resumeId)
    
    // 提交成功后关闭模态框
    applicationModalVisible.value = false
    
    // 显示成功提示
    showToast('申请成功提交，请等待企业查看')
  } catch (err) {
    console.error('申请岗位出错:', err)
    showToast(err instanceof Error ? err.message : '申请失败，请稍后再试')
  } finally {
    applyLoading.value = false
  }
}

async function startChatWithMentor() {
  if (!job.value?.postedByUser?.id) return
  try {
    const data = await apiRequest<any>(`/v1/chat/sessions?userId=${job.value.postedByUser.id}`, { method: 'POST' })
    if (data.code === 200 && data.data && data.data.id) {
      router.push({
        path: '/dashboard/student',
        query: { tab: 'chat', sessionId: data.data.id }
      })
    } else {
      alert(data.message || '发起聊天失败')
    }
  } catch (e: any) {
    alert(e.message || '发起聊天失败')
  }
}

onMounted(() => {
  fetchJobDetail()
  // 检查是否已收藏
  checkIfFavorited()
  // 获取推荐岗位
  fetchRecommendedJobs()
})
</script>

<style scoped>
.prose p {
  margin-bottom: 0.75rem;
}
</style> 