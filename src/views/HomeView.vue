<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 横幅区 - 使用独立的背景渐变 -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeroBanner 
        title="打造校企协作新生态"
        description="校企联盟平台，打破信息壁垒，促进人才培养、科研合作、实习就业等多维度深度融合，实现教育链、人才链与产业链、创新链的有机衔接。"
        ctaText="立即体验"
        ctaLink="/project/list"
        imageUrl="https://assets.vvhan.com/2023/07/hero-hr.svg"
        imageAlt="平台插画"
      />
    </div>

    <!-- 功能区 -->
    <FeatureSection 
      title="核心功能"
      :features="features"
    />

    <!-- 平台优势区 -->
    <AdvantageSection 
      title="平台优势"
      :advantages="advantages"
    />

    <!-- 页脚 -->
    <Footer 
      copyright="© 2024 校企联盟平台"
      contactInfo="联系方式：alliance@example.com"
    />
  </div>
</template>

<script setup lang="ts">
import { Building2, FileText, Briefcase, GraduationCap, ShieldCheck, BarChart3, Users, Layers3, BookOpenCheck, Share2 } from 'lucide-vue-next'
import Navbar from '@/components/layout/Navbar.vue'
import HeroBanner from '@/components/home/HeroBanner.vue'
import FeatureSection from '@/components/home/FeatureSection.vue'
import AdvantageSection from '@/components/home/AdvantageSection.vue'
import Footer from '@/components/layout/Footer.vue'

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