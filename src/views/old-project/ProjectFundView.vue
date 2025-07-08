<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="bg-white rounded-xl shadow p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">经费管理</h2>
        <div class="mb-6">
          <h3 class="font-semibold mb-2">经费申请</h3>
          <form @submit.prevent="onApply">
            <div class="mb-2">
              <input v-model="amount" type="number" min="0" required class="w-full px-3 py-2 border rounded" placeholder="申请金额（元）" />
            </div>
            <div class="mb-2">
              <textarea v-model="reason" required class="w-full px-3 py-2 border rounded" placeholder="申请理由"></textarea>
            </div>
            <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">提交申请</button>
          </form>
        </div>
        <div class="mb-6">
          <h3 class="font-semibold mb-2">经费使用记录</h3>
          <ul class="text-sm text-gray-700 space-y-1">
            <li v-for="record in fundRecords" :key="record.id">
              <span class="text-gray-500">{{ record.date }}</span> - {{ record.amount }}元 - {{ record.status }}
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-2">经费统计</h3>
          <div class="text-gray-700">总申请：{{ totalApply }}元 | 已审批：{{ totalApproved }}元</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const amount = ref('')
const reason = ref('')
const fundRecords = [
  { id: 1, date: '2024-06-01', amount: 50000, status: '已审批' },
  { id: 2, date: '2024-06-10', amount: 20000, status: '待审批' }
]
const totalApply = 70000
const totalApproved = 50000
function onApply() {
  alert('经费申请已提交，等待审批！')
}
</script> 