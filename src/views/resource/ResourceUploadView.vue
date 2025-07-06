<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="mb-6">
        <router-link to="/learn" class="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回资源列表
        </router-link>
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-6">上传资源</h1>
      
      <div class="bg-white rounded-xl shadow-lg p-8">
        <ResourceUploadForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResourceUploadForm from '@/components/resource/ResourceUploadForm.vue'
</script> 