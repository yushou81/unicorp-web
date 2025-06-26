<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">招聘系统</h1>
        <p class="text-xl text-gray-600">
          求职招聘、人才匹配、数据统计
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 职位列表 -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>最新职位</CardTitle>
              <CardDescription>查看最新发布的职位信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div 
                  v-for="job in jobs" 
                  :key="job.id"
                  class="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="font-semibold text-lg">{{ job.title }}</h3>
                      <p class="text-gray-600 mb-2">{{ job.company }}</p>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{{ job.location }}</span>
                        <span>{{ job.salary }}</span>
                        <span>{{ job.type }}</span>
                      </div>
                      <p class="text-gray-700 mt-2">{{ job.description }}</p>
                    </div>
                    <router-link :to="`/job/${job.id}`">
                      <Button size="sm">申请职位</Button>
                    </router-link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 搜索框 -->
          <Card>
            <CardHeader>
              <CardTitle>搜索职位</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <input 
                  type="text" 
                  placeholder="职位名称或关键词"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="text" 
                  placeholder="工作地点"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button class="w-full">搜索</Button>
              </div>
            </CardContent>
          </Card>

          <!-- 统计数据 -->
          <Card>
            <CardHeader>
              <CardTitle>招聘统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span>发布职位</span>
                  <span class="font-semibold">156</span>
                </div>
                <div class="flex justify-between">
                  <span>求职者</span>
                  <span class="font-semibold">1,234</span>
                </div>
                <div class="flex justify-between">
                  <span>成功匹配</span>
                  <span class="font-semibold">89</span>
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
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

const jobs = [
  {
    id: 1,
    title: "前端开发工程师",
    company: "某某科技有限公司",
    location: "北京",
    salary: "15k-25k",
    type: "全职",
    description: "负责公司产品的前端开发工作，要求熟悉Vue.js、React等前端框架..."
  },
  {
    id: 2,
    title: "产品经理",
    company: "某某互联网公司",
    location: "上海",
    salary: "20k-35k",
    type: "全职",
    description: "负责产品规划、需求分析、用户体验设计等工作..."
  },
  {
    id: 3,
    title: "UI设计师",
    company: "某某设计公司",
    location: "深圳",
    salary: "12k-20k",
    type: "全职",
    description: "负责产品界面设计、视觉设计、交互设计等工作..."
  },
]
</script> 