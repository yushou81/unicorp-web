<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <header class="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
      <div class="container mx-auto flex items-center justify-between h-16 px-4">
        <div class="flex items-center space-x-2">
          <img src="https://vitejs.dev/logo.svg" alt="logo" class="h-8 w-8" />
          <span class="font-bold text-xl text-blue-700">校企联盟平台</span>
        </div>
        <nav class="hidden md:flex space-x-6 text-gray-700 font-medium">
          <router-link to="/" class="hover:text-blue-600">首页</router-link>
          <router-link to="/project/list" class="hover:text-blue-600">项目对接</router-link>
          <router-link to="/job/list" class="hover:text-blue-600">人才招聘</router-link>
          <router-link to="/resource/research" class="hover:text-blue-600">资源共享</router-link>
          <router-link to="/student/achievement" class="hover:text-blue-600">成果展示</router-link>
        </nav>
        <div class="flex items-center space-x-2">
          <router-link to="/login">
            <button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">登录</button>
          </router-link>
          <router-link to="/register">
            <button class="px-4 py-1 rounded bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">注册</button>
          </router-link>
        </div>
      </div>
    </header>

    <!-- 横幅区 -->
    <section class="relative flex-1 flex items-center justify-center py-16 md:py-24">
      <div class="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            打造校企协作新生态
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
            校企联盟平台，打破信息壁垒，促进人才培养、科研合作、实习就业等多维度深度融合，实现教育链、人才链与产业链、创新链的有机衔接。
          </p>
          <router-link to="/project/list">
            <button class="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition">
              立即体验
            </button>
          </router-link>
        </div>
        <div class="flex-1 flex justify-center">
          <img src="https://assets.vvhan.com/2023/07/hero-hr.svg" alt="平台插画" class="w-80 md:w-[28rem] drop-shadow-xl" />
        </div>
      </div>
      <div class="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
    </section>

    <!-- 功能区 -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">核心功能</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="feature in features" :key="feature.title" class="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center group cursor-pointer">
          <div :class="`w-14 h-14 flex items-center justify-center rounded-full mb-4 text-white text-2xl ${feature.bg}`">
            <component :is="feature.icon" class="w-8 h-8" />
          </div>
          <h3 class="font-semibold text-lg mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 text-sm">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 平台优势区 -->
    <section class="bg-white py-12 border-t">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">平台优势</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="adv in advantages" :key="adv.title" class="flex flex-col items-center text-center">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              <component :is="adv.icon" class="w-6 h-6 text-blue-600" />
            </div>
            <h4 class="font-semibold text-base mb-1">{{ adv.title }}</h4>
            <p class="text-gray-500 text-sm">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-white border-t py-6 mt-8 text-center text-gray-500 text-sm">
      © 2024 校企联盟平台 | 联系方式：alliance@example.com
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Building2, FileText, Briefcase, GraduationCap, ShieldCheck, BarChart3, Users, Layers3, BookOpenCheck, Share2 } from 'lucide-vue-next'

const features = [
  {
    title: '项目对接',
    desc: '智能匹配校企合作项目，支持全周期管理与进度跟踪。',
    icon: Layers3,
    bg: 'bg-blue-500',
  },
  {
    title: '人才交流',
    desc: '实习就业、双师课堂、导师指导，促进人才培养与流动。',
    icon: Users,
    bg: 'bg-orange-500',
  },
  {
    title: '资源共享',
    desc: '科研设备、课程资源、知识产权等多维度资源共享与交易。',
    icon: Share2,
    bg: 'bg-green-500',
  },
  {
    title: '成果展示',
    desc: '学生作品、竞赛获奖、科研成果一站式展示与推广。',
    icon: BookOpenCheck,
    bg: 'bg-purple-500',
  },
]

const advantages = [
  {
    title: '多角色协作',
    desc: '支持管理员、学校、企业、教师、学生等多角色高效协作。',
    icon: Users,
  },
  {
    title: '安全合规',
    desc: '严格权限分级与日志审计，保障数据安全与合规。',
    icon: ShieldCheck,
  },
  {
    title: '智能推荐',
    desc: '基于大数据智能推荐项目、职位与资源，提升对接效率。',
    icon: BarChart3,
  },
  {
    title: '全流程管理',
    desc: '项目、经费、资源、成果全流程数字化管理。',
    icon: Building2,
  },
]
</script> 