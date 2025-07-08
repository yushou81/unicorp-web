<template>
    <div>
      <!-- 导航栏 -->
      <Navbar />
      
      <div class="container mx-auto px-6 py-12 max-w-7xl">
        <!-- 返回按钮 -->
        <button 
          @click="router.back()" 
          class="flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          返回成果列表
        </button>
        
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-r-transparent"></div>
          <span class="ml-2 text-gray-600">加载中...</span>
        </div>
        
        <div v-else-if="error" class="bg-red-50 text-red-600 p-6 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{{ error }}</p>
          <button 
            @click="fetchAchievementDetail()" 
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            重试
          </button>
        </div>
        
        <div v-else-if="achievement" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- 学生信息侧边栏 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-8 sticky top-8">
              <div class="flex flex-col items-center mb-8">
                <img 
                  :src="achievement.studentAvatarUrl || 'https://via.placeholder.com/100'" 
                  alt="学生头像" 
                  class="w-28 h-28 rounded-full border-4 border-blue-100 mb-5"
                />
                <h3 class="text-xl font-bold text-gray-900">{{ achievement.userName }}</h3>
                <p class="text-gray-600">{{ achievement.organizationName }}</p>
                <div class="mt-2 text-sm text-gray-500">{{ achievement.majorName }} {{ achievement.grade }}级</div>
                
                <div class="mt-4 flex space-x-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{{ achievement.studentType || '全日制' }}</span>
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{{ achievement.educationLevel || '本科' }}</span>
                </div>
              </div>
              
              <div class="border-t border-gray-100 pt-6 mt-8">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">联系方式</h4>
                <ul class="space-y-2">
                  <li v-if="achievement.studentEmail" class="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{{ achievement.studentEmail }}</span>
                  </li>
                  <li v-if="achievement.studentPhone" class="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{{ achievement.studentPhone }}</span>
                  </li>
                </ul>
                
                <div class="mt-8">
                  <button 
                    @click="contactStudent" 
                    class="w-full px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    联系学生
                  </button>
                  
                  <button 
                    @click="toggleFavorite" 
                    class="w-full mt-4 px-5 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    :class="{ 'border-yellow-400 text-yellow-600 bg-yellow-50 hover:bg-yellow-100': isFavorited }"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" :class="{ 'text-yellow-500': isFavorited }" :fill="isFavorited ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {{ isFavorited ? '已收藏' : '收藏' }}
                  </button>
                </div>
              </div>
              
              <div class="border-t border-gray-100 pt-6 mt-8">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">学生能力标签</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(tag, index) in studentTags" 
                    :key="index"
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 成果详细内容 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-10 mb-10">
              <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-900">{{ achievement.title }}</h1>
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="getTypeClass(achievement.type)"
                >
                  {{ getTypeText(achievement.type) }}
                </span>
              </div>
              
              <div class="mb-10">
                <div class="flex items-center text-gray-500 text-sm mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  发布日期：{{ formatDate(achievement.createdAt) }}
                  
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  浏览次数：{{ achievement.viewCount || 0 }}
                  
                  <span v-if="achievement.likeCount !== undefined" class="ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    点赞数：{{ achievement.likeCount }}
                  </span>
                  
                  <span v-if="achievement.isVerified !== undefined" class="ml-4">
                    <span class="px-2 py-0.5 rounded-full text-xs" 
                          :class="achievement.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ achievement.isVerified ? '已认证' : '待认证' }}
                    </span>
                  </span>
                </div>
                
                <div class="prose max-w-none">
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ achievement.description }}</p>
                </div>
              </div>
               <div class="mt-8 border-t pt-6">
                <button 
                  @click="likeAchievement" 
                  :disabled="isLiked"
                  class="w-full max-w-xs mx-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.331V10h3.53a2 2 0 011.831 1.189L14 15.331V10zM7 21a2 2 0 01-2-2v-7a2 2 0 012-2h2.086a2 2 0 011.664.89l.812 1.22A2 2 0 0013.086 10H7z" />
                  </svg>
                  {{ isLiked ? '已点赞' : '点赞此成果' }}
                </button>
              </div>
              
              <!-- 作品类型特定内容 -->
              <div v-if="achievement.type === 'portfolio'" class="mb-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6">作品信息</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div v-if="achievement.projectUrl" class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">作品链接</p>
                    <a :href="achievement.projectUrl" target="_blank" class="text-blue-600 hover:underline flex items-center">
                      {{ achievement.projectUrl }}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  
                  <div v-if="achievement.teamMembers" class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">团队成员</p>
                    <p>{{ achievement.teamMembers }}</p>
                  </div>
                  
                  <div v-if="achievement.category" class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">作品分类</p>
                    <p>{{ achievement.category }}</p>
                  </div>
                  
                  <div v-if="achievement.tags && achievement.tags.length" class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">标签</p>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="tag in achievement.tags" 
                        :key="tag"
                        class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 获奖类型特定内容 -->
              <div v-if="achievement.type === 'award'" class="mb-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6">获奖信息</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">竞赛名称</p>
                    <p>{{ achievement.competitionName }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">奖项名称</p>
                    <p>{{ achievement.awardName || achievement.awardLevel }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">获奖日期</p>
                    <p>{{ formatDate(achievement.awardDate) }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">颁发单位</p>
                    <p>{{ achievement.organizer || '未提供' }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">获奖级别</p>
                    <p>{{ achievement.awardLevel }}</p>
                  </div>
                  
                  <div v-if="achievement.teamMembers" class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">参与者</p>
                    <p>{{ achievement.teamMembers }}</p>
                  </div>
                </div>
              </div>
              
              <!-- 科研类型特定内容 -->
              <div v-if="achievement.type === 'research'" class="mb-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6">科研成果信息</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">类型</p>
                    <p>{{ getResearchTypeText(achievement.researchType) }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">作者</p>
                    <p>{{ achievement.authors }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">发表日期</p>
                    <p>{{ formatDate(achievement.publicationDate) }}</p>
                  </div>
                  
                  <div v-if="achievement.publisher" class="mb-4">
                    <p class="text-sm font-medium text-gray-600 mb-1">发表机构/期刊</p>
                    <p>{{ achievement.publisher }}</p>
                  </div>
                </div>
              </div>
              
              <!-- 附件和资源 -->
              <div v-if="achievement.resources && achievement.resources.length" class="mb-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6">相关资源</h2>
                
                <div class="space-y-4">
                  <div 
                    v-for="resource in achievement.resources" 
                    :key="resource.id"
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p class="font-medium text-gray-800">{{ resource.originalFileName || resource.resourceName || '资源文件' }}</p>
                        <p class="text-xs text-gray-500">{{ resource.description || resource.resourceType }}</p>
                      </div>
                    </div>
                    
                    <a 
                      :href="resource.resourceUrl" 
                      target="_blank" 
                      class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      下载
                    </a>
                  </div>
                </div>
              </div>
              
              <!-- 证书图片 -->
              <div v-if="achievement.certificateUrl" class="mb-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6">证书</h2>
                <img 
                  :src="achievement.certificateUrl" 
                  alt="证书" 
                  class="max-w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
              
              <!-- 封面图片 -->
              <div v-if="achievement.coverImageUrl" class="mb-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6">封面图片</h2>
                <img 
                  :src="achievement.coverImageUrl" 
                  alt="封面图片" 
                  class="max-w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
              
              <!-- 认证信息 -->
              <div v-if="achievement.isVerified" class="mb-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6">认证信息</h2>
                <div class="space-y-2">
                  <div class="flex">
                    <span class="w-24 text-gray-500">认证人</span>
                    <span class="text-gray-800">{{ achievement.verifierName || '未知' }}</span>
                  </div>
                  <div class="flex">
                    <span class="w-24 text-gray-500">认证时间</span>
                    <span class="text-gray-800">{{ formatDate(achievement.verifyDate) || '未知' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Navbar from '@/components/layout/Navbar.vue'
  import { 
    portfolioApi, 
    competitionAwardApi, 
    researchApi,
    type AchievementType
  } from '@/lib/api/achievement';

  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const error = ref('')
  const achievement = ref<any>(null)
  const isFavorited = ref(false)
  const rating = ref(0)
  const comment = ref('')
  const isLiked = ref(false);

  // 学生能力标签（实际应该来自后端）
  const studentTags = ref(['UI/UX 设计', 'Vue.js', '产品思维', '项目管理']); // 示例
  
  // 获取成果ID和类型
  const achievementId = computed(() => Number(route.params.id));
  const achievementType = computed(() => route.params.type as AchievementType)
  
  // 获取成果详情
  const fetchAchievementDetail = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const id = achievementId.value
      if (!id) {
        error.value = '无效的成果ID'
        return
      }

      let response
      switch (achievementType.value) {
        case 'award':
          response = await competitionAwardApi.getAwardDetail(id)
          break
        case 'portfolio':
          response = await portfolioApi.getPortfolioItemDetail(id)
          break
        case 'research':
          response = await researchApi.getResearchById(id)
          break
        default:
          throw new Error('不支持的成果类型')
      }
      
      if (response && response.data) {
        achievement.value = {
          ...response.data,
          type: achievementType.value
        }
        
        // 查询是否已收藏
        checkFavoriteStatus()
      } else {
        error.value = '无法获取成果详情'
      }
    } catch (err: any) {
      console.error('获取成果详情失败:', err)
      error.value = '获取成果详情失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }
  
  // 检查收藏状态
  const checkFavoriteStatus = async () => {
    try {
      // 这里应该调用实际的API
      // const response = await achievementApi.checkFavoriteStatus(achievementId.value)
      // isFavorited.value = response.data || false
      isFavorited.value = false
    } catch (err) {
      console.error('检查收藏状态失败:', err)
      isFavorited.value = false
    }
  }

  // 切换收藏状态
  const toggleFavorite = async () => {
    try {
      // 这里应该调用实际的API
      // if (isFavorited.value) {
      //   await achievementApi.unfavoriteAchievement(achievementId.value)
      // } else {
      //   await achievementApi.favoriteAchievement(achievementId.value)
      // }
      
      isFavorited.value = !isFavorited.value
    } catch (err) {
      console.error('切换收藏状态失败:', err)
      alert('操作失败，请稍后重试')
    }
  }

  const likeAchievement = async () => {
    if (isLiked.value || !achievementId.value) return;
    try {
      await portfolioApi.likeAchievement(achievementId.value);
      isLiked.value = true;
      if (achievement.value) {
        achievement.value.likeCount = (achievement.value.likeCount || 0) + 1;
      }
      // 可以添加一个提示，例如使用 alert 或更复杂的通知组件
      alert('点赞成功！');
    } catch (err) {
      console.error('点赞失败:', err);
      alert('点赞失败，请稍后再试。');
    }
  };
  
  // 联系学生
  const contactStudent = () => {
    if (!achievement.value?.studentEmail && !achievement.value?.studentPhone) {
      alert('该学生未提供联系方式')
      return
    }
    
    const mailtoLink = achievement.value?.studentEmail ? 
      `mailto:${achievement.value.studentEmail}?subject=关于您的成果"${achievement.value.title}"` : null
    
    if (mailtoLink) {
      window.open(mailtoLink)
    } else if (achievement.value?.studentPhone) {
      alert(`请联系学生电话: ${achievement.value.studentPhone}`)
    }
  }
  
  // 提交评价
  const submitComment = async () => {
    if (!rating.value || !comment.value) return
    
    try {
      // 这里应该调用实际的API
      // await achievementApi.rateAchievement(achievementId.value, {
      //   rating: rating.value,
      //   comment: comment.value
      // })
      
      alert('评价提交成功！')
      rating.value = 0
      comment.value = ''
    } catch (err) {
      console.error('提交评价失败:', err)
      alert('评价提交失败，请稍后重试')
    }
  }
  
  // 获取成果类型显示文本
  const getTypeText = (type: AchievementType) => {
    const typeMap = {
      'portfolio': '作品',
      'award': '获奖',
      'research': '科研'
    }
    return typeMap[type] || '其他'
  }
  
  // 获取成果类型样式
  const getTypeClass = (type: AchievementType) => {
    const classMap = {
      'portfolio': 'bg-green-100 text-green-800',
      'award': 'bg-yellow-100 text-yellow-800',
      'research': 'bg-indigo-100 text-indigo-800'
    }
    return classMap[type] || 'bg-gray-100 text-gray-800'
  }
  
  // 获取科研成果类型显示文本
  const getResearchTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'paper': '论文',
      'patent': '专利',
      'book': '著作',
      'other': '其他'
    };
    return typeMap[type] || '其他';
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }
  
  onMounted(() => {
    fetchAchievementDetail()
  })
  </script>