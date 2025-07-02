<template>
  <div class="bg-white rounded-2xl shadow-lg p-8 mb-10">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-blue-700">我发布的岗位</h2>
      <button @click="$emit('create-job')" class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">创建新岗位</button>
    </div>
    <GridJobList
      :jobs="jobs"
      :loading="jobsLoading"
      :totalJobs="totalJobs"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :showEdit="true"
      @update:currentPage="$emit('update:currentPage', $event)"
      @update:sortBy="$emit('update:sortBy', $event)"
      @edit="$emit('edit-job', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import GridJobList from '@/components/job/GridJobList.vue'
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  jobs: Array,
  jobsLoading: Boolean,
  totalJobs: Number,
  currentPage: Number,
  totalPages: Number
})
const emit = defineEmits(['create-job', 'update:currentPage', 'update:sortBy', 'edit-job'])
</script> 