<template>
  <Navbar />
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">社区交流</h1>
            <p class="text-gray-600 mt-2">分享经验，交流心得，共同成长</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="搜索话题、问题..."
                class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <router-link
              v-if="isLoggedIn"
              to="/my-topics"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>我的话题</span>
            </router-link>
            <button
              v-if="isLoggedIn"
              @click="showCreateModal = true"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>发布话题</span>
            </button>
            <button
              v-if="isAdmin"
              @click="showCategoryManageModal = true"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>管理版块</span>
            </button>
            <button
              v-if="isAdmin"
              @click="showTopicAdminModal = true"
              class="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" />
              </svg>
              <span>话题管理</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧边栏 -->
        <div class="lg:col-span-1">
          <!-- 板块导航 -->
          <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">板块分类</h3>
            <div class="space-y-2">
              <button
                @click="selectCategory(null)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition',
                  selectedCategory === null
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                全部板块
              </button>
              <div
                v-for="category in categories"
                :key="category.id"
                class="space-y-1"
              >
                <button
                  @click="selectCategory(category.id)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between',
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <span class="flex items-center space-x-2">
                    <span v-if="category.name.includes('技术')">
                      <!-- 技术交流: 代码块图标 -->
                      <svg class="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2" />
                        <path d="M9 9h6v6H9z" stroke-width="2" />
                      </svg>
                    </span>
                    <span v-else-if="category.name.includes('就业')">
                      <!-- 就业指导: 书本图标 -->
                      <svg class="w-5 h-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke-width="2" />
                        <path d="M4 4.5A2.5 2.5 0 016.5 7H20v13H6.5A2.5 2.5 0 014 17.5V4.5z" stroke-width="2" />
                      </svg>
                    </span>
                    <span v-else-if="category.name.includes('学术')">
                      <!-- 学术研究: 地球图标 -->
                      <svg class="w-5 h-5 text-purple-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke-width="2" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke-width="2" />
                      </svg>
                    </span>
                    <span v-else-if="category.name.includes('校园')">
                      <!-- 校园生活: 用户图标 -->
                      <svg class="w-5 h-5 text-pink-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" stroke-width="2" />
                        <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke-width="2" />
                      </svg>
                    </span>
                    <span v-else-if="category.name.includes('企业')">
                      <!-- 企业专区: briefcase图标 -->
                      <svg class="w-5 h-5 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="7" width="20" height="14" rx="2" stroke-width="2" />
                        <path d="M16 3v4M8 3v4M2 11h20" stroke-width="2" />
                      </svg>
                    </span>
                    <span v-else>
                      <!-- 默认: 聊天气泡图标 -->
                      <svg class="w-5 h-5 text-blue-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke-width="2" />
                      </svg>
                    </span>
                    <span>{{ category.name }}</span>
                  </span>
                  <span class="text-sm text-gray-500">{{ category.topicCount }}</span>
                </button>
                <!-- 子板块 -->
                <div v-if="category.children && category.children.length > 0" class="ml-4 space-y-1">
                  <button
                    v-for="child in category.children"
                    :key="child.id"
                    @click="selectCategory(child.id)"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between text-sm',
                      selectedCategory === child.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    ]"
                  >
                    <span>{{ child.name }}</span>
                    <span class="text-xs text-gray-400">{{ child.topicCount }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门标签 -->
          <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in hotTags"
                :key="tag.id"
                @click="selectTag(tag.name)"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">社区统计</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">今日话题</span>
                <span class="font-semibold text-blue-600">{{ stats.todayTopics }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">今日回复</span>
                <span class="font-semibold text-green-600">{{ stats.todayReplies }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">活跃用户</span>
                <span class="font-semibold text-purple-600">{{ stats.activeUsers }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 主内容区 -->
        <div class="lg:col-span-3">
          <!-- 筛选标签 -->
          <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  @click="currentTab = tab.key"
                  :class="[
                    'px-4 py-2 rounded-lg transition',
                    currentTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ tab.label }}
                </button>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">共 {{ total }} 条</span>
              </div>
            </div>
          </div>

          <!-- 话题列表 -->
          <div class="space-y-4">
            <TopicCard
              v-for="topic in topics"
              :key="topic.id"
              :topic="topic"
            />
          </div>

          <!-- 分页 -->
          <div v-if="total > 0" class="mt-6 flex justify-center">
            <div class="flex items-center space-x-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage <= 1"
                :class="[
                  'px-3 py-2 rounded-lg transition',
                  currentPage <= 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                ]"
              >
                上一页
              </button>
              <span class="px-3 py-2 text-gray-700">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                :class="[
                  'px-3 py-2 rounded-lg transition',
                  currentPage >= totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                ]"
              >
                下一页
              </button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="topics.length === 0 && !loading" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无话题</h3>
            <p class="text-gray-500">还没有人发布话题，快来发布第一个话题吧！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建话题模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">发布话题</h3>
          <button
            @click="showCreateModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="createTopic">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  v-model="newTopic.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入话题标题"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">板块</label>
                <select
                  v-model="newTopic.categoryId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择板块</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <textarea
                  v-model="newTopic.content"
                  required
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入话题内容"
                ></textarea>
              </div>
            </div>
            
            <div class="flex items-center justify-end space-x-4 mt-6">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {{ creating ? '发布中...' : '发布话题' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 管理版块模态框 -->
    <div v-if="showCategoryManageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">管理版块</h3>
          <button
            @click="showCategoryManageModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <!-- 创建新版块 -->
          <div class="mb-6">
            <h4 class="text-md font-semibold text-gray-900 mb-4">创建新版块</h4>
            <form @submit.prevent="createCategory" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">版块名称 *</label>
                  <input
                    v-model="newCategory.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入版块名称"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">父版块</label>
                  <select
                    v-model="newCategory.parentId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">无（顶级版块）</option>
                    <option
                      v-for="category in getAllCategoriesWithLevel()"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">版块描述</label>
                <textarea
                  v-model="newCategory.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入版块描述"
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">排序顺序</label>
                  <input
                    v-model="newCategory.sortOrder"
                    type="number"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="数字越小越靠前"
                  />
                </div>
              </div>
              <div class="flex items-center justify-end space-x-4">
                <button
                  type="submit"
                  :disabled="creatingCategory"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {{ creatingCategory ? '创建中...' : '创建版块' }}
                </button>
              </div>
            </form>
          </div>

          <!-- 版块列表 -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4">现有版块</h4>
            <div class="space-y-3">
              <div
                v-for="category in categories"
                :key="category.id"
                class="border border-gray-200 rounded-lg"
              >
                <!-- 主版块 -->
                <div class="flex items-center justify-between p-4">
                  <div class="flex items-center space-x-3">
                    <span v-if="category.icon" :class="['iconfont', category.icon, 'text-lg']"></span>
                    <div>
                      <h5 class="font-medium text-gray-900">{{ category.name }}</h5>
                      <p v-if="category.description" class="text-sm text-gray-500">{{ category.description }}</p>
                      <p class="text-xs text-gray-400">
                        话题数: {{ category.topicCount || 0 }} | 排序: {{ category.sortOrder }}
                        <span v-if="category.permissionLevel !== undefined" class="ml-2">
                          | 权限: {{ category.permissionLevel === 0 ? '公开' : '企业' }}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editCategory(category)"
                      class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                    >
                      编辑
                    </button>
                    <button
                      @click="deleteCategory(category.id)"
                      :disabled="(category.topicCount || 0) > 0"
                      class="px-3 py-1 text-sm border border-red-300 rounded text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      删除
                    </button>
                  </div>
                </div>
                
                <!-- 子版块 -->
                <div v-if="category.children && category.children.length > 0" class="border-t border-gray-100">
                  <div
                    v-for="child in category.children"
                    :key="child.id"
                    class="flex items-center justify-between p-4 pl-8 bg-gray-50"
                  >
                    <div class="flex items-center space-x-3">
                      <span v-if="child.icon" :class="['iconfont', child.icon, 'text-lg']"></span>
                      <div>
                        <h6 class="font-medium text-gray-800">{{ child.name }}</h6>
                        <p v-if="child.description" class="text-sm text-gray-500">{{ child.description }}</p>
                        <p class="text-xs text-gray-400">
                          话题数: {{ child.topicCount || 0 }} | 排序: {{ child.sortOrder }}
                          <span v-if="child.permissionLevel !== undefined" class="ml-2">
                            | 权限: {{ child.permissionLevel === 0 ? '公开' : '企业' }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="editCategory(child)"
                        class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                      >
                        编辑
                      </button>
                      <button
                        @click="deleteCategory(child.id)"
                        :disabled="(child.topicCount || 0) > 0"
                        class="px-3 py-1 text-sm border border-red-300 rounded text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑版块模态框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">编辑版块</h3>
          <button
            @click="showEditModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="updateCategory">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">版块名称 *</label>
                <input
                  v-model="editCategoryForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入版块名称"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">版块描述</label>
                <textarea
                  v-model="editCategoryForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入版块描述"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">排序顺序</label>
                  <input
                    v-model="editCategoryForm.sortOrder"
                    type="number"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="数字越小越靠前"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">父版块</label>
                <select
                  v-model="editCategoryForm.parentId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">无（顶级版块）</option>
                  <option
                    v-for="category in getAvailableParentCategories()"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="flex items-center justify-end space-x-4 mt-6">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="editingCategory"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {{ editingCategory ? '更新中...' : '更新版块' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <TopicAdminModal v-if="showTopicAdminModal" @close="showTopicAdminModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { topicApi, categoryApi, tagApi, type TopicVO, type CategoryVO, type TagVO } from '@/lib/api/community'
import TopicCard from '@/components/community/TopicCard.vue'
import Navbar from '@/components/layout/Navbar.vue'
import TopicAdminModal from '@/components/community/TopicAdminModal.vue'

const router = useRouter()
const appStore = useAppStore()

// 响应式数据
const topics = ref<TopicVO[]>([])
const categories = ref<CategoryVO[]>([])
const hotTags = ref<TagVO[]>([])
const loading = ref(false)
const creating = ref(false)
const creatingCategory = ref(false)
const editingCategory = ref(false)
const showCreateModal = ref(false)
const showCategoryManageModal = ref(false)
const showEditModal = ref(false)
const showTopicAdminModal = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedCategory = ref<number | null>(null)
const searchKeyword = ref('')
const currentTab = ref('latest')

// 新话题表单
const newTopic = ref({
  title: '',
  content: '',
  categoryId: ''
})

// 新版块表单
const newCategory = ref({
  name: '',
  description: '',
  icon: '',
  parentId: '',
  sortOrder: 0
})

// 编辑版块表单
const editCategoryForm = ref({
  id: 0,
  name: '',
  description: '',
  icon: '',
  parentId: '',
  sortOrder: 0
})

// 统计信息
const stats = ref({
  todayTopics: 0,
  todayReplies: 0,
  activeUsers: 0
})

// 标签页配置
const tabs = computed(() => {
  const baseTabs = [
    { key: 'latest', label: '最新' },
    { key: 'hot', label: '热门' },
    { key: 'essence', label: '精华' }
  ]
  
  // 只有登录用户才能看到"我的话题"标签页
  if (isLoggedIn.value) {
    baseTabs.push({ key: 'my', label: '我的话题' })
  }
  
  return baseTabs
})

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const isLoggedIn = computed(() => !!appStore.user)
const userInfo = computed(() => appStore.user as any || {})
const isAdmin = computed(() => {
  if (!isLoggedIn.value) return false
  const user = appStore.user as any
  const role = (user.role || '').toUpperCase()
  return ['SYSADMIN', 'ADMIN'].includes(role)
})

// 获取话题列表
const fetchTopics = async () => {
  loading.value = true
  try {
    let response
    const params = { page: currentPage.value, size: pageSize.value }
    
    console.log('获取话题列表，参数:', { 
      searchKeyword: searchKeyword.value, 
      selectedCategory: selectedCategory.value, 
      currentTab: currentTab.value,
      params 
    })
    
    if (searchKeyword.value && searchKeyword.value.trim()) {
      console.log('执行搜索，关键词:', searchKeyword.value.trim())
      response = await topicApi.search(searchKeyword.value.trim(), currentPage.value, pageSize.value)
    } else if (selectedCategory.value) {
      response = await topicApi.getCategoryTopics(selectedCategory.value, params)
    } else {
      switch (currentTab.value) {
        case 'hot':
          response = await topicApi.getHot(params)
          break
        case 'essence':
          response = await topicApi.getEssence(params)
          break
        case 'my':
          // 获取当前用户的话题列表
          if (isLoggedIn.value && userInfo.value?.id) {
            response = await topicApi.getUserTopics(userInfo.value.id, params)
          } else {
            // 如果未登录，回退到最新话题
            response = await topicApi.getLatest(params)
          }
          break
        default:
          response = await topicApi.getLatest(params)
          break
      }
    }
    
    console.log('话题列表响应:', response)
    
    if (response.success) {
      topics.value = response.data.records
      total.value = response.data.total
      console.log('话题列表数据:', topics.value)
    } else {
      console.error('获取话题列表失败:', response.message)
      // 如果API调用失败，使用空数组
      topics.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取话题列表失败:', error)
    // 如果API调用失败，使用空数组
    topics.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取板块列表
const fetchCategories = async () => {
  try {
    console.log('正在获取板块树形结构...')
    const response = await categoryApi.getTree()
    console.log('板块树形结构响应:', response)
    if (response.success) {
      categories.value = response.data
      console.log('板块树形结构数据:', categories.value)
    } else {
      console.error('获取板块树形结构失败:', response.message)
    }
  } catch (error) {
    console.error('获取板块树形结构失败:', error)
    // 如果API调用失败，使用一些默认的版块数据
    categories.value = [
      {
        id: 1,
        name: '技术交流',
        description: '技术相关话题讨论',
        icon: '💻',
        parentId: undefined,
        sortOrder: 1,
        topicCount: 0,
        children: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '学习分享',
        description: '学习经验和资源分享',
        icon: '📚',
        parentId: undefined,
        sortOrder: 2,
        topicCount: 0,
        children: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: '项目合作',
        description: '项目合作相关信息',
        icon: '🤝',
        parentId: undefined,
        sortOrder: 3,
        topicCount: 0,
        children: [],
        createdAt: new Date().toISOString()
      }
    ]
  }
}

// 获取热门标签
const fetchHotTags = async () => {
  try {
    const response = await tagApi.getHot(10)
    if (response.success) {
      hotTags.value = response.data
    }
  } catch (error) {
    console.error('获取热门标签失败:', error)
  }
}

// 选择板块
const selectCategory = (categoryId: number | null) => {
  console.log('选择版块:', categoryId)
  selectedCategory.value = categoryId
  currentPage.value = 1
  fetchTopics()
}

// 选择标签
const selectTag = (tagName: string) => {
  searchKeyword.value = tagName
  handleSearch()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchTopics()
}

// 切换标签页
const changeTab = (tab: string) => {
  currentTab.value = tab
  currentPage.value = 1
  fetchTopics()
}

// 切换页码
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchTopics()
  }
}

// 创建话题
const createTopic = async () => {
  if (!newTopic.value.title || !newTopic.value.content || !newTopic.value.categoryId) {
    return
  }
  
  creating.value = true
  try {
    const response = await topicApi.create({
      title: newTopic.value.title,
      content: newTopic.value.content,
      categoryId: Number(newTopic.value.categoryId)
    })
    
    if (response.success) {
      showCreateModal.value = false
      // 重置表单
      newTopic.value = {
        title: '',
        content: '',
        categoryId: ''
      }
      // 刷新列表
      fetchTopics()
    }
  } catch (error) {
    console.error('创建话题失败:', error)
  } finally {
    creating.value = false
  }
}

// 创建版块
const createCategory = async () => {
  if (!newCategory.value.name) {
    return
  }
  
  creatingCategory.value = true
  try {
    const response = await categoryApi.create({
      name: newCategory.value.name,
      description: newCategory.value.description,
      icon: newCategory.value.icon,
      parentId: newCategory.value.parentId ? Number(newCategory.value.parentId) : undefined,
      sortOrder: newCategory.value.sortOrder || 0
    })
    
    if (response.success) {
      // 重置表单
      newCategory.value = {
        name: '',
        description: '',
        icon: '',
        parentId: '',
        sortOrder: 0
      }
      // 刷新版块树形结构
      await fetchCategories()
    }
  } catch (error) {
    console.error('创建版块失败:', error)
  } finally {
    creatingCategory.value = false
  }
}

// 编辑版块
const editCategory = (category: CategoryVO) => {
  console.log('编辑版块:', category)
  // 填充编辑表单
  editCategoryForm.value = {
    id: category.id,
    name: category.name,
    description: category.description || '',
    icon: category.icon || '',
    parentId: category.parentId ? String(category.parentId) : '',
    sortOrder: category.sortOrder || 0
  }
  showEditModal.value = true
}

// 获取所有版块并添加层级缩进
const getAllCategoriesWithLevel = () => {
  const allCategories: CategoryVO[] = []
  
  const addCategoryWithLevel = (category: CategoryVO, level = 0) => {
    // 添加缩进前缀
    const prefix = '　'.repeat(level)
    const categoryWithPrefix = {
      ...category,
      name: prefix + category.name
    }
    
    allCategories.push(categoryWithPrefix)
    
    // 递归添加子版块
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        addCategoryWithLevel(child, level + 1)
      })
    }
  }
  
  categories.value.forEach(category => {
    addCategoryWithLevel(category)
  })
  
  return allCategories
}

// 获取可用的父版块列表（排除当前版块及其子版块）
const getAvailableParentCategories = () => {
  const currentId = editCategoryForm.value.id
  const availableCategories: CategoryVO[] = []
  
  const addCategoryIfAvailable = (category: CategoryVO, level = 0) => {
    // 排除当前编辑的版块
    if (category.id === currentId) {
      return
    }
    
    // 添加缩进前缀
    const prefix = '　'.repeat(level)
    const categoryWithPrefix = {
      ...category,
      name: prefix + category.name
    }
    
    availableCategories.push(categoryWithPrefix)
    
    // 递归添加子版块
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        addCategoryIfAvailable(child, level + 1)
      })
    }
  }
  
  categories.value.forEach(category => {
    addCategoryIfAvailable(category)
  })
  
  return availableCategories
}

// 更新版块
const updateCategory = async () => {
  if (!editCategoryForm.value.name) {
    return
  }
  
  editingCategory.value = true
  try {
    const response = await categoryApi.update(editCategoryForm.value.id, {
      name: editCategoryForm.value.name,
      description: editCategoryForm.value.description,
      icon: editCategoryForm.value.icon,
      parentId: editCategoryForm.value.parentId ? Number(editCategoryForm.value.parentId) : undefined,
      sortOrder: editCategoryForm.value.sortOrder || 0
    })
    
    if (response.success) {
      showEditModal.value = false
      // 重置表单
      editCategoryForm.value = {
        id: 0,
        name: '',
        description: '',
        icon: '',
        parentId: '',
        sortOrder: 0
      }
      // 刷新版块树形结构
      await fetchCategories()
    }
  } catch (error) {
    console.error('更新版块失败:', error)
  } finally {
    editingCategory.value = false
  }
}

// 删除版块
const deleteCategory = async (categoryId: number) => {
  if (!confirm('确定要删除这个版块吗？')) {
    return
  }
  
  try {
    const response = await categoryApi.delete(categoryId)
    if (response.success) {
      // 刷新版块树形结构
      await fetchCategories()
    }
  } catch (error) {
    console.error('删除版块失败:', error)
  }
}



// 监听标签页变化
const handleTabChange = () => {
  currentPage.value = 1
  fetchTopics()
}

// 监听currentTab变化
watch(currentTab, handleTabChange)

// 页面加载时获取数据
onMounted(() => {
  fetchTopics()
  fetchCategories() // 获取板块树形结构
  fetchHotTags()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 