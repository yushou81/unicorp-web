<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-sm mb-8 animate-pulse">
        <div class="h-40 w-full bg-gray-200 rounded-t-xl"></div>
        <div class="px-6 py-4">
          <div class="flex flex-col md:flex-row">
            <div class="flex flex-col items-center md:items-start -mt-16 md:-mt-12">
              <div class="w-28 h-28 rounded-full bg-gray-300"></div>
              <div class="mt-4 w-40 h-6 bg-gray-300 rounded-md"></div>
              <div class="mt-2 w-24 h-4 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
        <div class="px-6 pt-2 pb-2 border-b">
          <div class="h-8 w-full bg-gray-100"></div>
        </div>
      </div>
      
      <div class="h-8 w-40 bg-gray-200 rounded-md mb-4"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-64 bg-white rounded-xl shadow-sm animate-pulse"></div>
      </div>
    </div>
    
    <!-- 主内容 -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- 个人资料区域 -->
      <div class="bg-white rounded-xl shadow-sm mb-8 hover-card">
        <!-- 顶部信息区 -->
        <div class="relative">
          <!-- 封面背景 -->
          <div class="h-40 w-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl"></div>
          
          <!-- 头像和基本信息 -->
          <div class="flex flex-col md:flex-row px-6 py-4">
            <div class="flex flex-col items-center md:items-start -mt-16 md:-mt-12">
              <div class="relative group avatar-hover">
                <img 
                  :src="userAvatar" 
                  class="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover" 
                  alt="用户头像" 
                />
                <div 
                  @click="onEditProfileClick"
                  class="absolute inset-0 rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200"
                >
                  <span class="text-white text-sm">更换头像</span>
                </div>
              </div>
              
              <div class="mt-4 md:mt-6 flex flex-col items-center md:items-start">
                <div class="flex items-center flex-wrap justify-center md:justify-start">
                  <h1 class="text-2xl font-bold text-gray-900">{{ user.nickname }}</h1>
                  <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">{{ roleText }}</span>
                  <span v-if="user.verified" class="ml-2 mt-1 md:mt-0 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">已认证</span>
                </div>
                <p class="text-gray-500 mt-1">{{ user.school || '未绑定学校' }}</p>
              </div>
            </div>
            
            <div class="ml-0 md:ml-auto mt-6 md:mt-0 flex flex-col md:flex-row items-center gap-3">
              <div class="flex flex-col items-center md:items-end">
                <div class="text-gray-600 text-sm">{{ user.email }}</div>
                <div class="text-gray-600 text-sm">{{ user.phone }}</div>
              </div>
              <div class="flex gap-2 mt-3 md:mt-0">
                <button 
                  @click="onEditProfileClick" 
                  class="px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  编辑资料
                </button>
                <button 
                  @click="showResumeDialog = true" 
                  class="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                  </svg>
                  我的简历
                </button>
              </div>
            </div>
          </div>
          
          <!-- 导航标签栏 -->
          <div class="px-6 pt-2 pb-0 border-b relative">
            <!-- 移动端菜单按钮 -->
            <button 
              @click="toggleMobileMenu" 
              class="md:hidden absolute right-4 top-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            
            <!-- 桌面菜单 -->
            <div class="hidden md:flex space-x-6 overflow-x-auto scrollbar-hide">
              <a :class="['pb-3 border-b-2 font-medium', activeTab === 'home' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']" @click="activeTab = 'home'">个人主页</a>
              <a :class="['pb-3 border-b-2 font-medium', activeTab === 'record' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']" @click="activeTab = 'record'">求职记录</a>
              <a :class="['pb-3 border-b-2 font-medium', activeTab === 'study' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']" @click="activeTab = 'study'">学习记录</a>
              <a :class="['pb-3 border-b-2 font-medium', activeTab === 'course' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']" @click="activeTab = 'course'">课程管理</a>
              <a :class="['pb-3 border-b-2 font-medium', activeTab === 'chat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']" @click="activeTab = 'chat'">聊天</a>
              <router-link to="/achievement/student" :class="['pb-3 border-b-2 font-medium', $route.path.includes('/achievement') ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">成果展示</router-link>
            </div>
            
            <!-- 移动菜单 -->
            <div 
              v-if="mobileMenuOpen"
              class="md:hidden absolute left-0 right-0 top-full bg-white shadow-md z-10 border-b border-gray-100"
            >
              <a :class="['block px-4 py-2', activeTab === 'home' ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50' : 'text-gray-500 border-l-4 border-transparent hover:bg-gray-50']" @click="activeTab = 'home'">个人主页</a>
              <a :class="['block px-4 py-2', activeTab === 'record' ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50' : 'text-gray-500 border-l-4 border-transparent hover:bg-gray-50']" @click="activeTab = 'record'">求职记录</a>
              <a :class="['block px-4 py-2', activeTab === 'study' ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50' : 'text-gray-500 border-l-4 border-transparent hover:bg-gray-50']" @click="activeTab = 'study'">学习记录</a>
              <a :class="['block px-4 py-2', activeTab === 'course' ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50' : 'text-gray-500 border-l-4 border-transparent hover:bg-gray-50']" @click="activeTab = 'course'">课程管理</a>
              <a :class="['block px-4 py-2', activeTab === 'chat' ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50' : 'text-gray-500 border-l-4 border-transparent hover:bg-gray-50']" @click="activeTab = 'chat'">聊天</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据卡片区域 -->
      <div class="mb-10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-2 md:mb-0">我的数据</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
              筛选
            </button>
            <button class="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              排序
            </button>
          </div>
        </div>

        <!-- 上半部分数据卡片 - 使用大卡片布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 equal-height-cards">
          <!-- 收藏/投递职位 卡片 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-card">
            <!-- 卡片头部 -->
            <div class="p-5 border-b border-gray-100 flex justify-between items-center">
              <div class="flex items-center">
                <span class="bg-blue-100 p-2 rounded-lg mr-3">
                  <component :is="blocks[0].icon" class="w-5 h-5 text-blue-600" />
                </span>
                <h3 class="font-medium text-gray-800">{{ blocks[0].title }}</h3>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
            
            <!-- 卡片内容 -->
            <div class="p-5">
              <!-- 加载状态 -->
              <div v-if="blocks[0].loading" class="flex justify-center items-center py-4">
                <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <!-- 岗位列表 -->
              <ul v-else class="space-y-3">
                <li 
                  v-for="item in blocks[0].data" 
                  :key="item.id" 
                  class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-all"
                >
                  <div 
                    class="flex items-center flex-grow cursor-pointer" 
                    @click="goToJobDetail(item.jobId as number)"
                  >
                    <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span class="text-gray-700 mr-2">{{ item.label }}</span>
                    <span v-if="item.status" class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{{ item.status }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-xs text-gray-500 mr-2">{{ item.extra }}</span>
                    <button 
                      @click="handleUnfavorite(item.jobId as number)" 
                      class="text-gray-400 hover:text-red-500 transition-colors"
                      title="取消收藏"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
                <li v-if="blocks[0].data.length === 0" class="text-gray-400 text-sm p-2">{{ blocks[0].empty }}</li>
              </ul>
            </div>
            
            <!-- 卡片底部 -->
            <div class="border-t border-gray-100 p-4 mt-auto">
              <router-link v-if="blocks[0].footer" :to="blocks[0].footer.link" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center justify-center">
                {{ blocks[0].footer.text }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </router-link>
            </div>
          </div>
          
          <!-- 学习记录 卡片 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-card">
            <!-- 卡片头部 -->
            <div class="p-5 border-b border-gray-100 flex justify-between items-center">
              <div class="flex items-center">
                <span class="bg-green-100 p-2 rounded-lg mr-3">
                  <component :is="blocks[1].icon" class="w-5 h-5 text-green-600" />
                </span>
                <h3 class="font-medium text-gray-800">{{ blocks[1].title }}</h3>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
            
            <!-- 卡片内容 -->
            <div class="p-5">
              <ul class="space-y-3">
                <li v-for="item in blocks[1].data" :key="item.id" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-all">
                  <div class="flex items-center">
                    <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span class="text-gray-700">{{ item.label }}</span>
                  </div>
                  <span class="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">{{ item.extra }}</span>
                </li>
                <li v-if="blocks[1].data.length === 0" class="text-gray-400 text-sm p-2">{{ blocks[1].empty }}</li>
              </ul>
            </div>
            
            <!-- 卡片底部 -->
            <div class="border-t border-gray-100 p-4 mt-auto">
              <router-link v-if="blocks[1].footer" :to="blocks[1].footer.link" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center justify-center">
                {{ blocks[1].footer.text }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </router-link>
            </div>
          </div>
          
          <!-- 报名课程 卡片 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-card">
            <!-- 卡片头部 -->
            <div class="p-5 border-b border-gray-100 flex justify-between items-center">
              <div class="flex items-center">
                <span class="bg-indigo-100 p-2 rounded-lg mr-3">
                  <component :is="blocks[2].icon" class="w-5 h-5 text-indigo-600" />
                </span>
                <h3 class="font-medium text-gray-800">{{ blocks[2].title }}</h3>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
            
            <!-- 卡片内容 -->
            <div class="p-5">
              <ul class="space-y-3">
                <li v-for="item in blocks[2].data" :key="item.id" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-all">
                  <div class="flex items-center">
                    <div class="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                    <span class="text-gray-700">{{ item.label }}</span>
                  </div>
                  <span class="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">{{ item.extra }}</span>
                </li>
                <li v-if="blocks[2].data.length === 0" class="text-gray-400 text-sm p-2">{{ blocks[2].empty }}</li>
              </ul>
            </div>
            
            <!-- 卡片底部 -->
            <div class="border-t border-gray-100 p-4 mt-auto">
              <router-link v-if="blocks[2].footer" :to="blocks[2].footer.link" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center justify-center">
                {{ blocks[2].footer.text }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- 下半部分数据卡片 - 使用紧凑的水平卡片布局 -->
        <h3 class="text-lg font-medium text-gray-800 mb-4">快速入口</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 我的岗位申请卡片 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-card">
            <div class="p-4">
              <div class="flex items-center mb-3">
                <span class="rounded-lg p-2 bg-purple-50 mr-3">
                  <component :is="myApplicationsBlock.icon" class="w-5 h-5 text-purple-600" />
                </span>
                <h3 class="font-medium text-gray-800">{{ myApplicationsBlock.title }}</h3>
              </div>
              
              <!-- 加载状态 -->
              <div v-if="myApplicationsBlock.loading" class="flex justify-center items-center py-4">
                <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <!-- 申请列表 -->
              <ul v-else class="space-y-2">
                <li 
                  v-for="item in myApplicationsBlock.data" 
                  :key="item.id" 
                  class="flex justify-between items-center p-1.5 hover:bg-gray-50 rounded-md transition-all"
                  @click="goToJobDetail(item.jobId as number)"
                >
                  <div class="flex items-center cursor-pointer">
                    <div class="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <span class="text-gray-700 text-sm">{{ item.label }}</span>
                  </div>
                  <span 
                    class="text-xs px-2 py-0.5 rounded-full" 
                    :class="item.statusColor || 'bg-gray-100 text-gray-600'"
                  >
                    {{ item.status }}
                  </span>
                </li>
                <li v-if="myApplicationsBlock.data.length === 0" class="text-gray-400 text-sm p-1.5">{{ myApplicationsBlock.empty }}</li>
              </ul>
              
              <router-link v-if="myApplicationsBlock.footer" :to="myApplicationsBlock.footer.link" class="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                {{ myApplicationsBlock.footer.text }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </router-link>
            </div>
          </div>
          
          <!-- 企业申请入口 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-card">
            <div class="p-4 flex">
              <div class="rounded-lg p-3 bg-yellow-50 mr-4">
                <component :is="blocks[3].icon" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 class="font-medium text-gray-800 mb-1">{{ blocks[3].title }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ blocks[3].empty }}</p>
                <router-link v-if="blocks[3].footer" :to="blocks[3].footer.link" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                  {{ blocks[3].footer.text }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- 学校信息浏览 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-card">
            <div class="p-4 flex">
              <div class="rounded-lg p-3 bg-green-50 mr-4">
                <component :is="blocks[4].icon" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 class="font-medium text-gray-800 mb-1">{{ blocks[4].title }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ blocks[4].empty }}</p>
                <router-link v-if="blocks[4].footer" :to="blocks[4].footer.link" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                  {{ blocks[4].footer.text }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- 企业信息浏览 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-card">
            <div class="p-4 flex">
              <div class="rounded-lg p-3 bg-yellow-50 mr-4">
                <component :is="blocks[5].icon" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 class="font-medium text-gray-800 mb-1">{{ blocks[5].title }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ blocks[5].empty }}</p>
                <router-link v-if="blocks[5].footer" :to="blocks[5].footer.link" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                  {{ blocks[5].footer.text }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    

    
    <!-- 编辑个人资料对话框 -->
    <div v-if="showEditProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">编辑个人资料</h2>
        <form @submit.prevent="onUpdateProfile">
          <!-- 头像上传 -->
          <div class="mb-5 flex flex-col items-center">
            <div class="relative group">
              <img 
                :src="previewAvatar || userAvatar" 
                class="w-28 h-28 rounded-full border-2 border-blue-200 mb-2 object-cover" 
                alt="avatar" 
              />
              <div 
                @click="fileInput?.click()" 
                class="absolute inset-0 rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200"
              >
                <span class="text-white text-sm">更换头像</span>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
            <p v-if="avatarFile" class="text-xs text-gray-500 mt-1 flex items-center">
              <span>{{ avatarFile.name }} ({{ formatFileSize(avatarFile.size) }})</span>
              <button 
                type="button" 
                @click="cancelAvatarUpload" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </p>
          </div>

          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">昵称</label>
            <input v-model="editProfile.nickname" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入昵称" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">邮箱</label>
            <input v-model="editProfile.email" type="email" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入邮箱" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1 text-sm font-medium">手机号</label>
            <input v-model="editProfile.phone" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入手机号" />
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showEditProfileDialog = false" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">取消</button>
            <button type="submit" :disabled="updateProfileLoading" class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center">
              <svg v-if="updateProfileLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ updateProfileLoading ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
        <div class="mt-6 pt-4 border-t">
          <h3 class="text-lg font-semibold mb-3">修改密码</h3>
          <form @submit.prevent="onChangePassword">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">原密码</label>
              <input v-model="passwordChange.oldPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入原密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">新密码</label>
              <input v-model="passwordChange.newPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入新密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1 text-sm font-medium">确认新密码</label>
              <input v-model="passwordChange.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请再次输入新密码" />
            </div>
            <div class="flex justify-end space-x-2">
              <button type="submit" :disabled="changePasswordLoading" class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition flex items-center">
                <svg v-if="changePasswordLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ changePasswordLoading ? '修改中...' : '修改密码' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 简历管理对话框 -->
    <ResumeManager v-model:visible="showResumeDialog" :resumes="resumes" @resume-updated="onResumeUpdated" />
    
    <!-- Toast提示组件 -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      :class="{'opacity-0 translate-y-2': toast.hiding, 'opacity-100 translate-y-0': !toast.hiding}"
    >
      {{ toast.message }}
    </div>

    <!-- Tab内容区 -->
    <div v-if="activeTab === 'home'">
      <!-- 原主页内容区域 -->
      <!-- ... existing code ... -->
    </div>
    <div v-else-if="activeTab === 'record'" class="bg-white rounded-xl shadow-sm p-8 mt-8">
      <h2 class="text-xl font-bold mb-6">我的岗位申请记录</h2>
      <div v-if="applicationsLoading" class="text-center py-10">加载中...</div>
      <div v-else>
        <table class="w-full text-left mb-4">
          <thead>
            <tr>
              <th>岗位名称</th>
              <th>公司</th>
              <th>状态</th>
              <th>申请时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in applications" :key="item.id">
              <td>{{ item.jobTitle }}</td>
              <td>{{ item.companyName }}</td>
              <td>{{ formatApplicationStatus(item.status) }}</td>
              <td>{{ formatDate(item.appliedAt) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between items-center">
          <span>共 {{ applicationsTotal }} 条</span>
          <div>
            <button :disabled="applicationsPage === 1" @click="changeApplicationsPage(applicationsPage-1)">上一页</button>
            <span class="mx-2">第 {{ applicationsPage }} / {{ applicationsPages }} 页</span>
            <button :disabled="applicationsPage === applicationsPages" @click="changeApplicationsPage(applicationsPage+1)">下一页</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'chat'">
      <ChatPanel :myUserId="myUserId" :myAvatar="userAvatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ref, computed, onMounted, watch } from 'vue'

import { BriefcaseIcon, BookmarkIcon, AcademicCapIcon, CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { getMyEquipmentBookings, cancelEquipmentBooking } from '@/lib/api/resource'
import { useRouter, useRoute } from 'vue-router'
import { getMe, updatePassword, updateUserInfo, uploadAvatar } from '@/lib/api/auth'
import { getMyResumes, createMyResume, updateMyResume, deleteMyResume } from '@/lib/api/resume'
import { getFavoriteJobs, unfavoriteJob, getMyApplications, Job, JobApplication } from '@/lib/api/job'
import Button from '@/components/ui/Button.vue'
import Navbar from '@/components/layout/Navbar.vue'
import ResumeManager from '@/components/resume/ResumeManager.vue'
import { apiRequest } from '@/lib/api/apiClient'
import { getChatSessions, getSessionMessages, sendChatMessage } from '@/lib/api/chat'
import ChatPanel from '@/components/chat/ChatPanel.vue'

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 定义User类型
interface User {
  avatar?: string;
  nickname: string;
  email: string;
  phone: string;
  verified: boolean;
  school: string;
}

// 定义AppUser类型，这应该与您的store中定义的用户类型匹配
interface AppUser {
  id?: number;
  account?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  organizationId?: number;
  organizationName?: string;
}

// 定义数据项类型
interface DataItem {
  id: number;
  label: string;
  extra?: string;
  status?: string;
  statusColor?: string;
  jobId?: number; // 岗位ID，用于收藏/申请操作
}

// 定义区块类型
interface Block {
  title: string;
  icon: any;
  color: string;
  type: string;
  data: DataItem[];
  empty: string;
  count?: number;
  loading?: boolean;
  footer?: {
    text: string;
    link: string;
  };
}

// 简历数据类型 - 与API保持一致
interface ResumeData {
  id?: number;
  major: string;
  educationLevel: string;
  achievements: string;
  resumeUrl?: string;
}

const user = ref<User>({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '加载中...',
  email: '',
  phone: '',
  verified: false,
  school: '加载中...'
})

async function fetchUserInfo() {
  try {
    const res = await getMe() as ApiResponse<any>
    const userData = res?.data
    if (userData) {
      user.value = {
        avatar: userData.avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: userData.nickname || userData.account || '未知用户',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        school: userData.organizationName || '未绑定学校'
      }
    }
  } catch (e: any) {
    console.error('获取用户信息失败:', e)
    // 保持默认值
  }
}

// 更新blocks数据
const blocks = ref<Block[]>([
  {
    title: '收藏/投递职位',
    icon: BriefcaseIcon,
    color: 'text-blue-500',
    type: 'list',
    data: [],
    loading: false,
    empty: '暂无职位记录',
    footer: { text: '查看全部职位', link: '/job' }
  },
  {
    title: '学习记录',
    icon: AcademicCapIcon,
    color: 'text-green-500',
    type: 'list',
    data: [
      { id: 1, label: 'AI创新项目论文', extra: '2024-04-22' }
    ],
    empty: '暂无学习记录',
    footer: { text: '管理我的学习', link: '/learn' }
  },
  {
    title: '报名课程',
    icon: CalendarDaysIcon,
    color: 'text-indigo-500',
    type: 'list',
    data: [
      { id: 1, label: '大数据实战', extra: '2024-07-01' }
    ],
    empty: '暂无报名课程',
    footer: { text: '查看全部课程', link: '/courses' }
  },
  {
    title: '企业申请入口',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-500',
    type: 'list',
    data: [],
    empty: '如有意向加入企业项目，请点击下方入口',
    footer: { text: '申请加入企业项目', link: '/apply' }
  },
  {
    title: '学校信息浏览',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    type: 'list',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部学校', link: '/school/list' }
  },
  {
    title: '企业信息浏览',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-600',
    type: 'list',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部企业', link: '/company/list' }
  }
])

// 添加我的申请区块
const myApplicationsBlock = ref<Block>({
  title: '我的岗位申请',
  icon: BookmarkIcon,
  color: 'text-purple-500',
  type: 'list',
  data: [],
  loading: false,
  empty: '暂无申请记录',
  footer: { text: '查看所有申请', link: '/me/applications' }
})

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const userInfo = computed<AppUser>(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || user.value.avatar || 'https://randomuser.me/api/portraits/men/32.jpg')
const roleText = computed(() => {
  const role = userInfo.value.role || ''
  const roleMap: Record<string, string> = {
    'admin': '系统管理员',
    'SYSADMIN': '系统管理员',
    'schoolAdmin': '学校管理员',
    'SCH_ADMIN': '学校管理员',
    'companyAdmin': '企业管理员',
    'EN_ADMIN': '企业管理员',
    'teacher': '教师',
    'TEACHER': '教师',
    'mentor': '企业导师',
    'MENTOR': '企业导师',
    'student': '学生',
    'STUDENT': '学生'
  }
  return roleMap[role] || '未知角色'
})

const showEditProfileDialog = ref(false)
const editProfile = ref({
  nickname: '',
  email: '',
  phone: ''
})
const passwordChange = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const updateProfileLoading = ref(false)
const changePasswordLoading = ref(false)

// 头像上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const previewAvatar = ref<string | null>(null)
const avatarUploading = ref(false)

// 简历管理相关
const showResumeDialog = ref(false)
const resumes = ref<ResumeData[]>([])

// 监听 showResumeDialog 打开时拉取简历
watch(showResumeDialog, (val) => {
  if (val) {
    fetchResumes()
  }
})

async function fetchResumes() {
  try {
    const res = await getMyResumes()
    if (res.code === 200 && res.data) {
      resumes.value = res.data.records || res.data || []
    } else {
      resumes.value = []
    }
  } catch (e) {
    resumes.value = []
  }
}

// Toast提示
const toast = ref({
  show: false,
  message: '',
  hiding: false
})

// 获取收藏的岗位
async function fetchFavoriteJobs() {
  blocks.value[0].loading = true
  try {
    const response = await getFavoriteJobs({ page: 0, size: 5 })
    if (response.code === 200 && response.data) {
      blocks.value[0].data = response.data.records.map(job => ({
        id: job.id,
        jobId: job.id,
        label: job.title,
        extra: job.organizationName,
        status: formatJobStatus(job.status)
      }))
    }
  } catch (error) {
    console.error('获取收藏岗位失败:', error)
  } finally {
    blocks.value[0].loading = false
  }
}

// 获取我的申请
async function fetchMyApplications() {
  myApplicationsBlock.value.loading = true
  try {
    const response = await getMyApplications({ page: 0, size: 5 })
    if (response.code === 200 && response.data) {
      myApplicationsBlock.value.data = response.data.records.map(app => ({
        id: app.id,
        jobId: app.jobId,
        label: app.jobTitle,
        extra: app.companyName,
        status: formatApplicationStatus(app.status),
        statusColor: getStatusColor(app.status)
      }))
    }
  } catch (error) {
    console.error('获取岗位申请失败:', error)
  } finally {
    myApplicationsBlock.value.loading = false
  }
}

// 格式化岗位状态
function formatJobStatus(status: string): string {
  switch (status) {
    case 'open': return '招聘中'
    case 'closed': return '已关闭'
    default: return status
  }
}

// 格式化申请状态
function formatApplicationStatus(status: string): string {
  switch (status) {
    case 'submitted': return '已提交'
    case 'viewed': return '已查看'
    case 'interviewing': return '面试中'
    case 'offered': return '已录用'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

// 获取状态颜色
function getStatusColor(status: string): string {
  switch (status) {
    case 'submitted': return 'bg-blue-100 text-blue-700'
    case 'viewed': return 'bg-yellow-100 text-yellow-700'
    case 'interviewing': return 'bg-purple-100 text-purple-700'
    case 'offered': return 'bg-green-100 text-green-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

// 取消收藏岗位
async function handleUnfavorite(jobId: number) {
  try {
    const response = await unfavoriteJob(jobId)
    if (response.code === 200) {
      showToast('取消收藏成功')
      // 从列表中移除该岗位
      blocks.value[0].data = blocks.value[0].data.filter(item => item.jobId !== jobId)
    } else {
      showToast(response.message || '取消收藏失败')
    }
  } catch (error: any) {
    showToast(error.message || '操作失败')
  }
}

// 显示Toast消息
function showToast(message: string, duration = 2000) {
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
function hideToast() {
  toast.value.hiding = true
  setTimeout(() => {
    toast.value.show = false
  }, 300)
}

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    // 先更新用户基本信息
    await updateUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    
    // 如果选择了新头像，则上传头像
    if (avatarFile.value) {
      avatarUploading.value = true
      try {
        await uploadAvatar(avatarFile.value)
        console.log('头像上传成功')
      } catch (avatarError: any) {
        console.error('头像上传失败:', avatarError)
        alert('头像上传失败: ' + (avatarError.message || '未知错误'))
        // 继续执行，不影响其他信息的保存
      } finally {
        avatarUploading.value = false
      }
    }
    
    showEditProfileDialog.value = false
    
    // 重置头像上传状态
    avatarFile.value = null
    previewAvatar.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    await fetchUserInfo() // 重新获取用户信息
    
    // 更新store中的用户信息
    const res = await getMe() as ApiResponse<any>
    if (res?.data) {
      appStore.setUser(res.data)
    }
    
    showToast('个人资料更新成功')
  } catch (e: any) {
    showToast('更新失败：' + (e.message || '未知错误'))
  } finally {
    updateProfileLoading.value = false
  }
}

async function onChangePassword() {
  if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
    showToast('新密码与确认密码不一致')
    return
  }
  
  changePasswordLoading.value = true
  try {
    await updatePassword({
      oldPassword: passwordChange.value.oldPassword,
      newPassword: passwordChange.value.newPassword,
      confirmPassword: passwordChange.value.confirmPassword
    })
    passwordChange.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    showToast('密码修改成功')
  } catch (e: any) {
    showToast('密码修改失败：' + (e.message || '未知错误'))
  } finally {
    changePasswordLoading.value = false
  }
}

// 当打开编辑对话框时，初始化表单数据
function openEditDialog() {
  editProfile.value = {
    nickname: userInfo.value.nickname || userInfo.value.account || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || ''
  }
  showEditProfileDialog.value = true
}

// 修改按钮点击事件
function onEditProfileClick() {
  openEditDialog()
}

// 添加我的设备预约相关数据和方法
const myBookings = ref<any[]>([])
const bookingLoading = ref(false)
const bookingError = ref('')

// 获取我的设备预约申请
const fetchMyBookings = async () => {
  bookingLoading.value = true
  bookingError.value = ''
  try {
    const res = await getMyEquipmentBookings()
    if (res.code === 200 && res.data) {
      myBookings.value = res.data
      
      // 更新blocks中的设备预约数据
      const bookingBlock = blocks.value.find(b => b.title === '设备预约申请')
      if (bookingBlock) {
        bookingBlock.data = myBookings.value.slice(0, 3).map(booking => ({
          id: booking.id,
          label: `${booking.resourceTitle} (${formatBookingTime(booking.startTime)})`,
          extra: getBookingStatusText(booking.status)
        }))
      } else {
        // 如果不存在，则添加一个新的block
        blocks.value.push({
          title: '设备预约申请',
          icon: CalendarDaysIcon,
          color: 'text-purple-500',
          type: 'list',
          data: myBookings.value.slice(0, 3).map(booking => ({
            id: booking.id,
            label: `${booking.resourceTitle} (${formatBookingTime(booking.startTime)})`,
            extra: getBookingStatusText(booking.status)
          })),
          empty: '暂无设备预约申请',
          footer: { text: '查看全部预约', link: '/bookings' }
        })
      }
    }
  } catch (e: any) {
    bookingError.value = e.message || '获取预约列表失败'
    myBookings.value = []
  } finally {
    bookingLoading.value = false
  }
}

// 取消预约申请
const cancelBooking = async (bookingId: number) => {
  try {
    await cancelEquipmentBooking(bookingId)
    alert('预约已取消')
    fetchMyBookings() // 重新加载预约列表
  } catch (e: any) {
    alert('取消失败: ' + (e.message || '未知错误'))
  }
}

// 格式化预约时间
const formatBookingTime = (timeString: string) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取预约状态文本
const getBookingStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': '待审核',
    'APPROVED': '已通过',
    'REJECTED': '已拒绝',
    'CANCELED': '已取消'
  }
  return statusMap[status] || status
}

// 获取预约状态颜色
const getBookingStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'CANCELED': 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchUserInfo()
  fetchMyBookings()
})
// 处理头像上传相关函数
function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    avatarFile.value = target.files[0]
    previewAvatar.value = URL.createObjectURL(avatarFile.value)
  }
}

function cancelAvatarUpload() {
  avatarFile.value = null
  previewAvatar.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}

// 简历更新回调
function onResumeUpdated() {
  // 可以在这里执行一些操作，如更新数据卡片中的简历信息
  console.log('简历已更新')
}

// 添加页面加载状态
const isLoading = ref(true)
const mobileMenuOpen = ref(false)

// 在onMounted中模拟加载
onMounted(async () => {
  try {
    await fetchUserInfo()
    
    // 获取收藏岗位和申请记录
    await Promise.all([
      fetchFavoriteJobs(),
      fetchMyApplications()
    ])
    
    // 获取完成后设置加载状态为false
    setTimeout(() => {
      isLoading.value = false
    }, 300) // 短暂延迟以确保平滑过渡
  } catch (e) {
    console.error('获取数据失败:', e)
    isLoading.value = false
  }

  // 支持通过 query 参数 tab=chat&sessionId=xxx 自动切换
  if (route.query.tab === 'chat') {
    activeTab.value = 'chat'
    await fetchChatSessions()
    if (route.query.sessionId) {
      const sessionIdNum = Number(route.query.sessionId)
      if (sessionIdNum) {
        selectedSessionId.value = sessionIdNum
        await fetchSessionMessages(sessionIdNum)
      }
    }
  }
})

// 移动菜单切换
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 跳转到职位详情页
function goToJobDetail(jobId: number) {
  router.push(`/job/${jobId}`)
}

const activeTab = ref('home')
// 求职记录tab相关
const applications = ref<any[]>([])
const applicationsLoading = ref(false)
const applicationsPage = ref(1)
const applicationsSize = ref(10)
const applicationsTotal = ref(0)
const applicationsPages = ref(1)

watch(activeTab, (val) => {
  if (val === 'record') {
    fetchApplications()
  }
})

async function fetchApplications() {
  applicationsLoading.value = true
  try {
    const res = await getMyApplications({ page: applicationsPage.value - 1, size: applicationsSize.value })
    if (res.code === 200 && res.data) {
      applications.value = res.data.records
      applicationsTotal.value = res.data.total
      applicationsPages.value = res.data.pages
    }
  } finally {
    applicationsLoading.value = false
  }
}
function changeApplicationsPage(newPage: number) {
  applicationsPage.value = newPage
  fetchApplications()
}
function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 聊天相关
const chatSessions = ref<any[]>([])
const chatMessages = ref<any[]>([])
const selectedSessionId = ref<number|null>(null)
const selectedSession = computed(() => chatSessions.value.find(s => s.id === selectedSessionId.value))
const newMessage = ref('')
const myUserId = computed(() => userInfo.value.id)
// 新增：存储每个会话的otherUserId
const sessionOtherUserIds = ref<Record<number, number>>({})

async function fetchChatSessions() {
  try {
    const res = await getChatSessions()
    chatSessions.value = res.data || []
  } catch (e) {
    chatSessions.value = []
  }
}

async function fetchSessionMessages(sessionId: number) {
  try {
    const res = await getSessionMessages(sessionId)
    chatMessages.value = res.data || []
    // 新增：存储otherUserId
    if (typeof res.otherUserId === 'number') {
      sessionOtherUserIds.value[sessionId] = res.otherUserId
    }
  } catch (e) {
    chatMessages.value = []
  }
}

function selectSession(sessionId: number) {
  selectedSessionId.value = sessionId
  fetchSessionMessages(sessionId)
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedSession.value) return
  // 优先用otherUserId
  const receiverId = sessionOtherUserIds.value[selectedSession.value.id] || selectedSession.value.user?.id || selectedSession.value.toUserId || selectedSession.value.targetUserId
  if (!receiverId) {
    alert('无法获取对方用户ID，无法发送消息')
    return
  }
  try {
    await sendChatMessage({
      sessionId: selectedSession.value.id,
      receiverId,
      content: newMessage.value.trim()
    })
    newMessage.value = ''
    fetchSessionMessages(selectedSession.value.id)
  } catch (e) {}
}

// 获取当前用户ID
onMounted(async () => {
  try {
    const res = await apiRequest<any>('/v1/auth/me')
    myUserId.value = res.data?.id || null
  } catch {}
})

// 监听tab切换到聊天时加载会话
watch(activeTab, (val) => {
  if (val === 'chat') {
    fetchChatSessions()
  }
})
</script>

<style scoped>
.gradient-card {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 页面过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片悬停效果 */
.hover-card {
  transition: all 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* 隐藏滚动条但保留功能 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}

/* 响应式卡片高度匹配 */
@media (min-width: 768px) {
  .equal-height-cards {
    display: grid;
    grid-auto-rows: 1fr;
  }
}

/* 加载动画 */
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 头像悬停效果增强 */
.avatar-hover {
  position: relative;
  overflow: hidden;
}

.avatar-hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  border-radius: 9999px;
  transition: opacity 0.2s ease;
}

.avatar-hover:hover::after {
  opacity: 1;
}
</style>
