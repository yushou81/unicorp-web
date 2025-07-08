<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <!-- 大标题区 -->
    <div class="w-full py-10 bg-gradient-to-r from-blue-400 to-indigo-400 mb-8 shadow-lg">
      <div class="container mx-auto px-4 flex flex-col items-center">
        <h1 class="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2 tracking-wide">学校管理后台</h1>
        <p class="text-lg md:text-xl text-blue-100 font-medium mb-2">欢迎来到学校管理平台</p>
        <p class="text-base text-blue-200">高效管理学校用户与个人信息</p>
      </div>
    </div>
    <!-- 个人信息板块 -->
    <div class="container mx-auto px-4 py-8">
      <UserProfileInfo
        :avatar="userAvatar"
        :name="userInfo.nickname || userInfo.account || '学校管理员'"
        :role="roleText"
        :organization="school.name || '加载中...'"
        :phone="userInfo.phone"
        :email="userInfo.email"
        :editable="true"
        :verified="school.verified"
        :onEdit="onEditProfileClick"
      />
    </div>
    
    <!-- 标签页导航 -->
    <div class="container mx-auto px-4 mb-6">
      <div class="flex space-x-4 border-b">
        <button 
          @click="activeTab = 'users'" 
          :class="['px-4 py-2 font-medium transition-colors', 
                  activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500']"
        >
          用户管理
        </button>
        <button 
          @click="activeTab = 'classroom'" 
          :class="['px-4 py-2 font-medium transition-colors', 
                  activeTab === 'classroom' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500']"
        >
          双师课堂
        </button>
        <button 
          @click="activeTab = 'resources'" 
          :class="['px-4 py-2 font-medium transition-colors', 
                  activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500']"
        >
          资源管理
        </button>
      </div>
    </div>
    
    <!-- 数据统计区 -->
    <div class="container mx-auto px-4">
      <!-- 用户管理直接显示表格 -->
      <div v-if="activeTab === 'users'" class="bg-white rounded-xl shadow-lg p-8 my-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-blue-700">老师账号管理</h2>
          <Button @click="showAddTeacherDialog = true" class="bg-blue-600 hover:bg-blue-700">添加老师账号</Button>
        </div>
        <!-- 用户表格和分页 -->
        <div v-if="teacherLoading" class="text-center text-gray-400 py-8">加载中...</div>
        <div v-else-if="teacherError" class="text-center text-red-500 py-8">{{ teacherError }}</div>
        <div v-else>
          <div v-if="teachers.length === 0" class="text-gray-400 text-center py-8">暂无老师账号</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">身份</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="teacher in teachers" :key="teacher.id">
                  <td class="px-4 py-2">{{ teacher.email }}</td>
                  <td class="px-4 py-2">{{ teacher.nickname || '-' }}</td>
                  <td class="px-4 py-2">{{ teacher.phone || '-' }}</td>
                  <td class="px-4 py-2">{{ teacher.roleName || teacher.role || (teacher.roles ? teacher.roles.join(',') : '-') }}</td>
                  <td class="px-4 py-2">{{ teacher.status || '-' }}</td>
                  <td class="px-4 py-2 space-x-2">
                    <Button size="sm" @click="onEditUser(teacher)">编辑</Button>
                    <Button 
                      v-if="teacher.status === 'active'" 
                      size="sm" 
                      variant="destructive" 
                      @click="onUpdateTeacherStatus(teacher, 'inactive')"
                    >
                      禁用
                    </Button>
                    <Button 
                      v-else 
                      size="sm" 
                      variant="default" 
                      @click="onUpdateTeacherStatus(teacher, 'active')"
                    >
                      启用
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 分页控件 -->
            <div class="flex justify-end mt-4" v-if="teacherTotal > teacherSize">
              <button @click="teacherPage > 0 && (teacherPage--, fetchTeachers())" :disabled="teacherPage === 0" class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2">上一页</button>
              <span class="text-sm text-gray-500">第 {{ teacherPage + 1 }} 页 / 共 {{ Math.ceil(teacherTotal / teacherSize) }} 页</span>
              <button @click="(teacherPage + 1) * teacherSize < teacherTotal && (teacherPage++, fetchTeachers())" :disabled="(teacherPage + 1) * teacherSize >= teacherTotal" class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2">下一页</button>
            </div>
          </div>
        </div>
        <div
          class="group cursor-pointer bg-gradient-to-br from-green-100 to-green-300 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl"
          @click="goToProjectAudit"
        >
          <svg class="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 014-4h4M7 7h.01M7 11h.01M7 15h.01M17 7h.01M17 11h.01M17 15h.01" /></svg>
          <span class="text-lg font-bold text-green-800 mb-1">项目审核</span>
          <span class="text-sm text-green-500">管理和审核项目申请</span>
        </div>
      </div>
      
      <!-- 双师课堂管理界面 -->
      <div v-if="activeTab === 'classroom'" class="my-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">双师课堂管理</h2>
          <div class="flex space-x-2">
            <button 
              @click="router.push('/classroom/manage')" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              课程管理页面
            </button>
            <button 
              @click="openCreateCourseDialog()" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              创建新课程
            </button>
          </div>
        </div>
        
        <div v-if="courseLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="courseError" class="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4">
          {{ courseError }}
        </div>
        
        <div v-else-if="courseList.length === 0" class="bg-gray-50 p-8 rounded-lg text-center">
          <p class="text-gray-500">暂无课程数据，点击上方按钮创建新课程</p>
        </div>
        
        <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程名称</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">授课教师</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">企业导师</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程时间</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报名人数</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="course in courseList" :key="course.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ course.title }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ course.teacherName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ course.mentorName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ new Date(course.scheduledTime).toLocaleString() }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ course.enrolledCount }}/{{ course.maxStudents }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getCourseStatusClass(course.status)">{{ getCourseStatusText(course.status) }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <button @click="openEditCourseDialog(course)" class="text-blue-600 hover:text-blue-900">编辑</button>
                    <button @click="openResourceUploadDialog(course.id)" class="text-green-600 hover:text-green-900">上传资源</button>
                    <button @click="onDeleteCourse(course.id)" class="text-red-600 hover:text-red-900">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 分页 -->
          <div class="px-6 py-4 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              共 {{ totalCourses }} 条记录
            </div>
            <div class="flex space-x-2">
              <button 
                @click="courseCurrentPage > 1 && (courseCurrentPage--, fetchCourses())" 
                :disabled="courseCurrentPage <= 1"
                :class="[
                  'px-3 py-1 rounded text-sm', 
                  courseCurrentPage <= 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                上一页
              </button>
              <span class="px-3 py-1 text-sm text-gray-600">
                {{ courseCurrentPage }} / {{ Math.ceil(totalCourses / coursePageSize) || 1 }}
              </span>
              <button 
                @click="courseCurrentPage < Math.ceil(totalCourses / coursePageSize) && (courseCurrentPage++, fetchCourses())"
                :disabled="courseCurrentPage >= Math.ceil(totalCourses / coursePageSize)"
                :class="[
                  'px-3 py-1 rounded text-sm', 
                  courseCurrentPage >= Math.ceil(totalCourses / coursePageSize) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 资源管理界面 -->
      <div v-if="activeTab === 'resources'" class="my-6">
        <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-blue-700">资源管理</h2>
            <div class="space-x-2">
              <router-link to="/resource/upload" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                上传资源
              </router-link>
              <router-link to="/resource" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                资源列表
              </router-link>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 资源上传卡片 -->
            <div class="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">上传资源</h3>
              </div>
              <p class="text-gray-600 mb-4">上传课程资料、实验设备信息、技术文档等资源，支持多种格式。</p>
              <router-link to="/resource/upload" class="text-blue-600 hover:text-blue-800 flex items-center">
                前往上传
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
            
            <!-- 设备预约审核卡片 -->
            <div class="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">设备预约审核</h3>
              </div>
              <p class="text-gray-600 mb-4">查看并处理学生和教师的设备使用申请，管理实验设备资源。</p>
              <router-link to="/equipment/bookings" class="text-green-600 hover:text-green-800 flex items-center">
                查看申请
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
            
            <!-- 资源统计卡片 -->
            <div class="bg-purple-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">资源概览</h3>
              </div>
              <p class="text-gray-600 mb-4">浏览校内资源使用情况、热门资源和最新上传的资源。</p>
              <router-link to="/resource" class="text-purple-600 hover:text-purple-800 flex items-center">
                查看资源
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
          
          <!-- 最近的设备预约申请 -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">最近的设备预约申请</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请人</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备名称</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请时间</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="booking in recentEquipmentBookings" :key="booking.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">{{ booking.userName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ booking.resourceName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ new Date(booking.startTime).toLocaleString() }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">待审核</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <router-link to="/equipment/bookings" class="text-blue-600 hover:text-blue-900">查看详情</router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-4 text-right">
              <router-link to="/equipment/bookings" class="text-blue-600 hover:text-blue-800">
                查看全部预约 →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 课程创建/编辑对话框 -->
    <div v-if="showCourseDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4">{{ isEditingCourse ? '编辑课程' : '创建新课程' }}</h2>
        <form @submit.prevent="saveCourse">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程标题</label>
            <input v-model="courseForm.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入课程标题" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程描述</label>
            <textarea v-model="courseForm.description" rows="3" class="w-full px-3 py-2 border rounded" placeholder="请输入课程描述"></textarea>
          </div>
          
          <!-- 企业导师搜索部分 -->
          <div class="mb-5 border-b pb-5">
            <label class="block text-gray-700 mb-1">企业导师</label>
            
            <div v-if="selectedMentor" class="flex items-center justify-between bg-blue-50 p-3 rounded mb-2">
              <div>
                <div class="font-semibold">{{ selectedMentor.name }}</div>
                <div class="text-xs text-gray-500">导师ID: {{ selectedMentor.id }}</div>
              </div>
              <button 
                type="button" 
                @click="clearSelectedMentor" 
                class="text-red-600 text-sm hover:text-red-800"
              >
                移除
              </button>
            </div>
            
            <div v-else>
              <div class="flex mb-2">
                <input 
                  v-model="mentorSearchKeyword" 
                  class="flex-1 px-3 py-2 border rounded-l" 
                  placeholder="输入导师邮箱或手机号查询" 
                />
                <button 
                  type="button" 
                  @click="searchMentor" 
                  :disabled="mentorSearching" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
                >
                  {{ mentorSearching ? '查询中...' : '查询' }}
                </button>
              </div>
              
              <div v-if="mentorSearchResults.length > 0" class="border rounded mt-2 max-h-40 overflow-y-auto">
                <div 
                  v-for="mentor in mentorSearchResults" 
                  :key="mentor.id"
                  class="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                  @click="selectMentor(mentor)"
                >
                  <div class="font-medium">{{ mentor.nickname || mentor.account }}</div>
                  <div class="text-xs text-gray-500">
                    {{ mentor.email || '无邮箱' }} | {{ mentor.phone || '无手机号' }}
                  </div>
                </div>
              </div>
              
              <div v-if="!selectedMentor" class="text-xs text-gray-500 mt-1">
                必须选择一位企业导师进行双师课堂的创建
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程时间</label>
              <input v-model="courseForm.scheduledTime" type="datetime-local" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">最大学生人数</label>
              <input v-model="courseForm.maxStudents" type="number" min="1" class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程地点</label>
              <input v-model="courseForm.location" class="w-full px-3 py-2 border rounded" placeholder="请输入课程地点" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程类型</label>
              <select v-model="courseForm.courseType" class="w-full px-3 py-2 border rounded">
                <option value="online">线上</option>
                <option value="offline">线下</option>
                <option value="hybrid">混合</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showCourseDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white">保存</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 资源上传对话框 -->
    <div v-if="showResourceDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">上传课程资源</h2>
        <form @submit.prevent="uploadCourseResource">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源标题</label>
            <input v-model="resourceForm.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入资源标题" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源描述</label>
            <textarea v-model="resourceForm.description" rows="2" class="w-full px-3 py-2 border rounded" placeholder="请输入资源描述"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源类型</label>
            <select v-model="resourceForm.resourceType" class="w-full px-3 py-2 border rounded">
              <option value="document">文档</option>
              <option value="video">视频</option>
              <option value="code">代码</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="mb-5">
            <label class="block text-gray-700 mb-1">选择文件</label>
            <input
              ref="resourceFileInput"
              type="file"
              @change="handleResourceFileChange"
              class="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showResourceDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="uploadingResource" class="px-4 py-1 rounded bg-blue-600 text-white">
              {{ uploadingResource ? '上传中...' : '上传' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 编辑个人资料弹窗（保持不变） -->
    <div v-if="showProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[80vh] relative">
        <button @click="showProfileDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-purple-600 text-2xl font-bold focus:outline-none">×</button>
        <h2 class="text-2xl font-bold mb-4 text-purple-700">编辑个人资料</h2>
        <!-- 复用原有个人资料表单和修改密码表单 -->
        <form @submit.prevent="onUpdateProfile">
          <!-- 头像上传 -->
          <div class="mb-5 flex flex-col items-center">
            <img :src="previewAvatar || userAvatar" class="w-24 h-24 rounded-full border-2 border-blue-200 mb-2" alt="avatar" />
            <div class="flex items-center mt-2">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              />
              <button 
                type="button" 
                @click="fileInput?.click()"
                class="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition"
              >
                选择头像
              </button>
              <button 
                v-if="avatarFile" 
                type="button" 
                @click="cancelAvatarUpload" 
                class="px-3 py-1 rounded bg-red-100 text-red-600 text-sm hover:bg-red-200 transition ml-2"
              >
                取消
              </button>
            </div>
            <p v-if="avatarFile" class="text-xs text-gray-500 mt-1">
              {{ avatarFile.name }} ({{ formatFileSize(avatarFile.size) }})
            </p>
          </div>

          <div class="mb-3">
            <label class="block text-gray-700 mb-1">昵称</label>
            <input v-model="editProfile.nickname" class="w-full px-3 py-2 border rounded" placeholder="请输入昵称" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">邮箱</label>
            <input v-model="editProfile.email" type="email" class="w-full px-3 py-2 border rounded" placeholder="请输入邮箱" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">手机号</label>
            <input v-model="editProfile.phone" class="w-full px-3 py-2 border rounded" placeholder="请输入手机号" />
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="updateProfileLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ updateProfileLoading ? '保存中...' : '保存' }}</button>
          </div>
        </form>
        <div class="mt-6 pt-4 border-t">
          <h3 class="text-lg font-semibold mb-3">修改密码</h3>
          <form @submit.prevent="onChangePassword">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">原密码</label>
              <input v-model="passwordChange.oldPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入原密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">新密码</label>
              <input v-model="passwordChange.newPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入新密码" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">确认新密码</label>
              <input v-model="passwordChange.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请再次输入新密码" />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
              <button type="submit" :disabled="updateProfileLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ updateProfileLoading ? '修改中...' : '修改密码' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 添加老师账号弹窗 -->
    <div v-if="showAddTeacherDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-blue-700">添加老师账号</h2>
        <p class="text-sm text-gray-600 mb-4">为学校创建新的老师账号，老师可以使用邮箱和密码登录系统</p>
        <form @submit.prevent="onAddTeacher">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">邮箱 <span class="text-red-500">*</span></label>
            <input v-model="newTeacher.email" required type="email" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入老师邮箱" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">昵称 <span class="text-red-500">*</span></label>
            <input v-model="newTeacher.nickname" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入老师昵称" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">手机号</label>
            <input v-model="newTeacher.phone" type="tel" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入手机号（可选）" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">初始密码 <span class="text-red-500">*</span></label>
            <input v-model="newTeacher.password" type="password" required minlength="6" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入初始密码（至少6位）" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">确认密码 <span class="text-red-500">*</span></label>
            <input v-model="newTeacher.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请再次输入密码" />
            <div v-if="newTeacher.password && newTeacher.confirmPassword && newTeacher.password !== newTeacher.confirmPassword" class="text-red-500 text-sm mt-1">
              两次输入的密码不一致
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showAddTeacherDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="addTeacherLoading || !isFormValid" class="px-4 py-1 rounded bg-blue-600 text-white disabled:bg-gray-400">{{ addTeacherLoading ? '添加中...' : '添加老师' }}</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 编辑老师账号弹窗 -->
    <div v-if="showEditTeacherDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">编辑老师信息</h2>
        <form @submit.prevent="onUpdateTeacher">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">邮箱</label>
            <input v-model="editTeacher.email" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">昵称</label>
            <input v-model="editTeacher.nickname" class="w-full px-3 py-2 border rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">手机号</label>
            <input v-model="editTeacher.phone" class="w-full px-3 py-2 border rounded" />
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showEditTeacherDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="editTeacherLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ editTeacherLoading ? '保存中...' : '保存' }}</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 禁用/启用确认弹窗 -->
    <div v-if="showDisableTeacherDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
        <h2 class="text-xl font-bold mb-4">确认{{ statusActionText }}该老师账号？</h2>
        <div class="mb-6 text-gray-700">{{ statusActionDescription }}</div>
        <div class="flex justify-center space-x-4">
          <button @click="showDisableTeacherDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
          <button @click="onConfirmUpdateStatus" :disabled="statusUpdateLoading" class="px-4 py-1 rounded bg-red-600 text-white">{{ statusUpdateLoading ? '处理中...' : '确认' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BriefcaseIcon, AcademicCapIcon, DocumentTextIcon, BuildingOffice2Icon, UserGroupIcon, ShieldCheckIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getAllUsers, createTeacher, updateUserInfo as updateSchoolUserInfo, updateUserStatus } from '@/lib/api/schoolAdmin'
import { getMe, updatePassword, updateUserInfo as updateAuthUserInfo, uploadAvatar, searchUser } from '@/lib/api/auth'
// 导入双师课堂相关API
import { 
  createCourse, 
  updateCourse,
  deleteCourse, 
  updateCourseStatus, 
  getTeacherCourses,
  CourseStatus,
  CourseType,
  DualTeacherCourseDTO,
  DualTeacherCourseVO,
  CourseResourceDTO,
  uploadResource,
  getResourcesByCourseId
} from '@/lib/api/classroom'
import { getEquipmentBookings, reviewEquipmentBooking } from '@/lib/api/resource'
import Button from '@/components/ui/Button.vue'
import Navbar from '@/components/layout/Navbar.vue'
import UserProfileInfo from '@/components/dashboard/UserProfileInfo.vue'

const school = ref({
  logo: 'https://randomuser.me/api/portraits/lego/2.jpg',
  name: '加载中...',
  code: '',
  contact: '',
  verified: false
})
const partnerCompanies = [
  '字节跳动科技有限公司',
  '阿里巴巴集团',
  '腾讯科技有限公司'
]

const blocks = ref([
  {
    title: '设备申请管理',
    icon: BriefcaseIcon,
    color: 'text-orange-500',
    data: [
      { id: 1, label: '待审核申请', extra: '3个' }
    ],
    empty: '暂无待审核申请',
    footer: { text: '管理设备申请', link: '/equipment/bookings' }
  },
  {
    title: '资源上传',
    icon: ArrowUpTrayIcon,
    color: 'text-purple-500',
    data: [],
    empty: '暂无上传资源',
    footer: { text: '上传资源', link: '/resource/upload' }
  },
  {
    title: '用户管理',
    icon: AcademicCapIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: '用户总数', extra: '12人' }
    ],
    empty: '暂无用户',
    footer: { text: '管理用户', link: '/users' }
  },
  {
    title: '学生管理',
    icon: DocumentTextIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: '学生总数', extra: '156人' }
    ],
    empty: '暂无学生',
    footer: { text: '管理学生', link: '/students' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: '进行中项目', extra: '8个' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/projects' }
  },
  {
    title: '企业合作',
    icon: BuildingOffice2Icon,
    color: 'text-purple-500',
    data: partnerCompanies.map((company, index) => ({ id: index + 1, label: company })),
    empty: '暂无合作企业',
    footer: { text: '管理合作', link: '/partners' }
  },
  {
    title: '系统设置',
    icon: ShieldCheckIcon,
    color: 'text-yellow-500',
    data: [
      { id: 1, label: '学校信息', extra: '已配置' }
    ],
    empty: '需要配置',
    footer: { text: '系统设置', link: '/settings' }
  }
])

// 用户相关
const teachers = ref<any[]>([])
const teacherTotal = ref(0)
const teacherPage = ref(0)
const teacherSize = ref(10)
const teacherLoading = ref(false)
const teacherError = ref('')

async function fetchTeachers() {
  teacherLoading.value = true
  teacherError.value = ''
  try {
    const res = await getAllUsers({ page: teacherPage.value, size: teacherSize.value }) as any
    teachers.value = res.data?.records || []
    teacherTotal.value = res.data?.total || teachers.value.length
  } catch (e: any) {
    teacherError.value = e.message || '获取用户列表失败'
    teachers.value = []
  } finally {
    teacherLoading.value = false
  }
}

const showAddTeacherDialog = ref(false)
const newTeacher = ref({ email: '', nickname: '', password: '', confirmPassword: '', phone: '' })
const addTeacherLoading = ref(false)

// 表单验证
const isFormValid = computed(() => {
  return newTeacher.value.email && 
         newTeacher.value.nickname && 
         newTeacher.value.password && 
         newTeacher.value.confirmPassword && 
         newTeacher.value.password === newTeacher.value.confirmPassword &&
         newTeacher.value.password.length >= 6
})

async function onAddTeacher() {
  // 前端验证
  if (!isFormValid.value) {
    alert('请完善表单信息，确保密码一致且至少6位')
    return
  }
  
  addTeacherLoading.value = true
  try {
    // 只传递需要的字段给API
    const teacherData = {
      email: newTeacher.value.email,
      nickname: newTeacher.value.nickname,
      password: newTeacher.value.password,
      phone: newTeacher.value.phone
    }
    
    await createTeacher(teacherData)
    showAddTeacherDialog.value = false
    newTeacher.value = { email: '', nickname: '', password: '', confirmPassword: '', phone: '' }
    await fetchTeachers()
    alert('老师账号创建成功')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    addTeacherLoading.value = false
  }
}

const showEditTeacherDialog = ref(false)
const editTeacher = ref<any>({})
const editTeacherLoading = ref(false)
const showDisableTeacherDialog = ref(false)
const statusUpdateId = ref<number | null>(null)
const statusUpdateTarget = ref<'active' | 'inactive' | 'pending_approval' | null>(null)
const statusUpdateLoading = ref(false)

const statusActionText = computed(() => {
  if (statusUpdateTarget.value === 'inactive') return '禁用'
  if (statusUpdateTarget.value === 'active') return '启用'
  return '更新状态'
})

const statusActionDescription = computed(() => {
  if (statusUpdateTarget.value === 'inactive') return '禁用后该用户将无法登录，操作可逆。'
  if (statusUpdateTarget.value === 'active') return '启用后该用户可以正常登录。'
  return '更新用户状态。'
})

function onEditUser(teacher: any) {
  editTeacher.value = { ...teacher }
  showEditTeacherDialog.value = true
}

async function onUpdateTeacher() {
  editTeacherLoading.value = true
  try {
    await updateSchoolUserInfo(editTeacher.value.id, {
      email: editTeacher.value.email,
      nickname: editTeacher.value.nickname,
      phone: editTeacher.value.phone
    })
    showEditTeacherDialog.value = false
    await fetchTeachers()
    alert('用户信息已更新')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    editTeacherLoading.value = false
  }
}

function onUpdateTeacherStatus(teacher: any, status: 'active' | 'inactive' | 'pending_approval') {
  statusUpdateId.value = teacher.id
  statusUpdateTarget.value = status
  showDisableTeacherDialog.value = true
}

async function onConfirmUpdateStatus() {
  if (!statusUpdateId.value || !statusUpdateTarget.value) return
  statusUpdateLoading.value = true
  try {
    await updateUserStatus(statusUpdateId.value, statusUpdateTarget.value)
    showDisableTeacherDialog.value = false
    await fetchTeachers()
    alert(`用户账号已${statusActionText.value}`)
  } catch (e: any) {
    alert(`${statusActionText.value}失败：` + (e.message || '未知错误'))
  } finally {
    statusUpdateLoading.value = false
    statusUpdateId.value = null
    statusUpdateTarget.value = null
  }
}

async function fetchSchoolInfo() {
  try {
    const res = await getMe() as any
    const userData = res.data
    if (userData) {
      school.value = {
        logo: userData.avatarUrl || 'https://randomuser.me/api/portraits/lego/2.jpg',
        name: userData.organizationName || userData.nickname || '未知学校',
        code: userData.organizationCode || '',
        contact: userData.nickname || userData.email || '',
        verified: userData.verified || false
      }
    }
  } catch (e: any) {
    console.error('获取学校信息失败:', e)
    // 保持默认值
  }
}

onMounted(() => {
  fetchSchoolInfo()
  fetchTeachers()
  fetchCourses()
  fetchRecentEquipmentBookings()
})

const router = useRouter()
const appStore = useAppStore()
const isLoggedIn = computed(() => !!appStore.user)
const userInfo = computed<{
  id?: number;
  account?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
}>(() => (appStore.user ? appStore.user as any : {}))
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/lego/2.jpg')
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
function onLogout() {
  appStore.logout()
  router.push('/login')
}

const showUserDialog = ref(false)
const showProfileDialog = ref(false)
const editProfile = ref({ nickname: '', email: '', phone: '' })

// 头像上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const previewAvatar = ref<string | null>(null)
const avatarUploading = ref(false)

function onEditProfileClick() {
  editProfile.value = {
    nickname: userInfo.value.nickname || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || ''
  }
  showProfileDialog.value = true
}

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

const updateProfileLoading = ref(false)

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    // 先使用auth API更新用户基本信息
    await updateAuthUserInfo({
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
    
    showProfileDialog.value = false
    
    // 重置头像上传状态
    avatarFile.value = null
    previewAvatar.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    await fetchSchoolInfo() // 重新获取学校信息
    
    // 更新store中的用户信息
    const res = await getMe() as any
    if (res.data) {
      appStore.setUser(res.data)
    }
    
    alert('个人资料更新成功')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    updateProfileLoading.value = false
  }
}

const passwordChange = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const changePasswordLoading = ref(false)

async function onChangePassword() {
  if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
    alert('新密码与确认密码不一致')
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
    alert('密码修改成功')
  } catch (e: any) {
    alert('密码修改失败：' + (e.message || '未知错误'))
  } finally {
    changePasswordLoading.value = false
  }
}

// 添加双师课堂相关变量
const activeTab = ref('users') // 增加标签页，默认显示用户管理
const courseList = ref<DualTeacherCourseVO[]>([])
const totalCourses = ref(0)
const courseCurrentPage = ref(1)
const coursePageSize = ref(10)
const courseLoading = ref(false)
const courseError = ref('')

// 课程表单数据
const showCourseDialog = ref(false)
const isEditingCourse = ref(false)
const currentCourseId = ref<number | null>(null)
const courseForm = ref<DualTeacherCourseDTO>({
  title: '',
  description: '',
  scheduledTime: '',
  maxStudents: 30,
  location: '',
  courseType: CourseType.HYBRID,
  mentorId: undefined
})

// 企业导师搜索相关
const mentorSearchKeyword = ref('')
const mentorSearching = ref(false)
const mentorSearchResults = ref<any[]>([])
const selectedMentor = ref<{id: number, name: string, role: string} | null>(null)

// 根据关键词搜索企业导师
async function searchMentor() {
  if (!mentorSearchKeyword.value.trim()) {
    alert('请输入企业导师的邮箱或手机号')
    return
  }
  
  mentorSearching.value = true
  try {
    const res = await searchUser(mentorSearchKeyword.value.trim()) as any
    const user = res.data
    
    if (user && (user.role === 'MENTOR' || user.role === 'mentor')) {
      mentorSearchResults.value = [user]
    } else if (user) {
      alert('搜索到的用户不是企业导师')
      mentorSearchResults.value = []
    } else {
      alert('未找到匹配的用户')
      mentorSearchResults.value = []
    }
  } catch (error) {
    console.error('搜索企业导师失败:', error)
    alert('搜索失败: ' + (error as any).message || '未知错误')
    mentorSearchResults.value = []
  } finally {
    mentorSearching.value = false
  }
}

// 选择企业导师
function selectMentor(mentor: any) {
  selectedMentor.value = {
    id: mentor.id,
    name: mentor.nickname || mentor.account || '未知导师',
    role: mentor.role
  }
  courseForm.value.mentorId = mentor.id
  mentorSearchResults.value = []
}

// 清除已选择的企业导师
function clearSelectedMentor() {
  selectedMentor.value = null
  courseForm.value.mentorId = undefined
}

// 资源上传相关
const showResourceDialog = ref(false)
const resourceForm = ref<CourseResourceDTO>({
  courseId: 0,
  title: '',
  description: '',
  resourceType: 'document'
})
const resourceFile = ref<File | null>(null)
const resourceFileInput = ref<HTMLInputElement | null>(null)
const uploadingResource = ref(false)

// 添加获取课程列表的方法
async function fetchCourses() {
  courseLoading.value = true
  courseError.value = ''
  try {
    // 这里我们直接调用课程API，实际使用时可以创建一个专门针对学校管理员的API
    // 假设使用教师课程列表作为示例
    const response = await getTeacherCourses(courseCurrentPage.value, coursePageSize.value)
    if (response && response.data) {
      courseList.value = response.data.records
      totalCourses.value = response.data.total
    }
  } catch (e: any) {
    courseError.value = e.message || '获取课程列表失败'
    courseList.value = []
  } finally {
    courseLoading.value = false
  }
}

// 打开创建课程对话框
function openCreateCourseDialog() {
  isEditingCourse.value = false
  currentCourseId.value = null
  resetCourseForm()
  showCourseDialog.value = true
}

// 打开编辑课程对话框
async function openEditCourseDialog(course: DualTeacherCourseVO) {
  isEditingCourse.value = true
  currentCourseId.value = course.id
  courseForm.value = {
    title: course.title,
    description: course.description,
    scheduledTime: course.scheduledTime,
    maxStudents: course.maxStudents,
    location: course.location,
    courseType: course.courseType as CourseType,
    mentorId: course.mentorId
  }
  
  // 如果有导师信息，则设置已选择导师
  if (course.mentorId && course.mentorName) {
    selectedMentor.value = {
      id: course.mentorId,
      name: course.mentorName,
      role: 'mentor'
    }
  } else {
    selectedMentor.value = null
  }
  
  showCourseDialog.value = true
}

// 保存课程（创建或更新）
async function saveCourse() {
  // 验证导师选择
  if (!courseForm.value.mentorId) {
    alert('请选择一位企业导师')
    return
  }
  
  try {
    if (isEditingCourse.value && currentCourseId.value) {
      await updateCourse(currentCourseId.value, courseForm.value)
      alert('课程更新成功')
    } else {
      await createCourse(courseForm.value)
      alert('课程创建成功')
    }
    
    showCourseDialog.value = false
    resetCourseForm()
    await fetchCourses()
  } catch (error: any) {
    alert('保存课程失败: ' + (error.message || '未知错误'))
  }
}

// 删除课程
async function onDeleteCourse(courseId: number) {
  if (confirm('确定要删除此课程吗？此操作不可恢复。')) {
    try {
      await deleteCourse(courseId)
      alert('课程删除成功')
      await fetchCourses()
    } catch (error: any) {
      alert('删除课程失败: ' + (error.message || '未知错误'))
    }
  }
}

// 更新课程状态
async function onUpdateCourseStatus(courseId: number, status: CourseStatus) {
  try {
    await updateCourseStatus(courseId, status)
    alert('课程状态更新成功')
    await fetchCourses()
  } catch (error: any) {
    alert('更新课程状态失败: ' + (error.message || '未知错误'))
  }
}

// 重置课程表单
function resetCourseForm() {
  courseForm.value = {
    title: '',
    description: '',
    scheduledTime: '',
    maxStudents: 30,
    location: '',
    courseType: CourseType.HYBRID,
    mentorId: undefined
  }
  
  // 清空导师搜索相关状态
  mentorSearchKeyword.value = ''
  mentorSearchResults.value = []
  selectedMentor.value = null
}

// 资源上传相关方法
function openResourceUploadDialog(courseId: number) {
  resourceForm.value.courseId = courseId
  resourceForm.value.title = ''
  resourceForm.value.description = ''
  resourceForm.value.resourceType = 'document'
  resourceFile.value = null
  showResourceDialog.value = true
}

function handleResourceFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    resourceFile.value = target.files[0]
  }
}

async function uploadCourseResource() {
  if (!resourceFile.value) {
    alert('请选择要上传的文件')
    return
  }
  
  uploadingResource.value = true
  try {
    const formData = new FormData()
    formData.append('file', resourceFile.value)
    formData.append('data', JSON.stringify(resourceForm.value))
    
    await uploadResource(formData)
    showResourceDialog.value = false
    alert('资源上传成功')
  } catch (error: any) {
    alert('资源上传失败: ' + (error.message || '未知错误'))
  } finally {
    uploadingResource.value = false
  }
}

// 获取课程状态显示文本
function getCourseStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'planning': '筹备中',
    'open': '开放报名',
    'in_progress': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取课程状态样式类
function getCourseStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    'planning': 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800',
    'open': 'px-2 py-1 rounded text-xs bg-green-100 text-green-800',
    'in_progress': 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-800',
    'completed': 'px-2 py-1 rounded text-xs bg-purple-100 text-purple-800',
    'cancelled': 'px-2 py-1 rounded text-xs bg-red-100 text-red-800'
  }
  return classMap[status] || 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'
}

// 设备预约相关
const recentEquipmentBookings = ref<any[]>([])
const recentEquipmentLoading = ref(false)
const recentEquipmentError = ref('')

async function fetchRecentEquipmentBookings() {
  recentEquipmentLoading.value = true
  recentEquipmentError.value = ''
  try {
    // 获取最近3条预约，按时间倒序
    const res: any = await getEquipmentBookings({ page: 0, size: 3 })
    if (res.code === 200 && res.data && Array.isArray(res.data.records)) {
      recentEquipmentBookings.value = res.data.records
    } else {
      recentEquipmentBookings.value = []
      recentEquipmentError.value = res.message || '获取设备预约数据失败'
    }
  } catch (e: any) {
    recentEquipmentBookings.value = []
    recentEquipmentError.value = e.message || '获取设备预约数据失败'
  } finally {
    recentEquipmentLoading.value = false
  }
}

function goToProjectAudit() {
  router.push('/project/audit')
}

const pendingProjectsCount = 0 // 这里可以通过接口获取真实数量
const approvedProjectsCount = 0
const rejectedProjectsCount = 0
</script> 