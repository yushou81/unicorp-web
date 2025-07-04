<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">业务申报</h1>
        <p class="text-xl text-gray-600">
          资金补贴、培训补贴、社保补贴申报
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          v-for="type in applicationTypes" 
          :key="type.title"
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="selectType(type)"
        >
          <CardHeader>
            <div :class="`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-4`">
              <component :is="type.icon" class="w-6 h-6 text-white" />
            </div>
            <CardTitle>{{ type.title }}</CardTitle>
            <CardDescription>{{ type.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button class="w-full">开始申报</Button>
          </CardContent>
        </Card>
      </div>

      <div class="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>我的申报记录</CardTitle>
            <CardDescription>查看历史申报记录和状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div 
                v-for="record in applicationRecords" 
                :key="record.id"
                class="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 class="font-medium">{{ record.title }}</h3>
                  <p class="text-sm text-gray-500">{{ record.date }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getStatusClass(record.status)">{{ record.status }}</span>
                  <Button variant="outline" size="sm">查看详情</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DollarSign, GraduationCap, Shield } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

const applicationTypes = [
  {
    title: "资金补贴",
    description: "企业资金补贴申请",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    title: "培训补贴",
    description: "员工培训补贴申请",
    icon: GraduationCap,
    color: "bg-blue-500",
  },
  {
    title: "社保补贴",
    description: "社会保险补贴申请",
    icon: Shield,
    color: "bg-purple-500",
  },
]

const applicationRecords = [
  { id: 1, title: "资金补贴申请", date: "2024-01-15", status: "审核中" },
  { id: 2, title: "培训补贴申请", date: "2024-01-10", status: "已通过" },
  { id: 3, title: "社保补贴申请", date: "2024-01-05", status: "已拒绝" },
]

const selectType = (type: any) => {
  console.log('选择申报类型:', type.title)
}

const getStatusClass = (status: string) => {
  const classes = {
    '审核中': 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
    '已通过': 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
    '已拒绝': 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs',
  }
  return classes[status as keyof typeof classes] || ''
}
</script> 