<template>
  <header class="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-20">
    <div class="container mx-auto flex items-center justify-between h-16 px-4">
      <div class="flex items-center space-x-2">
        <img src="https://vitejs.dev/logo.svg" alt="logo" class="h-8 w-8" />
        <span class="font-bold text-xl text-blue-700">校企联盟平台</span>
      </div>
      <nav class="hidden md:flex space-x-6 text-gray-700 font-medium">
        <router-link to="/" class="hover:text-blue-600 transition">首页</router-link>
        <router-link to="/project/list" class="hover:text-blue-600 transition">项目对接</router-link>
        <router-link to="/job" class="hover:text-blue-600 transition">人才招聘</router-link>
        <router-link to="/resource/research" class="hover:text-blue-600 transition">资源共享</router-link>
        <router-link to="/student/achievement" class="hover:text-blue-600 transition">成果展示</router-link>
      </nav>
      <div class="flex items-center space-x-2">
        <router-link to="/login">
          <button class="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">登录</button>
        </router-link>
        <router-link to="/register">
          <button class="px-4 py-1.5 rounded bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">注册</button>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// 未来可以添加导航栏逻辑，如移动端菜单展开/收起
</script> 