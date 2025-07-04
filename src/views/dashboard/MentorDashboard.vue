<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <!-- 项目相关入口 -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button @click="router.push('/project/search')" class="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">项目搜索与对接</button>
        <button @click="router.push('/project/publish')" class="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition">发布新项目</button>
        <button @click="router.push('/project/my')" class="px-6 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition">我的项目管理</button>
        <button @click="router.push('/my-project-applications')" class="px-6 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition">我的项目申请</button>
      </div>
      <!-- 头部区域 -->
      <UserProfileInfo
        :avatar="mentor.avatar"
        :name="mentor.name"
        :role="'企业导师'"
        :organization="mentor.company"
        :phone="mentor.phone"
        :email="mentor.email"
        :editable="true"
        :onEdit="onEditProfileClick"
      />
      <!-- Tab 导航栏 -->
      <DashboardTabs :tabs="mentorTabs" :activeTab="activeTab" @change="activeTab = $event" />
      <div class="mt-6">
        <JobManagement
          v-if="activeTab === 'job'"
          :jobs="jobs"
          :jobsLoading="jobsLoading"
          :totalJobs="totalJobs"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @create-job="openCreateJobDialog"
          @update:currentPage="fetchJobs"
          @update:sortBy="onSortByChange"
          @edit-job="onEditJob"
        />
        <ApplicationSummary
          v-if="activeTab === 'apply'"
          :allApplications="allApplications"
          :allApplicationsLoading="allApplicationsLoading"
          :applicationStatusMap="applicationStatusMap"
          :statusOptions="statusOptions"
          @update-status="app => onUpdateStatus(app, true)"
        />
        <ChatPanel v-if="activeTab === 'chat'" :myUserId="myUserId" :myAvatar="userAvatar" />
        <div v-if="activeTab === 'classroom'">
          <div class="bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-bold mb-4">我的课堂</h2>
            <div v-if="loading" class="text-center py-8 text-gray-400">加载中...</div>
            <div v-else-if="courses.length === 0" class="text-center py-8 text-gray-400">暂无课程</div>
            <div v-else class="overflow-x-auto rounded-lg shadow">
              <table class="min-w-full bg-white rounded-lg">
                <thead>
                  <tr class="bg-indigo-50">
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">课程名称</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">授课教师</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">时间</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">状态</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses" :key="course.id" class="hover:bg-indigo-50 transition">
                    <td class="px-6 py-4 whitespace-nowrap font-medium">{{ course.title }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ course.teacherName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ new Date(course.scheduledTime).toLocaleString() }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="statusTagClass(course.status)">{{ statusText(course.status) }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button @click="showCourseDetail(course.id)" class="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">详情</button>
                      <button @click="openEditDialog(course)" class="ml-2 px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs">编辑</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 可选：详情弹窗/跳转 -->
        </div>
      </div>
    </div>
    
    <!-- 课程详情对话框 -->
    <div v-if="showCourseDetailsDialog && currentCourse" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">课程详情</h2>
          <button @click="showCourseDetailsDialog = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold">{{ currentCourse.title }}</h3>
            <p class="text-gray-600 mt-1">{{ currentCourse.description }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">授课教师</p>
              <p>{{ currentCourse.teacherName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">企业导师</p>
              <p>{{ currentCourse.mentorName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程时间</p>
              <p>{{ formatDate(currentCourse.scheduledTime) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程地点</p>
              <p>{{ currentCourse.location || '未指定' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程类型</p>
              <p>{{ getCourseTypeText(currentCourse.courseType as CourseType) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">当前状态</p>
              <p>{{ getCourseStatusText(currentCourse.status as CourseStatus) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">已报名/最大人数</p>
              <p>{{ currentCourse.enrolledCount }}/{{ currentCourse.maxStudents }}</p>
            </div>
          </div>
          <div class="flex justify-end mt-4 space-x-2">
            <button @click="openResourceUploadDialog(currentCourse.id)" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              上传资源
            </button>
            <button @click="showCourseDetailsDialog = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              关闭
            </button>
          </div>
        </div>
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

    <!-- 编辑个人资料弹窗 -->
    <div v-if="showEditProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[80vh] relative">
        <button @click="showEditProfileDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
        <h2 class="text-2xl font-bold mb-4 text-blue-700">编辑个人资料</h2>
        <form @submit.prevent="onUpdateProfile">
          <!-- 头像上传 -->
          <div class="mb-5 flex flex-col items-center">
            <div class="relative group">
              <img :src="previewAvatar || mentor.avatar" class="w-24 h-24 rounded-full border-2 border-blue-200 mb-2 object-cover" alt="avatar" />
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
            <p v-if="avatarFile" class="text-xs text-gray-500 mt-1">
              {{ avatarFile.name }} ({{ formatFileSize(avatarFile.size) }})
              <button 
                type="button" 
                @click="cancelAvatarUpload" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                取消
              </button>
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
            <button type="button" @click="showEditProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
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
            <div class="flex justify-end space-x-2">
              <button type="submit" :disabled="changePasswordLoading" class="px-4 py-1 rounded bg-green-600 text-white">{{ changePasswordLoading ? '修改中...' : '修改密码' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 岗位创建弹窗（完全复用StudentDashboard.vue风格） -->
    <div v-if="showCreateJobDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md overflow-y-auto max-h-[90vh] relative">
        <button @click="showCreateJobDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">创建新岗位</h2>
        <form @submit.prevent="onCreateJob">
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位名称</label>
            <input v-model="newJob.title" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入岗位名称" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位描述</label>
            <textarea v-model="newJob.description" rows="3" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入岗位描述"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">工作地点</label>
            <input v-model="newJob.location" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入工作地点" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位类型</label>
            <select v-model="newJob.jobType" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">请选择岗位类型</option>
              <option value="full_time">全职</option>
              <option value="part_time">兼职</option>
              <option value="internship">实习</option>
              <option value="remote">远程</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">学历要求</label>
            <select v-model="newJob.educationRequirement" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">请选择学历要求</option>
              <option value="any">不限</option>
              <option value="bachelor">本科及以上</option>
              <option value="master">硕士及以上</option>
              <option value="doctorate">博士及以上</option>
            </select>
          </div>
          <div class="mb-4 flex space-x-2">
            <div class="flex-1">
              <label class="block text-gray-700 mb-1 font-medium">最低薪资</label>
              <input v-model.number="newJob.salaryMin" type="number" min="0" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="最低" />
            </div>
            <div class="flex-1">
              <label class="block text-gray-700 mb-1 font-medium">最高薪资</label>
              <input v-model.number="newJob.salaryMax" type="number" min="0" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="最高" />
            </div>
            <div class="flex-1">
              <label class="block text-gray-700 mb-1 font-medium">单位</label>
              <select v-model="newJob.salaryUnit" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="">请选择单位</option>
                <option value="per_month">元/月</option>
                <option value="per_year">元/年</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">招聘人数</label>
            <input v-model.number="newJob.headcount" type="number" min="1" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入人数" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">经验要求</label>
            <select v-model="newJob.experienceRequirement" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">请选择经验要求</option>
              <option value="any">不限</option>
              <option value="fresh_graduate">应届生</option>
              <option value="less_than_1_year">1年以下</option>
              <option value="1_to_3_years">1-3年</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">截止日期</label>
            <input v-model="newJob.applicationDeadline" type="date" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">技能标签</label>
            <input v-model="newJob.skillTags" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="多个标签用逗号分隔" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位分类</label>
            <select v-model="newJob.categoryId" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="0">请选择分类</option>
              <option v-for="cat in jobCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" @click="showCreateJobDialog = false" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">取消</button>
            <button type="submit" :disabled="createJobLoading" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex items-center">
              <svg v-if="createJobLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ createJobLoading ? '创建中...' : '创建' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 岗位编辑弹窗 -->
    <div v-if="showEditJobDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md overflow-y-auto max-h-[90vh] relative">
        <button @click="showEditJobDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">编辑岗位</h2>
        <form @submit.prevent="onUpdateJob">
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位名称</label>
            <input v-model="editJobData.title" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入岗位名称" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位描述</label>
            <textarea v-model="editJobData.description" rows="3" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入岗位描述"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">工作地点</label>
            <input v-model="editJobData.location" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入工作地点" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位类型</label>
            <select v-model="editJobData.jobType" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">请选择岗位类型</option>
              <option value="full_time">全职</option>
              <option value="part_time">兼职</option>
              <option value="internship">实习</option>
              <option value="remote">远程</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">学历要求</label>
            <select v-model="editJobData.educationRequirement" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">请选择学历要求</option>
              <option value="any">不限</option>
              <option value="bachelor">本科及以上</option>
              <option value="master">硕士及以上</option>
              <option value="doctorate">博士及以上</option>
            </select>
          </div>
          <div class="mb-4 flex space-x-2">
            <div class="flex-1">
              <label class="block text-gray-700 mb-1 font-medium">最低薪资</label>
              <input v-model.number="editJobData.salaryMin" type="number" min="0" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="最低" />
            </div>
            <div class="flex-1">
              <label class="block text-gray-700 mb-1 font-medium">最高薪资</label>
              <input v-model.number="editJobData.salaryMax" type="number" min="0" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="最高" />
            </div>
            <div class="flex-1">
              <label class="block text-gray-700 mb-1 font-medium">单位</label>
              <select v-model="editJobData.salaryUnit" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="">请选择单位</option>
                <option value="per_month">元/月</option>
                <option value="per_year">元/年</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">招聘人数</label>
            <input v-model.number="editJobData.headcount" type="number" min="1" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入人数" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">经验要求</label>
            <select v-model="editJobData.experienceRequirement" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">请选择经验要求</option>
              <option value="any">不限</option>
              <option value="fresh_graduate">应届生</option>
              <option value="less_than_1_year">1年以下</option>
              <option value="1_to_3_years">1-3年</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">截止日期</label>
            <input v-model="editJobData.applicationDeadline" type="date" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">技能标签</label>
            <input v-model="editJobData.skillTags" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="多个标签用逗号分隔" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1 font-medium">岗位分类</label>
            <select v-model="editJobData.categoryId" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="0">请选择分类</option>
              <option v-for="cat in jobCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" @click="showEditJobDialog = false" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">取消</button>
            <button type="submit" :disabled="editJobLoading" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex items-center">
              <svg v-if="editJobLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ editJobLoading ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 编辑课程弹窗 -->
    <div v-if="showEditDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" @click="closeEditDialog">×</button>
        <h2 class="text-xl font-bold mb-4">编辑课程</h2>
        <form @submit.prevent="onUpdateCourse">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程标题</label>
            <input v-model="editingCourse.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入课程标题" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程描述</label>
            <textarea v-model="editingCourse.description" rows="2" class="w-full px-3 py-2 border rounded" placeholder="请输入课程描述"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程时间</label>
            <input v-model="editingCourse.scheduledTime" type="datetime-local" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">最大学生数</label>
            <input v-model.number="editingCourse.maxStudents" type="number" min="1" max="100" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程地点</label>
            <input v-model="editingCourse.location" class="w-full px-3 py-2 border rounded" placeholder="请输入课程地点" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程类型</label>
            <select v-model="editingCourse.courseType" class="w-full px-3 py-2 border rounded">
              <option value="online">线上课程</option>
              <option value="offline">线下课程</option>
              <option value="hybrid">混合课程</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="closeEditDialog" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { UserGroupIcon, BriefcaseIcon, AcademicCapIcon, ArrowUpTrayIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getMe, updatePassword, updateUserInfo, uploadAvatar } from '@/lib/api/auth'
import Navbar from '@/components/layout/Navbar.vue'

// 导入双师课堂相关API
import { 
  getMentorCourses,
  updateCourse,
  CourseStatus,
  CourseType,
  DualTeacherCourseVO,
  CourseResourceDTO,
  uploadResource,
  deleteResource,
  getResourcesByCourseId
} from '@/lib/api/classroom'


import { getJobs, Job, createJob, JobCreationDTO, updateJob, getPublicJobCategories, getJobApplications, updateApplicationStatus } from '@/lib/api/job'
import GridJobList from '@/components/job/GridJobList.vue'
import { getResumeById } from '@/lib/api/resume'
import JobManagement from '@/components/dashboard/JobManagement.vue'
import ApplicationSummary from '@/components/dashboard/ApplicationSummary.vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import UserProfileInfo from '@/components/dashboard/UserProfileInfo.vue'
import DashboardTabs from '@/components/dashboard/DashboardTabs.vue'

// Tab栏相关声明，恢复岗位管理tab
const mentorTabs = [
  { label: '我的课堂', value: 'classroom' },
  { label: '岗位管理', value: 'job' },
  { label: '查看申请', value: 'apply' },
  { label: '聊天', value: 'chat' }
]
const activeTab = ref('classroom')

const mentor = ref({
  avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
  name: '加载中...',
  email: '',
  phone: '',
  verified: false,
  company: '加载中...',
  school: ''
})


// 定义更具体的类型
interface BlockDataItem {
  id: number;
  label: string;
  extra?: string;
}

interface BlockItem {
  title: string;
  icon: any;
  color: string;
  data: BlockDataItem[];
  empty: string;
  footer: { text: string; link: string };
}

// 修改blocks的定义使用具体类型
const blocks = ref<BlockItem[]>([
  {
    title: '双师课堂管理',
    icon: UserGroupIcon,
    color: 'text-blue-500',
    data: [],
    empty: '暂无课程',
    footer: { text: '管理课程', link: '/classroom' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: 'AI创新项目', extra: '进行中' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/project' }
  },
  {
    title: '学生成果查看',
    icon: AcademicCapIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: 'AI创新项目论文', extra: '李四' }
    ],
    empty: '暂无成果',
    footer: { text: '查看全部成果', link: '/achievements' }
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
    title: '学校信息浏览',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部学校', link: '/school/list' }
  },
  {
    title: '企业信息浏览',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部企业', link: '/company/list' }
  }
])

const router = useRouter()
const appStore = useAppStore()

const userInfo = computed(() => appStore.user as any || {})
const userAvatar = computed(() => userInfo.value.avatar || mentor.value.avatar)
const roleText = computed(() => {
  const role = userInfo.value?.role as string
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

// 添加课程相关响应式数据
const classroomCurrentPage = ref(1)
const classroomPageSize = ref(10)
const courseList = ref<DualTeacherCourseVO[]>([])
const totalCourses = ref(0)
const showCourseDetailsDialog = ref(false)
const currentCourse = ref<DualTeacherCourseVO | null>(null)

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

const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const previewAvatar = ref<string | null>(null)
const avatarUploading = ref(false)

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

// 添加 fetchMentorInfo 函数
async function fetchMentorInfo() {
  try {
    const res = await getMe() as any
    const userData = res.data
    if (userData) {
      mentor.value = {
        avatar: userData.avatar || 'https://randomuser.me/api/portraits/men/34.jpg',
        name: userData.nickname || userData.account || '未知导师',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        company: userData.organizationName || '未绑定企业',
        school: ''
      }
      // 关键：同步更新 appStore.user，保证 userInfo.value.id 有值
      appStore.setUser(userData)
    }
  } catch (e: any) {
    console.error('获取导师信息失败:', e)
    // 保持默认值
  }
}

// 添加获取导师参与的课程列表的方法
async function fetchMentorCourses() {
  try {
    const response = await getMentorCourses(classroomCurrentPage.value, classroomPageSize.value)
    if (response && response.data) {
      courseList.value = response.data.records
      totalCourses.value = response.data.total
      
      // 更新数据块中的课程信息
      const courseData: BlockDataItem[] = courseList.value.map(course => ({
        id: course.id,
        label: course.title,
        extra: new Date(course.scheduledTime).toLocaleDateString()
      }))
      
      // 更新blocks中的课程数据
      const courseBlockIndex = blocks.value.findIndex(block => block.title === '双师课堂管理')
      if (courseBlockIndex !== -1) {
        blocks.value[courseBlockIndex].data = courseData
      }
    }
  } catch (error) {
    console.error('获取导师课程列表失败:', error)
  }
}

// 查看课程详情


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
  } catch (error) {
    console.error('资源上传失败:', error)
    alert('资源上传失败: ' + (error as any).message || '未知错误')
  } finally {
    uploadingResource.value = false
  }
}

// 格式化日期显示
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取课程状态中文名称
function getCourseStatusText(status: CourseStatus) {
  const statusMap: Record<string, string> = {
    'planning': '筹备中',
    'open': '开放报名',
    'in_progress': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 获取课程类型中文名称
function getCourseTypeText(type: CourseType) {
  const typeMap: Record<string, string> = {
    'online': '线上',
    'offline': '线下',
    'hybrid': '混合'
  }
  return typeMap[type] || '未知类型'
}

onMounted(async () => {
  await fetchMentorInfo()
  fetchMentorCourses()
  // 如果初始tab是岗位，自动查一次岗位
  if (activeTab.value === 'job') {
    fetchJobs()
  } else if (activeTab.value === 'apply') {
    fetchAllApplications()
  }
  fetchCourses()
})

watch(activeTab, (tab) => {
  if (tab === 'job') {
    fetchJobs()
  } else if (tab === 'apply') {
    fetchAllApplications()
  }
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

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
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
      } catch (avatarError) {
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
    await fetchMentorInfo() // 重新获取导师信息
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

// 当打开编辑对话框时，初始化表单数据
function openEditDialog(course) {
  editingCourse.value = { ...course }
  showEditDialog.value = true
}

function closeEditDialog() {
  showEditDialog.value = false
  editingCourse.value = null
}

async function onUpdateCourse() {
  if (!editingCourse.value) return
  try {
    // 调用 updateCourse API，传递 editingCourse.value
    await updateCourse(editingCourse.value.id, editingCourse.value)
    showEditDialog.value = false
    editingCourse.value = null
    fetchCourses()
    alert('课程更新成功')
  } catch (e) {
    alert('更新失败：' + (e.message || '未知错误'))
  }
}

const jobs = ref<Job[]>([])
const totalJobs = ref(0)
const totalPages = ref(1)
const jobsLoading = ref(false)
const sortBy = ref('latest')
const pageSize = ref(10)

function onSortByChange(newSort) {
  sortBy.value = newSort
  fetchJobs(1)
}

async function fetchJobs(page = 1) {
  jobsLoading.value = true
  try {
    const res = await getJobs({
      posterId: userInfo.value.id,
      page: page,
      size: pageSize.value,
      sortBy: sortBy.value
    })
    jobs.value = res.data.records
    totalJobs.value = res.data.total
    totalPages.value = res.data.pages
    currentPage.value = page
  } finally {
    jobsLoading.value = false
  }
}

const showCreateJobDialog = ref(false)
const createJobLoading = ref(false)
const newJob = ref<JobCreationDTO>({
  title: '',
  description: '',
  location: '',
  jobType: '',
  educationRequirement: '',
  salaryMin: undefined,
  salaryMax: undefined,
  salaryUnit: '',
  headcount: undefined,
  experienceRequirement: '',
  applicationDeadline: '',
  skillTags: '',
  categoryId: 0
})

const jobCategories = ref<{ id: number; name: string }[]>([])

async function fetchJobCategories() {
  // 只查三级分类，假设后端返回全部分类，前端筛选 level===3
  const res = await getPublicJobCategories({ page: 1, size: 100 })
  if (res && res.data && Array.isArray(res.data)) {
    jobCategories.value = res.data.filter((cat: any) => cat.level === 3).map((cat: any) => ({ id: cat.id, name: cat.name }))
  }
}

// 打开创建岗位弹窗时拉取分类
function openCreateJobDialog() {
  fetchJobCategories()
  showCreateJobDialog.value = true
}

async function onCreateJob() {
  createJobLoading.value = true
  try {
    await createJob(newJob.value)
    showCreateJobDialog.value = false
    // 重置表单
    newJob.value = {
      title: '',
      description: '',
      location: '',
      jobType: '',
      educationRequirement: '',
      salaryMin: undefined,
      salaryMax: undefined,
      salaryUnit: '',
      headcount: undefined,
      experienceRequirement: '',
      applicationDeadline: '',
      skillTags: '',
      categoryId: 0
    }
    await fetchJobs()
    alert('岗位创建成功！')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    createJobLoading.value = false
  }
}

const showEditJobDialog = ref(false)
const editJobLoading = ref(false)
const editJobId = ref<number | null>(null)
const editJobData = ref<JobCreationDTO>({
  title: '',
  description: '',
  location: '',
  jobType: '',
  educationRequirement: '',
  salaryMin: undefined,
  salaryMax: undefined,
  salaryUnit: '',
  headcount: undefined,
  experienceRequirement: '',
  applicationDeadline: '',
  skillTags: '',
  categoryId: 0
})

function onEditJob(job: Job) {
  fetchJobCategories()
  editJobId.value = job.id
  editJobData.value = {
    title: job.title,
    description: job.description,
    location: job.location,
    jobType: job.jobType,
    educationRequirement: job.educationRequirement,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryUnit: job.salaryUnit ?? '',
    headcount: job.headcount ?? undefined,
    experienceRequirement: job.experienceRequirement ?? '',
    applicationDeadline: job.applicationDeadline ?? '',
    skillTags: job.skillTags ?? '',
    categoryId: job.category?.id || 0
  }
  showEditJobDialog.value = true
}

async function onUpdateJob() {
  if (!editJobId.value) return
  editJobLoading.value = true
  try {
    await updateJob(editJobId.value, editJobData.value)
    showEditJobDialog.value = false
    await fetchJobs(currentPage.value)
    alert('岗位信息已更新！')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    editJobLoading.value = false
  }
}

const showApplicationsDialog = ref(false)
const applications = ref<any[]>([])
const applicationsLoading = ref(false)
const selectedJob = ref<Job | null>(null)
const applicationsPage = ref(1)
const applicationsTotal = ref(0)
const applicationsPageSize = ref(10)

const showResumeDialog = ref(false)
const resumeDetail = ref<any>(null)
const resumeLoading = ref(false)

const statusOptions = [
  { value: 'submitted', label: '已提交' },
  { value: 'viewed', label: '已查看' },
  { value: 'interviewing', label: '面试中' },
  { value: 'offered', label: '已录用' },
  { value: 'rejected', label: '已拒绝' }
]

// 用于临时存储每个申请的下拉状态
const applicationStatusMap = ref<Record<number, string>>({})

async function onUpdateStatus(app, isAll = false) {
  const newStatus = applicationStatusMap.value[app.id]
  if (!newStatus || newStatus === app.status) {
    alert('请选择不同的状态')
    return
  }
  await updateApplicationStatus(app.id, { status: newStatus })
  if (isAll) {
    await fetchAllApplications()
  } else {
    await fetchApplications(applicationsPage.value)
  }
  alert('状态已更新')
}

async function openApplicationsDialog(job: Job) {
  selectedJob.value = job
  showApplicationsDialog.value = true
  await fetchApplications()
}

async function fetchApplications(page = 1) {
  if (!selectedJob.value) return
  applicationsLoading.value = true
  try {
    const res = await getJobApplications(selectedJob.value.id, page, applicationsPageSize.value)
    applications.value = res.data.records || []
    applicationsTotal.value = res.data.total || 0
    applicationsPage.value = page
    // 初始化下拉状态
    applicationStatusMap.value = {}
    for (const app of applications.value) {
      applicationStatusMap.value[app.id] = app.status
    }
  } finally {
    applicationsLoading.value = false
  }
}

async function onViewResume(resumeId: number) {
  resumeLoading.value = true
  showResumeDialog.value = true
  try {
    const res = await getResumeById(resumeId)
    resumeDetail.value = res.data
  } finally {
    resumeLoading.value = false
  }
}

// 一次性展示所有岗位的所有申请人
const allApplications = ref<any[]>([])
const showAllApplicationsDialog = ref(false)
const allApplicationsLoading = ref(false)

async function fetchAllApplications() {
  allApplicationsLoading.value = true
  try {
    const jobsRes = await getJobs({ posterId: userInfo.value.id, page: 1, size: 100 })
    const jobs = jobsRes.data.records || []
    let applications: any[] = []
    for (const job of jobs) {
      const res = await getJobApplications(job.id, 1, 100)
      const apps = (res.data.records || []).map(app => ({
        ...app,
        jobTitle: job.title,
        jobId: job.id
      }))
      applications = applications.concat(apps)
    }
    // 批量补全 resumeUrl
    for (const app of applications) {
      if (!app.resumeUrl && app.resumeId) {
        try {
          const resumeRes = await getResumeById(app.resumeId)
          app.resumeUrl = resumeRes.data?.resumeUrl || ''
        } catch (e) {
          app.resumeUrl = ''
        }
      }
    }
    allApplications.value = applications
    // 初始化下拉状态
    applicationStatusMap.value = {}
    for (const app of applications) {
      applicationStatusMap.value[app.id] = app.status
    }
  } finally {
    allApplicationsLoading.value = false
  }
}

const myUserId = computed(() => userInfo.value.id)

const currentPage = ref(1)

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}

const courses = ref([])
const loading = ref(false)
async function fetchCourses() {
  loading.value = true
  try {
    // 调用企业导师课程列表接口
    const res = await getMentorCourses(1, 10)
    // 兼容接口返回结构
    courses.value = res.data?.records || res.data || []
  } finally {
    loading.value = false
  }
}

function statusText(status) {
  const map = { planning: '筹备中', open: '开放报名', in_progress: '进行中', completed: '已结束', cancelled: '已取消' }
  return map[status] || status
}

function showCourseDetail(id) {
  // 跳转或弹窗显示课程详情
}

function statusTagClass(status) {
  const map = {
    planning: 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800',
    open: 'px-2 py-1 rounded text-xs bg-green-100 text-green-800',
    in_progress: 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-800',
    completed: 'px-2 py-1 rounded text-xs bg-purple-100 text-purple-800',
    cancelled: 'px-2 py-1 rounded text-xs bg-red-100 text-red-800'
  }
  return map[status] || 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'
}

const showEditDialog = ref(false)
const editingCourse = ref(null)
</script> 