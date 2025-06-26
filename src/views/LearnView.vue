<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">在线学习</h1>
        <p class="text-xl text-gray-600">
          培训报名、智选课堂、学习记录
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 课程列表 -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>推荐课程</CardTitle>
              <CardDescription>精选优质培训课程</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  v-for="course in courses" 
                  :key="course.id"
                  class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <GraduationCap class="w-16 h-16 text-white" />
                  </div>
                  <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2">{{ course.title }}</h3>
                    <p class="text-gray-600 text-sm mb-3">{{ course.description }}</p>
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-500">{{ course.duration }}</span>
                      <Button size="sm">立即报名</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 学习进度 -->
          <Card>
            <CardHeader>
              <CardTitle>我的学习</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span>学习进度</span>
                  <span class="font-semibold">75%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
                </div>
                <div class="text-sm text-gray-500">
                  已完成 3/4 门课程
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- 学习记录 -->
          <Card>
            <CardHeader>
              <CardTitle>最近学习</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div 
                  v-for="record in learningRecords" 
                  :key="record.id"
                  class="flex items-center space-x-3"
                >
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ record.course }}</p>
                    <p class="text-xs text-gray-500">{{ record.date }}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GraduationCap } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

const courses = [
  {
    id: 1,
    title: "Vue.js 开发实战",
    description: "从零开始学习Vue.js框架，掌握现代前端开发技能",
    duration: "20小时"
  },
  {
    id: 2,
    title: "React 进阶课程",
    description: "深入学习React核心概念和高级特性",
    duration: "25小时"
  },
  {
    id: 3,
    title: "TypeScript 基础",
    description: "学习TypeScript类型系统和最佳实践",
    duration: "15小时"
  },
  {
    id: 4,
    title: "Node.js 后端开发",
    description: "使用Node.js构建高性能后端服务",
    duration: "30小时"
  }
]

const learningRecords = [
  { id: 1, course: "Vue.js 开发实战", date: "2024-01-15" },
  { id: 2, course: "React 进阶课程", date: "2024-01-14" },
  { id: 3, course: "TypeScript 基础", date: "2024-01-13" }
]
</script> 