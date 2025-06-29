<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <div class="container mx-auto px-4 py-6">
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
          <router-link to="/job" class="hover:text-blue-600">校招</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-700">职位详情页</span>
        </div>
        
        <!-- 职位标题区域 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                :src="job.logo || '/company-placeholder.png'" 
                alt="公司Logo" 
                class="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2 border border-gray-100"
              />
              <div class="text-sm text-gray-500 mt-2">{{ job.organizationName }}</div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-4 mt-6">
            <button class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center">
              <SendIcon class="w-4 h-4 mr-2" />
              立即申请
            </button>
            <button 
              @click="handleFavorite" 
              class="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
              :disabled="favoriteLoading"
            >
              <BookmarkIcon class="w-4 h-4 mr-2" />
              {{ favoriteLoading ? '收藏中...' : '收藏' }}
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
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧：职位详情 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileTextIcon class="w-5 h-5 mr-2 text-blue-600" />
                职位描述
              </h2>
              <div class="prose max-w-none text-gray-700">
                <p>{{ job.description }}</p>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
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
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <GiftIcon class="w-5 h-5 mr-2 text-blue-600" />
                福利待遇
              </h2>
              <div class="prose max-w-none text-gray-700">
                <div v-if="job.benefits" v-html="formatContentWithNumbers(job.benefits)"></div>
                <div v-else class="text-gray-500 italic">暂无详细福利待遇描述</div>
              </div>
            </div>
          </div>
          
          <!-- 右侧：公司信息和联系方式 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BuildingIcon class="w-5 h-5 mr-2 text-blue-600" />
                公司信息
              </h2>
              <div class="flex items-center mb-4">
                <img 
                  :src="job.logo || '/company-placeholder.png'" 
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
              
              <div class="mt-4 pt-4 border-t border-gray-100">
                <router-link :to="`/company/${job.organizationId}`" class="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <ExternalLinkIcon class="w-4 h-4 mr-1" />
                  查看公司主页
                </router-link>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
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
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
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
          </div>
        </div>
        
        <!-- 相似职位推荐 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <ListIcon class="w-5 h-5 mr-2 text-blue-600" />
            相似职位推荐
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div class="font-medium text-gray-900 mb-1">相似职位 {{ i }}</div>
              <div class="text-sm text-gray-500 mb-2">某某公司</div>
              <div class="text-blue-600 text-sm font-medium">15k-25k/月</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getJobDetail, Job, favoriteJob } from '@/lib/api/job'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
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
  List as ListIcon,
  ExternalLink as ExternalLinkIcon,
  Gift as GiftIcon
} from 'lucide-vue-next'

const route = useRoute()
const jobId = route.params.id as string

const job = ref<Job | null>(null)
const loading = ref(true)
const error = ref('')
const favoriteLoading = ref(false)
// Toast状态
const toast = ref({
  show: false,
  message: '',
  hiding: false
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
    const response = await favoriteJob(jobId)
    if (response.code === 200) {
      showToast('收藏成功')
    } else if (response.code === 400) {
      showToast('已经收藏过该岗位')
    } else {
      showToast(response.message || '收藏失败')
    }
  } catch (err) {
    console.error('收藏岗位出错:', err)
    if (err instanceof Error && err.message.includes('已收藏')) {
      showToast('已经收藏过该岗位')
    } else {
      showToast(err instanceof Error ? err.message : '收藏失败，请稍后再试')
    }
  } finally {
    favoriteLoading.value = false
  }
}

onMounted(() => {
  fetchJobDetail()
})
</script>

<style scoped>
.prose p {
  margin-bottom: 0.75rem;
}
</style> 