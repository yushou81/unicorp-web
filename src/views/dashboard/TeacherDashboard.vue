<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <UserProfileInfo
          :avatar="userAvatar"
          :name="teacher.name"
          :role="'教师'"
          :organization="organizationName || teacher.school || '未绑定'"
          :organizationLogo="organizationLogo"
          :phone="teacher.phone"
          :email="teacher.email"
          :editable="true"
          :verified="teacher.verified"
          :onEdit="onEditProfileClick"
      />
      
      <!-- 项目相关入口 -->
   
      
      <DashboardTabs
          :tabs="[
            { label: '我的课堂', value: 'my-courses' },
            { label: '资源管理', value: 'resources' }
          ]"
          :activeTab="activeTab"
          @change="activeTab = $event"
      />
      <div class="flex justify-end mt-8">
        <button @click="showCreateDialog = true" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow">
          创建双师课堂
        </button>
      </div>
      <div v-if="activeTab === 'my-courses'">
        <div class="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 class="text-xl font-semibold mb-4">我的双师课堂课程</h2>
          <div v-if="loadingCourses" class="text-center py-8 text-gray-400">加载中...</div>
          <div v-else-if="courses.length === 0" class="text-center py-8 text-gray-400">暂无课程</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">课程名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">人数</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="course in courses" :key="course.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ course.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ new Date(course.scheduledTime).toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ courseTypeText(course.courseType) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ course.enrolledCount }}/{{ course.maxStudents }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select v-model="course.status" @change="onUpdateCourseStatus(course)" class="border rounded px-2 py-1">
                    <option value="planning">筹备中</option>
                    <option value="open">开放报名</option>
                    <option value="in_progress">进行中</option>
                    <option value="completed">已结束</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <router-link :to="`/classroom/${course.id}`" class="text-green-600 hover:text-green-900">详情</router-link>
                  <button @click="openEditDialog(course)" class="text-blue-600 hover:text-blue-900">编辑</button>
                  <button @click="onDeleteCourse(course.id)" class="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="flex justify-end mt-4 space-x-2">
              <button :disabled="page === 1" @click="changePage(page-1)" class="px-3 py-1 rounded bg-gray-200 text-gray-700">上一页</button>
              <span class="px-2">第 {{ page }} 页 / 共 {{ totalPages }} 页</span>
              <button :disabled="page === totalPages" @click="changePage(page+1)" class="px-3 py-1 rounded bg-gray-200 text-gray-700">下一页</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'resources'">
        <div class="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-blue-700">资源管理</h2>
            <div class="flex space-x-2">
              <router-link to="/resource/upload" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                上传资源
              </router-link>
              <router-link to="/resource" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                浏览资源
              </router-link>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-5 bg-blue-50 hover:shadow-md transition-shadow">
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 class="text-lg font-medium text-gray-800">上传教学资源</h3>
              </div>
              <p class="text-gray-600 mb-4">
                分享您的教学资料、课件、实验指导等资源，支持多种文件格式。上传的资源可以设置为公开或仅组织内可见。
              </p>
              <router-link to="/resource/upload" class="inline-flex items-center text-blue-600 hover:text-blue-800">
                立即上传
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
            
            <div class="border rounded-lg p-5 bg-green-50 hover:shadow-md transition-shadow">
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-800">可用资源</h3>
              </div>
              <p class="text-gray-600 mb-4">
                查看系统中所有可用资源。
              </p>
              <router-link to="/resource" class="inline-flex items-center text-green-600 hover:text-green-800">
                查看可用资源
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-5 mb-6">
            <h3 class="font-medium text-gray-700 mb-3">可上传的资源类型</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex items-center">
                <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span class="text-sm">课件</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span class="text-sm">技术文档</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span class="text-sm">数据集</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span class="text-sm">教学视频</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span class="text-sm">实验指导</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                <span class="text-sm">专利文献</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                <span class="text-sm">案例分析</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                <span class="text-sm">其他资源</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg border shadow-sm">
            <div class="p-4 border-b flex justify-between items-center">
              <h3 class="font-semibold text-gray-800">我上传的资源</h3>
              <div class="flex space-x-2">
                <input 
                  type="text" 
                  v-model="resourceKeyword" 
                  placeholder="搜索资源" 
                  class="px-3 py-1 text-sm border rounded-md"
                />
                <button 
                  @click="loadMyResources" 
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                >
                  搜索
                </button>
              </div>
            </div>
            
            <div v-if="loadingResources" class="p-8 text-center text-gray-500">
              <svg class="animate-spin h-8 w-8 mx-auto mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              加载中...
            </div>
            
            <div v-else-if="myResources.length === 0" class="p-8 text-center text-gray-500">
              暂无上传的资源
            </div>
            
            <div v-else>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">资源名称</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">上传时间</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">可见性</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="resource in myResources" :key="resource.id" class="hover:bg-gray-50">
                      <td class="px-4 py-3">
                        <router-link :to="`/resource/${resource.id}`" class="text-blue-600 hover:text-blue-800 font-medium">
                          {{ resource.title }}
                        </router-link>
                      </td>
                      <td class="px-4 py-3 text-gray-600">{{ resource.resourceType }}</td>
                      <td class="px-4 py-3 text-gray-600">{{ new Date(resource.createdAt).toLocaleDateString() }}</td>
                      <td class="px-4 py-3">
                        <span 
                          :class="{
                            'bg-green-100 text-green-800': resource.visibility === 'public',
                            'bg-blue-100 text-blue-800': resource.visibility === 'organization_only',
                            'bg-gray-100 text-gray-800': resource.visibility === 'private'
                          }" 
                          class="px-2 py-1 text-xs rounded-full"
                        >
                          {{ getVisibilityText(resource.visibility) }}
                        </span>
                      </td>
                      <td class="px-4 py-3 space-x-2">
                        <router-link :to="`/resource/${resource.id}`" class="text-blue-600 hover:text-blue-800">
                          查看
                        </router-link>
                        <button @click="confirmDelete(resource)" class="text-red-600 hover:text-red-800">
                          删除
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="flex justify-between items-center p-4 border-t">
                <div class="text-sm text-gray-500">
                  共 {{ resourceTotal }} 条记录
                </div>
                <div class="flex space-x-2">
                  <button 
                    :disabled="resourcePage === 1" 
                    @click="resourcePage > 1 && (resourcePage--, loadMyResources())"
                    :class="[
                      'px-3 py-1 rounded text-sm',
                      resourcePage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    ]"
                  >
                    上一页
                  </button>
                  <span class="px-3 py-1 text-sm">{{ resourcePage }} / {{ Math.ceil(resourceTotal / resourceSize) || 1 }}</span>
                  <button 
                    :disabled="resourcePage >= Math.ceil(resourceTotal / resourceSize)" 
                    @click="resourcePage < Math.ceil(resourceTotal / resourceSize) && (resourcePage++, loadMyResources())"
                    :class="[
                      'px-3 py-1 rounded text-sm',
                      resourcePage >= Math.ceil(resourceTotal / resourceSize) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    ]"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showCreateDialog || showEditDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" @click="closeDialog">×</button>
          <h2 class="text-xl font-bold mb-4">{{ showEditDialog ? '编辑课程' : '创建双师课堂课程' }}</h2>
          <form @submit.prevent="showEditDialog ? onUpdateCourse() : onCreateCourse()">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程标题</label>
              <input v-model="form.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入课程标题" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程描述</label>
              <textarea v-model="form.description" rows="2" class="w-full px-3 py-2 border rounded" placeholder="请输入课程描述"></textarea>
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程时间</label>
              <input v-model="form.scheduledTime" type="datetime-local" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">最大学生数</label>
              <input v-model.number="form.maxStudents" type="number" min="1" max="100" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程地点</label>
              <input v-model="form.location" class="w-full px-3 py-2 border rounded" placeholder="请输入课程地点" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程类型</label>
              <select v-model="form.courseType" class="w-full px-3 py-2 border rounded">
                <option value="online">线上课程</option>
                <option value="offline">线下课程</option>
                <option value="hybrid">混合课程</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">企业导师</label>
              <div class="flex space-x-2">
                <input v-model="mentorSearchKeyword" class="flex-1 px-3 py-2 border rounded" placeholder="输入导师邮箱或手机号" />
                <button type="button" @click="searchMentor" class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">搜索</button>
              </div>
              <div v-if="mentorSearchResult" class="mt-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                <span>{{ mentorSearchResult.nickname || mentorSearchResult.email || mentorSearchResult.phone }}</span>
                <button type="button" @click="selectMentor(mentorSearchResult)" class="ml-2 px-2 py-1 bg-green-500 text-white rounded">选择</button>
              </div>
              <div v-if="selectedMentor" class="mt-2 p-2 bg-green-50 rounded flex items-center justify-between">
                <span>已选导师：{{ selectedMentor.nickname || selectedMentor.email || selectedMentor.phone }}</span>
                <button type="button" @click="clearSelectedMentor" class="ml-2 px-2 py-1 bg-red-500 text-white rounded">移除</button>
              </div>
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="closeDialog" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
              <button type="submit" :disabled="loading" class="px-4 py-1 rounded bg-blue-600 text-white">
                {{ loading ? (showEditDialog ? '保存中...' : '创建中...') : (showEditDialog ? '保存' : '创建') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showDetailDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" @click="showDetailDialog = false">×</button>
          <h2 class="text-xl font-bold mb-4">课程详情</h2>
          <div v-if="detailLoading" class="text-center py-8 text-gray-400">加载中...</div>
          <div v-else-if="!detailCourse" class="text-center py-8 text-gray-400">未找到课程</div>
          <div v-else>
            <div class="mb-2"><b>课程名称：</b>{{ detailCourse.title }}</div>
            <div class="mb-2"><b>描述：</b>{{ detailCourse.description }}</div>
            <div class="mb-2"><b>时间：</b>{{ new Date(detailCourse.scheduledTime).toLocaleString() }}</div>
            <div class="mb-2"><b>类型：</b>{{ courseTypeText(detailCourse.courseType) }}</div>
            <div class="mb-2"><b>人数：</b>{{ detailCourse.enrolledCount }}/{{ detailCourse.maxStudents }}</div>
            <div class="mb-2"><b>状态：</b>{{ statusText(detailCourse.status) }}</div>
            <div class="mb-2"><b>企业导师：</b>{{ detailCourse.mentorName || '-' }}</div>
            <div class="mb-2"><b>企业名称：</b>{{ detailCourse.enterpriseName || '-' }}</div>
            <div class="mb-2"><b>地点：</b>{{ detailCourse.location || '-' }}</div>
            <div class="mb-2"><b>创建时间：</b>{{ new Date(detailCourse.createdAt).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 编辑资料弹窗 -->
  <div v-if="showProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[80vh] relative">
      <button @click="showProfileDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
      <h2 class="text-2xl font-bold mb-4 text-blue-700">编辑个人资料</h2>
      <form @submit.prevent="onUpdateProfile">
        <!-- 头像上传 -->
        <div class="mb-5 flex flex-col items-center">
          <div class="relative group">
            <img :src="previewAvatar || userAvatar" class="w-24 h-24 rounded-full border-2 border-blue-200 mb-2 object-cover" alt="avatar" />
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
          <button type="button" @click="showProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
          <button type="submit" :disabled="updateProfileLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ updateProfileLoading ? '保存中...' : '保存' }}</button>
        </div>
      </form>
      <div class="mt-6 pt-4 border-t">
        <h3 class="text-lg font-semibold mb-3">修改密码</h3>
        <form @submit.prevent="onChangePassword">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">原密码</label>
            <input v-model="changePwdForm.oldPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入原密码" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">新密码</label>
            <input v-model="changePwdForm.newPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入新密码" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">确认新密码</label>
            <input v-model="changePwdForm.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请再次输入新密码" />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="submit" :disabled="changePwdLoading" class="px-4 py-1 rounded bg-green-600 text-white">{{ changePwdLoading ? '修改中...' : '修改密码' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- 修改密码弹窗 -->
  <div v-if="showChangePwdDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[80vh] relative">
      <button @click="showChangePwdDialog = false" class="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
      <h2 class="text-2xl font-bold mb-4 text-blue-700">修改密码</h2>
      <form @submit.prevent="onChangePassword">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1 text-sm font-medium">原密码</label>
          <input v-model="changePwdForm.oldPassword" type="password" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入原密码" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1 text-sm font-medium">新密码</label>
          <input v-model="changePwdForm.newPassword" type="password" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请输入新密码" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1 text-sm font-medium">确认新密码</label>
          <input v-model="changePwdForm.confirmPassword" type="password" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="请再次输入新密码" required />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="showChangePwdDialog = false" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">取消</button>
          <button type="submit" :disabled="changePwdLoading" class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center">
            <svg v-if="changePwdLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ changePwdLoading ? '提交中...' : '提交' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getMe, searchUser, uploadAvatar, updateUserInfo } from '@/lib/api/auth'
import Navbar from '@/components/layout/Navbar.vue'
import UserProfileInfo from '@/components/dashboard/UserProfileInfo.vue'
import DashboardTabs from '@/components/dashboard/DashboardTabs.vue'
import { createCourse, getTeacherCourses, updateCourse, deleteCourse, getCourseById, updateCourseStatus } from '@/lib/api/classroom'
import { getMyUploadedResources, deleteResource } from '@/lib/api/resource'
import { getSchoolById, getEnterpriseById } from '@/lib/api/organization'

const organizationLogo = ref('')
const organizationName = ref('')
// 资源相关类型定义
interface ResourceVO {
  id: number
  title: string
  resourceType: string
  description: string
  createdAt: string
  updatedAt: string
  visibility: 'public' | 'private' | 'organization_only'
  authorId: number
  [key: string]: any
}

interface PageResponse<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

const router = useRouter()

const teacher = ref({
  // avatar: 'https://randomuser.me/api/portraits/men/33.jpg', // 移除本地avatar字段
  name: '加载中...',
  email: '',
  phone: '',
  verified: false,
  school: '加载中...',
  company: ''
})

const appStore = useAppStore()
const userInfo = computed(() => appStore.user as any || {})
// 统一 userAvatar 逻辑，和 Navbar 及其他 dashboard 保持一致
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/men/32.jpg')

const activeTab = ref('my-courses')

// 课程列表相关
const courses = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const loadingCourses = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))

async function fetchCourses() {
  loadingCourses.value = true
  try {
    const res = await getTeacherCourses(page.value, size.value)
    if (res && res.data) {
      courses.value = res.data.records
      total.value = res.data.total
    }
  } catch (e) {
    courses.value = []
    total.value = 0
  } finally {
    loadingCourses.value = false
  }
}

function changePage(newPage: number) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    fetchCourses()
  }
}

function courseTypeText(type: string) {
  if (type === 'online') return '线上课程'
  if (type === 'offline') return '线下课程'
  if (type === 'hybrid') return '混合课程'
  return type
}
function statusText(status: string) {
  const map: Record<string, string> = {
    planning: '筹备中',
    open: '开放报名',
    in_progress: '进行中',
    completed: '已结束',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(async () => {
  console.log('【当前页面】TeacherDashboard.vue onMounted 被调用')
  fetchCourses()
  loadMyResources()
  // 新增：获取用户信息
  try {
    const res = await getMe()
    if (res && res.data) {
      teacher.value = {
        // avatar: res.data.avatar || 'https://randomuser.me/api/portraits/men/33.jpg', // 不再单独存avatar
        name: res.data.nickname || res.data.account || '未知教师',
        email: res.data.email || '',
        phone: res.data.phone || '',
        verified: res.data.verified || false,
        school: res.data.organizationName || '未绑定',
        company: res.data.companyName || ''
      }
      // 关键：同步更新 appStore.user，保证 userAvatar 有真实头像
      appStore.setUser(res.data)
      await fetchOrganizationInfo()
    }
  } catch (e) {
    // 获取失败时保留默认值
  }
})

async function fetchUserInfo() {
  console.log('【当前页面】TeacherDashboard.vue fetchUserInfo 被调用')
  // 假设 teacher 里有 role 和 organizationId
  await fetchOrganizationInfo()
}

async function fetchOrganizationInfo() {
  // 打印所有相关对象，便于调试
  console.log('teacher:', teacher)
  console.log('userInfo:', userInfo)
  // 优先从teacher.schoolId、teacher.organizationId、userInfo.organizationId等字段获取组织ID
  const organizationId = teacher.value?.schoolId || teacher.schoolId || teacher.value?.organizationId || teacher.organizationId || userInfo.organizationId || userInfo.value?.organizationId
  const role = teacher.role || teacher.value?.role || userInfo.role || userInfo.value?.role || 'teacher'
  console.log('【当前页面】TeacherDashboard.vue fetchOrganizationInfo 被调用', role, organizationId)
  if (role && organizationId) {
    let orgRes = await getSchoolById(organizationId)
    console.log('getSchoolById 返回:', orgRes)
    if (orgRes && orgRes.data) {
      organizationLogo.value = orgRes.data.logoUrl
      organizationName.value = orgRes.data.organizationName
      console.log('设置 organizationLogo:', organizationLogo.value, 'organizationName:', organizationName.value)
    }
  }
}

// 创建/编辑课程相关
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingCourseId = ref<number|null>(null)
const loading = ref(false)
const mentorSearchKeyword = ref('')
const mentorSearchResult = ref(null)
const selectedMentor = ref(null)
const form = ref({
  title: '',
  description: '',
  scheduledTime: '',
  maxStudents: 30,
  location: '',
  courseType: 'hybrid',
  mentorId: ''
})

function openEditDialog(course: any) {
  showEditDialog.value = true
  showCreateDialog.value = false
  editingCourseId.value = course.id
  form.value = {
    title: course.title,
    description: course.description,
    scheduledTime: course.scheduledTime.slice(0, 16),
    maxStudents: course.maxStudents,
    location: course.location,
    courseType: course.courseType,
    mentorId: course.mentorId || ''
  }
  selectedMentor.value = course.mentorId ? { id: course.mentorId, nickname: course.mentorName } : null
}
function closeDialog() {
  showCreateDialog.value = false
  showEditDialog.value = false
  editingCourseId.value = null
  form.value = {
    title: '',
    description: '',
    scheduledTime: '',
    maxStudents: 30,
    location: '',
    courseType: 'hybrid',
    mentorId: ''
  }
}
async function onCreateCourse() {
  loading.value = true
  try {
    await createCourse(form.value)
    showCreateDialog.value = false
    form.value = {
      title: '',
      description: '',
      scheduledTime: '',
      maxStudents: 30,
      location: '',
      courseType: 'hybrid',
      mentorId: ''
    }
    fetchCourses()
    alert('课程创建成功')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}
async function onUpdateCourse() {
  if (!editingCourseId.value) return
  loading.value = true
  try {
    await updateCourse(editingCourseId.value, form.value)
    showEditDialog.value = false
    editingCourseId.value = null
    fetchCourses()
    alert('课程更新成功')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}
async function onDeleteCourse(id: number) {
  if (!confirm('确定要删除此课程吗？此操作不可恢复。')) return
  loading.value = true
  try {
    await deleteCourse(id)
    fetchCourses()
    alert('课程已删除')
  } catch (e: any) {
    alert('删除失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}
async function onUpdateCourseStatus(course) {
  try {
    await updateCourseStatus(course.id, course.status)
    fetchCourses()
    alert('课程状态已更新')
  } catch (e) {
    alert('更新课程状态失败：' + (e.message || '未知错误'))
    fetchCourses()
  }
}
// 课程详情相关
const showDetailDialog = ref(false)
const detailLoading = ref(false)
const detailCourse = ref<any>(null)
async function showCourseDetail(id: number) {
  showDetailDialog.value = true
  detailLoading.value = true
  detailCourse.value = null
  try {
    const res = await getCourseById(id)
    detailCourse.value = res.data
  } catch (e) {
    detailCourse.value = null
  } finally {
    detailLoading.value = false
  }
}
async function searchMentor() {
  if (!mentorSearchKeyword.value.trim()) {
    alert('请输入导师邮箱或手机号')
    return
  }
  try {
    const res = await searchUser(mentorSearchKeyword.value.trim())
    if (
      res.data &&
      (
        res.data.role === 'MENTOR' ||
        res.data.role === 'mentor' ||
        res.data.role === 'EN_TEACHER' ||
        res.data.role === 'en_teacher'
      )
    ) {
      mentorSearchResult.value = res.data
    } else {
      alert('该用户不是企业导师')
      mentorSearchResult.value = null
    }
  } catch (e) {
    alert('未找到该用户')
    mentorSearchResult.value = null
  }
}
function selectMentor(user) {
  selectedMentor.value = user
  form.value.mentorId = user.id
  mentorSearchResult.value = null
}
function clearSelectedMentor() {
  selectedMentor.value = null
  form.value.mentorId = ''
}

// 资源管理相关
const resourceKeyword = ref('')
const resourcePage = ref(1)
const resourceSize = ref(10)
const resourceTotal = ref(0)
const loadingResources = ref(false)
const myResources = ref<ResourceVO[]>([])

async function loadMyResources() {
  loadingResources.value = true
  try {
    const res = await getMyUploadedResources({
      page: resourcePage.value,
      size: resourceSize.value,
      keyword: resourceKeyword.value || undefined
    }) as ApiResponse<PageResponse<ResourceVO>>
    
    if (res && res.code === 200 && res.data) {
      myResources.value = res.data.records || []
      resourceTotal.value = res.data.total || 0
    } else {
      myResources.value = []
      resourceTotal.value = 0
    }
  } catch (e) {
    console.error('加载资源失败:', e)
    myResources.value = []
    resourceTotal.value = 0
  } finally {
    loadingResources.value = false
  }
}

function getVisibilityText(visibility: string) {
  const map: Record<string, string> = {
    public: '公开',
    organization_only: '仅组织内可见',
    private: '仅自己可见'
  }
  return map[visibility] || visibility
}

async function confirmDelete(resource: ResourceVO) {
  if (!confirm('确定要删除此资源吗？此操作不可恢复。')) return
  
  try {
    const res = await deleteResource(resource.id) as ApiResponse
    if (res && res.code === 200) {
      loadMyResources()
      alert('资源已删除')
    } else {
      alert('删除失败：' + (res?.message || '未知错误'))
    }
  } catch (e: any) {
    alert('删除失败：' + (e.message || '未知错误'))
  }
}

// 编辑资料弹窗相关响应式变量和方法
const showProfileDialog = ref(false)
const editProfile = ref({ nickname: '', email: '', phone: '' })
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const previewAvatar = ref<string | null>(null)
const avatarUploading = ref(false)
const updateProfileLoading = ref(false)
function onEditProfileClick() {
  editProfile.value = {
    nickname: userInfo.value.nickname || teacher.value.name || '',
    email: userInfo.value.email || teacher.value.email || '',
    phone: userInfo.value.phone || teacher.value.phone || ''
  }
  showProfileDialog.value = true
}
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
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
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
      } catch (avatarError) {
        alert('头像上传失败: ' + (avatarError.message || '未知错误'))
      } finally {
        avatarUploading.value = false
      }
    }
    showProfileDialog.value = false
    avatarFile.value = null
    previewAvatar.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    // 重新获取用户信息，刷新头像
    const res = await getMe()
    if (res.data) {
      appStore.setUser(res.data)
      // 同步teacher对象的其他字段（不含avatar）
      teacher.value = {
        name: res.data.nickname || res.data.account || '未知教师',
        email: res.data.email || '',
        phone: res.data.phone || '',
        verified: res.data.verified || false,
        school: res.data.organizationName || '未绑定',
        company: res.data.companyName || ''
      }
    }
    alert('个人资料更新成功')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    updateProfileLoading.value = false
  }
}

// 新增响应式变量和方法
const showChangePwdDialog = ref(false)
const changePwdLoading = ref(false)
const changePwdForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
async function onChangePassword() {
  if (!changePwdForm.value.oldPassword || !changePwdForm.value.newPassword || !changePwdForm.value.confirmPassword) {
    alert('请填写完整')
    return
  }
  if (changePwdForm.value.newPassword !== changePwdForm.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }
  changePwdLoading.value = true
  try {
    // TODO: 调用后端修改密码接口
    // await changePasswordApi(changePwdForm.value)
    alert('密码修改成功（模拟）')
    showChangePwdDialog.value = false
    changePwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e: any) {
    alert('修改失败：' + (e.message || '未知错误'))
  } finally {
    changePwdLoading.value = false
  }
}
</script>
