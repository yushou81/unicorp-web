<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>
      
      <template v-else-if="course">
        <!-- 面包屑导航 -->
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <router-link to="/" class="hover:text-blue-600">首页</router-link>
          <span class="mx-2">/</span>
          <router-link to="/classroom" class="hover:text-blue-600">双师课堂</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-700">课程详情</span>
        </div>
        
        <!-- 课程标题区域 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-1/3">
              <img :src="course.coverImage" :alt="course.title" class="w-full h-64 object-cover rounded-lg" />
            </div>
            <div class="md:w-2/3">
              <div class="flex justify-between items-start">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ course.title }}</h1>
                <span 
                  :class="getStatusClass(course.status)" 
                  class="text-xs px-2 py-1 rounded-full"
                >
                  {{ getStatusText(course.status) }}
                </span>
              </div>
              
              <p class="text-gray-600 mb-4">{{ course.description }}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div class="text-sm text-gray-500">开课时间</div>
                    <div class="font-medium">{{ formatDate(course.startDate) }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div class="text-sm text-gray-500">结课时间</div>
                    <div class="font-medium">{{ formatDate(course.endDate) }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <div class="text-sm text-gray-500">授课讲师</div>
                    <div class="font-medium">{{ course.teacherName }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div class="text-sm text-gray-500">合作企业</div>
                    <div class="font-medium">{{ course.enterpriseName }}</div>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center mb-6">
                <span 
                  :class="getModeClass(course.mode)" 
                  class="text-xs px-2 py-1 rounded-full mr-2"
                >
                  {{ getModeText(course.mode) }}
                </span>
                <span 
                  :class="getCategoryClass(course.category)" 
                  class="text-xs px-2 py-1 rounded-full"
                >
                  {{ getCategoryText(course.category) }}
                </span>
              </div>
              
              <div class="flex space-x-4">
                <button 
                  @click="enrollCourse" 
                  :disabled="course.status === 'completed' || isEnrolled"
                  :class="[
                    'px-6 py-2 rounded-lg transition-colors flex items-center',
                    (course.status === 'completed' || isEnrolled) 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {{ isEnrolled ? '已报名' : '立即报名' }}
                </button>
                <button class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 课程详情和教师信息 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧：课程详情 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">课程介绍</h2>
              <div class="prose max-w-none text-gray-700">
                <p>{{ course.description }}</p>
                <p>{{ course.longDescription }}</p>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">课程大纲</h2>
              <div class="space-y-4">
                <div v-for="(chapter, index) in course.chapters" :key="index" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="font-medium text-gray-900">第{{ index + 1 }}章：{{ chapter.title }}</h3>
                    <span class="text-sm text-gray-500">{{ chapter.duration }}</span>
                  </div>
                  <p class="text-gray-600 text-sm">{{ chapter.description }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">课程评价</h2>
              <div v-if="course.reviews && course.reviews.length > 0" class="space-y-4">
                <div v-for="(review, index) in course.reviews" :key="index" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center">
                      <img :src="review.avatar" :alt="review.name" class="w-8 h-8 rounded-full mr-2" />
                      <span class="font-medium text-gray-900">{{ review.name }}</span>
                    </div>
                    <div class="flex items-center">
                      <div class="flex">
                        <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="[
                          'h-4 w-4',
                          i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        ]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span class="text-sm text-gray-500 ml-2">{{ formatDate(review.date) }}</span>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ review.comment }}</p>
                </div>
              </div>
              <div v-else class="text-gray-500 italic">暂无评价</div>
            </div>
          </div>
          
          <!-- 右侧：教师信息 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">讲师信息</h2>
              <div class="flex items-center mb-4">
                <img :src="course.teacherAvatar || 'https://randomuser.me/api/portraits/men/32.jpg'" alt="讲师头像" class="w-16 h-16 rounded-full mr-4 object-cover" />
                <div>
                  <div class="font-medium text-gray-900">{{ course.teacherName }}</div>
                  <div class="text-sm text-gray-500">{{ course.teacherTitle || '高校教师 & 企业导师' }}</div>
                </div>
              </div>
              <p class="text-gray-600 text-sm">{{ course.teacherBio || '双师型教师，拥有丰富的教学经验和行业实践经验，致力于培养学生的理论知识和实践能力。' }}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">企业信息</h2>
              <div class="flex items-center mb-4">
                <img :src="course.enterpriseLogo || 'https://via.placeholder.com/80'" alt="企业Logo" class="w-16 h-16 rounded-lg mr-4 object-contain bg-gray-50 p-2" />
                <div>
                  <div class="font-medium text-gray-900">{{ course.enterpriseName }}</div>
                  <div class="text-sm text-gray-500">{{ course.enterpriseIndustry || getCategoryText(course.category) }}</div>
                </div>
              </div>
              <p class="text-gray-600 text-sm">{{ course.enterpriseDesc || '合作企业致力于校企合作，为学生提供实践机会和就业渠道，共同培养符合行业需求的高素质人才。' }}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">课程信息</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">课程人数</div>
                  <div class="font-medium">{{ course.enrollCount || 0 }}人</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">课程评分</div>
                  <div class="flex items-center">
                    <div class="flex">
                      <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="[
                        'h-4 w-4',
                        i <= (course.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'
                      ]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-1 text-yellow-500 font-medium">{{ course.rating || 4.5 }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">课程类型</div>
                  <div class="font-medium">{{ getCategoryText(course.category) }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">授课方式</div>
                  <div class="font-medium">{{ getModeText(course.mode) }}</div>
                </div>
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
    
    <!-- Toast提示 -->
    <div v-if="toast.show" class="fixed top-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300" :class="{'opacity-0': toast.hiding, 'opacity-100': !toast.hiding}">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

// 定义课程接口
interface Course {
  id: number
  title: string
  description: string
  longDescription?: string
  coverImage: string
  teacherName: string
  teacherAvatar?: string
  teacherTitle?: string
  teacherBio?: string
  enterpriseName: string
  enterpriseLogo?: string
  enterpriseIndustry?: string
  enterpriseDesc?: string
  status: string // upcoming, ongoing, completed
  mode: string // online, offline, hybrid
  startDate: string
  endDate: string
  category: string
  enrollCount?: number
  rating?: number
  chapters?: Chapter[]
  reviews?: Review[]
}

interface Chapter {
  title: string
  description: string
  duration: string
}

interface Review {
  name: string
  avatar: string
  rating: number
  date: string
  comment: string
}

const route = useRoute()
const router = useRouter()
const courseId = route.params.id as string

const loading = ref(true)
const error = ref('')
const course = ref<Course | null>(null)
const isEnrolled = ref(false)

// Toast状态
const toast = ref({
  show: false,
  message: '',
  hiding: false
})

// 模拟课程详情数据
const mockCourseDetails: Record<string, Course> = {
  '1': {
    id: 1,
    title: 'Web前端开发实战',
    description: '本课程由企业资深前端工程师与高校教师共同授课，涵盖HTML5、CSS3、JavaScript等核心技术，以及React、Vue等主流框架的实战应用。',
    longDescription: '本课程旨在培养学生成为全面的前端开发工程师，通过理论与实践相结合的方式，深入学习现代前端开发技术栈。课程内容包括HTML5新特性、CSS3动画与响应式设计、JavaScript ES6+语法、TypeScript基础、React和Vue框架实战、前端工程化与性能优化等。\n\n高校教师将系统讲解前端开发的理论基础和技术原理，企业工程师将分享一线开发经验和最佳实践，并指导学生完成实际项目开发。通过双师联合授课模式，帮助学生既掌握扎实的理论知识，又具备解决实际问题的能力。',
    coverImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '张教授 & 李工程师',
    teacherAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    teacherTitle: '计算机科学教授 & 前端技术总监',
    teacherBio: '张教授拥有计算机科学博士学位，在高校从教15年，研究方向为Web技术与人机交互。李工程师是知名互联网公司前端技术总监，拥有10年以上大型项目开发经验，主导过多个百万级用户产品的前端架构设计。',
    enterpriseName: '科技创新有限公司',
    enterpriseLogo: 'https://via.placeholder.com/80?text=Tech',
    enterpriseIndustry: '互联网技术',
    enterpriseDesc: '科技创新有限公司是一家专注于Web应用和移动应用开发的技术公司，为众多知名企业提供技术解决方案，在前端开发领域拥有丰富的项目经验和技术积累。',
    status: 'upcoming',
    mode: 'hybrid',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    category: 'technology',
    enrollCount: 45,
    rating: 4.8,
    chapters: [
      {
        title: 'HTML5与CSS3基础',
        description: '学习HTML5新特性和CSS3高级选择器、动画、过渡等',
        duration: '12课时'
      },
      {
        title: 'JavaScript核心与ES6+',
        description: '深入JavaScript核心概念，掌握ES6+新特性',
        duration: '16课时'
      },
      {
        title: 'React框架实战',
        description: 'React基础、Hooks、状态管理、路由和性能优化',
        duration: '14课时'
      },
      {
        title: 'Vue框架实战',
        description: 'Vue3核心概念、组合式API、Vuex和Vue Router',
        duration: '14课时'
      },
      {
        title: '前端工程化与性能优化',
        description: 'Webpack、Vite、CI/CD、性能监控与优化',
        duration: '10课时'
      },
      {
        title: '综合项目实战',
        description: '结合企业真实需求，完成一个完整的前端项目',
        duration: '18课时'
      }
    ],
    reviews: [
      {
        name: '王同学',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        rating: 5,
        date: '2024-05-20',
        comment: '课程内容非常丰富，理论与实践结合得很好。特别是企业导师分享的实战经验非常有价值，让我对前端开发有了更深入的理解。'
      },
      {
        name: '李同学',
        avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
        rating: 4,
        date: '2024-05-15',
        comment: '老师讲解清晰，项目实战部分很有挑战性，学到了很多在学校里学不到的实用技能。'
      },
      {
        name: '张同学',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 5,
        date: '2024-05-10',
        comment: '双师授课模式很棒，既有理论知识的系统讲解，又有企业实战经验的分享，收获很大。'
      }
    ]
  },
  '2': {
    id: 2,
    title: 'UI/UX设计与用户体验',
    description: '由知名设计公司设计总监与高校设计学院教授共同打造的设计课程，从理论到实践，全面提升学生的设计思维和实战能力。',
    longDescription: '本课程聚焦于现代UI/UX设计理念和方法，旨在培养学生成为兼具美学素养和用户体验思维的设计师。课程内容包括设计原则与理论、用户研究与分析、信息架构、交互设计、视觉设计、原型设计与测试等。\n\n高校教授将系统讲解设计理论和方法论，企业设计总监将分享行业最新趋势和实战案例，指导学生完成真实项目设计。通过理论学习与实践项目相结合，帮助学生掌握从用户需求分析到最终设计实现的完整流程。',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHVpJTIwZGVzaWdufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '王教授 & 陈设计师',
    teacherAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    teacherTitle: '视觉传达设计教授 & UI设计总监',
    teacherBio: '王教授是设计学院视觉传达设计系主任，拥有20年教学经验，著有多部设计理论专著。陈设计师是知名互联网公司UI设计总监，曾主导多个用户过千万的产品界面设计，获得国内外多项设计大奖。',
    enterpriseName: '创意设计工作室',
    enterpriseLogo: 'https://via.placeholder.com/80?text=Design',
    enterpriseIndustry: '创意设计',
    enterpriseDesc: '创意设计工作室是一家专注于用户体验和界面设计的创意机构，为众多知名品牌提供设计服务，作品多次获得国际设计大奖。',
    status: 'ongoing',
    mode: 'online',
    startDate: '2024-06-01',
    endDate: '2024-08-30',
    category: 'design',
    enrollCount: 38,
    rating: 4.7,
    chapters: [
      {
        title: '设计原则与理论基础',
        description: '色彩理论、排版原则、视觉层次等设计基础',
        duration: '10课时'
      },
      {
        title: '用户研究与分析',
        description: '用户画像、用户旅程、可用性测试等研究方法',
        duration: '12课时'
      },
      {
        title: '信息架构与交互设计',
        description: '内容组织、导航设计、交互模式等',
        duration: '14课时'
      },
      {
        title: 'UI设计系统与规范',
        description: '设计系统构建、组件设计、设计规范制定',
        duration: '12课时'
      },
      {
        title: '原型设计与测试',
        description: '低保真原型、高保真原型、原型测试与迭代',
        duration: '10课时'
      },
      {
        title: '设计项目实战',
        description: '完成一个完整的UI/UX设计项目',
        duration: '16课时'
      }
    ],
    reviews: [
      {
        name: '赵同学',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        rating: 5,
        date: '2024-06-20',
        comment: '课程内容非常丰富，理论与实践结合得很好。特别是企业导师分享的实战经验非常有价值。'
      },
      {
        name: '钱同学',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 4,
        date: '2024-06-15',
        comment: '老师讲解清晰，项目实战部分很有挑战性，学到了很多在学校里学不到的实用技能。'
      }
    ]
  }
}

// 获取课程详情
const fetchCourseDetail = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 从模拟数据中获取课程详情
    const courseDetail = mockCourseDetails[courseId]
    
    if (courseDetail) {
      course.value = courseDetail
      
      // 检查是否已报名
      checkEnrollmentStatus()
    } else {
      error.value = '未找到课程信息'
    }
  } catch (err) {
    console.error('获取课程详情失败:', err)
    error.value = err instanceof Error ? err.message : '获取课程详情失败'
  } finally {
    loading.value = false
  }
}

// 检查是否已报名
const checkEnrollmentStatus = () => {
  // 模拟从localStorage获取已报名课程ID
  const enrolledCourses = localStorage.getItem('enrolledCourses')
  if (enrolledCourses) {
    try {
      const enrolledIds = JSON.parse(enrolledCourses) as number[]
      isEnrolled.value = enrolledIds.includes(Number(courseId))
    } catch (e) {
      console.error('解析已报名课程数据失败:', e)
    }
  }
}

// 报名课程
const enrollCourse = () => {
  if (!course.value) return
  
  // 检查课程状态
  if (course.value.status === 'completed') {
    showToast('该课程已结束，无法报名')
    return
  }
  
  // 检查是否已报名
  if (isEnrolled.value) {
    showToast('您已报名该课程')
    return
  }
  
  // 模拟报名操作
  try {
    // 获取已报名课程ID
    let enrolledIds: number[] = []
    const enrolledCourses = localStorage.getItem('enrolledCourses')
    
    if (enrolledCourses) {
      try {
        enrolledIds = JSON.parse(enrolledCourses) as number[]
      } catch (e) {
        console.error('解析已报名课程数据失败:', e)
      }
    }
    
    // 添加当前课程ID
    if (!enrolledIds.includes(course.value.id)) {
      enrolledIds.push(course.value.id)
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledIds))
    }
    
    // 更新状态
    isEnrolled.value = true
    
    // 更新课程报名人数
    if (course.value.enrollCount !== undefined) {
      course.value.enrollCount += 1
    } else {
      course.value.enrollCount = 1
    }
    
    showToast('报名成功')
  } catch (err) {
    console.error('报名失败:', err)
    showToast('报名失败，请稍后再试')
  }
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

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取状态文本
const getStatusText = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return '即将开始'
    case 'ongoing':
      return '进行中'
    case 'completed':
      return '已结束'
    default:
      return '未知状态'
  }
}

// 获取状态样式类
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700'
    case 'ongoing':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 获取授课方式文本
const getModeText = (mode: string): string => {
  switch (mode) {
    case 'online':
      return '线上授课'
    case 'offline':
      return '线下授课'
    case 'hybrid':
      return '线上+线下'
    default:
      return '未知方式'
  }
}

// 获取授课方式样式类
const getModeClass = (mode: string): string => {
  switch (mode) {
    case 'online':
      return 'bg-indigo-100 text-indigo-700'
    case 'offline':
      return 'bg-orange-100 text-orange-700'
    case 'hybrid':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 获取课程类别文本
const getCategoryText = (category: string): string => {
  switch (category) {
    case 'technology':
      return '技术开发'
    case 'design':
      return '设计创意'
    case 'management':
      return '管理营销'
    case 'finance':
      return '金融财会'
    case 'other':
      return '其他'
    default:
      return '未知类别'
  }
}

// 获取课程类别样式类
const getCategoryClass = (category: string): string => {
  switch (category) {
    case 'technology':
      return 'bg-blue-50 text-blue-600'
    case 'design':
      return 'bg-pink-50 text-pink-600'
    case 'management':
      return 'bg-green-50 text-green-600'
    case 'finance':
      return 'bg-yellow-50 text-yellow-600'
    case 'other':
      return 'bg-gray-50 text-gray-600'
    default:
      return 'bg-gray-50 text-gray-600'
  }
}

onMounted(() => {
  fetchCourseDetail()
})
</script>

<style scoped>
.prose p {
  margin-bottom: 0.75rem;
}
</style> 