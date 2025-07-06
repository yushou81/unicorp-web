<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <Navbar />
    
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- 返回按钮 -->
      <router-link to="/resource" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ChevronLeft class="w-5 h-5 mr-1" />
        返回资源列表
      </router-link>
      
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- 资源基本信息 -->
        <div class="p-8">
          <div class="flex flex-wrap items-start justify-between">
            <!-- 左侧信息 -->
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex items-center mb-2">
                <h1 class="text-2xl font-bold text-gray-900">{{ resource.title }}</h1>
                <span v-if="resource.isNew" class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">新资源</span>
                <span v-if="resource.isHot" class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">热门</span>
              </div>
              <p class="text-blue-600 text-lg mb-4">{{ resource.provider }}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="flex flex-col">
                  <span class="text-gray-500 text-sm">资源分类</span>
                  <span class="font-medium">{{ resource.category }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-gray-500 text-sm">资源类型</span>
                  <span class="font-medium">{{ resource.type }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-gray-500 text-sm">位置</span>
                  <span class="font-medium">{{ resource.location }}</span>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2 mb-6">
                <span 
                  v-for="(tag, index) in resource.tags" 
                  :key="index"
                  class="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- 操作按钮区域 -->
              <div class="flex gap-3 mb-6">
                <!-- 资源拥有者操作按钮 -->
                <template v-if="isResourceOwner">
                  <Button variant="outline" @click="showEditModal = true">
                    编辑资源
                  </Button>
                  <Button variant="outline" class="text-red-600 border-red-300 hover:bg-red-50" @click="confirmDelete">
                    删除资源
                  </Button>
                </template>
                
                <!-- 非实验设备的下载按钮 -->
                <Button 
                  v-if="resource.type !== '实验设备'"
                  variant="default"
                  @click="downloadResourceFile"
                  class="flex items-center"
                >
                  <DownloadIcon class="w-4 h-4 mr-1.5" />
                  下载资源
                </Button>
              </div>
            </div>
            
            <!-- 右侧状态信息 -->
            <div class="w-full md:w-auto mt-4 md:mt-0">
              <div class="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <div 
                  class="w-16 h-16 rounded-full mb-2 flex items-center justify-center"
                  :class="{
                    'bg-green-100': resource.status === '可用',
                    'bg-yellow-100': resource.status === '借出',
                    'bg-red-100': resource.status === '维护中',
                    'bg-blue-100': resource.status === '可交易'
                  }"
                >
                  <Check v-if="resource.status === '可用'" class="w-8 h-8 text-green-600" />
                  <Clock v-else-if="resource.status === '借出'" class="w-8 h-8 text-yellow-600" />
                  <Tools v-else-if="resource.status === '维护中'" class="w-8 h-8 text-red-600" />
                  <DollarSign v-else-if="resource.status === '可交易'" class="w-8 h-8 text-blue-600" />
                </div>
                <div 
                  class="text-center font-semibold"
                  :class="{
                    'text-green-700': resource.status === '可用',
                    'text-yellow-700': resource.status === '借出',
                    'text-red-700': resource.status === '维护中',
                    'text-blue-700': resource.status === '可交易'
                  }"
                >
                  {{ resource.status }}
                </div>
                <div class="mt-2 font-medium">{{ resource.usage }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="border-t border-gray-200"></div>
        
        <!-- 资源详情 -->
        <div class="p-8">
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">资源详情</h2>
            
            <!-- 如果是专利或著作权且有图片，则展示图片 -->
            <div v-if="['专利', '专利文献', '著作权'].includes(resource.type) && resource.imageUrl" class="mb-6">
              <img :src="getImageUrl(resource.imageUrl)" alt="专利/著作权图片" class="max-w-full max-h-96 rounded-lg shadow-md mx-auto"/>
            </div>
            
            <p class="text-gray-700 whitespace-pre-line">{{ resource.description }}</p>
          </div>
          
          <div v-if="resource.specifications && resource.specifications.length > 0" class="mb-8">
            <h2 class="text-xl font-semibold mb-4">技术规格</h2>
            <div class="bg-gray-50 rounded-lg p-4">
              <ul class="list-disc list-inside space-y-2">
                <li v-for="(spec, index) in resource.specifications" :key="index" class="text-gray-700">
                  {{ spec }}
                </li>
              </ul>
            </div>
          </div>
          
          <div v-if="resource.usage_policy" class="mb-8">
            <h2 class="text-xl font-semibold mb-4">使用规范</h2>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-700 whitespace-pre-line">{{ resource.usage_policy }}</p>
            </div>
          </div>
          
          <!-- 只有实验设备类型才显示预约时间段 -->
          <div v-if="resource.type === '实验设备'" class="mb-8">
            <h2 class="text-xl font-semibold mb-4">预约时间段</h2>
            <div class="bg-gray-50 rounded-lg p-4">
              <div v-if="bookings.length > 0">
                <div class="mb-4 text-sm text-gray-500">以下时间段已被预约或申请中：</div>
                <ul class="space-y-2">
                  <li v-for="booking in bookings" :key="booking.bookingId" class="flex items-center justify-between border-b pb-2">
                    <div>
                      <span class="font-medium">{{ formatDateTime(booking.startTime) }}</span>
                      <span class="mx-2">至</span>
                      <span class="font-medium">{{ formatDateTime(booking.endTime) }}</span>
                    </div>
                    <div>
                      <span 
                        class="px-2 py-0.5 text-xs rounded-full"
                        :class="{
                          'bg-yellow-100 text-yellow-800': booking.status === 'PENDING',
                          'bg-green-100 text-green-800': booking.status === 'APPROVED',
                          'bg-red-100 text-red-800': booking.status === 'REJECTED',
                          'bg-gray-100 text-gray-800': booking.status === 'CANCELED'
                        }"
                      >
                        {{ getStatusText(booking.status) }}
                        <span v-if="booking.currentUser">(我的申请)</span>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="text-gray-500 text-center py-4">
                暂无预约记录，您可以自由选择时间申请使用
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="border-t border-gray-200"></div>
        
        <!-- 仅实验设备显示预约申请表单 -->
        <div class="p-8" v-if="resource.type === '实验设备'">
          <h2 class="text-xl font-semibold mb-6">申请使用</h2>
          <form @submit.prevent="submitApplication" class="max-w-2xl">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  申请人姓名
                </label>
                <input 
                  type="text" 
                  v-model="application.name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入姓名"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  联系方式
                </label>
                <input 
                  type="text" 
                  v-model="application.contact"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="手机号码或邮箱"
                  required
                />
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                使用目的
              </label>
              <textarea 
                v-model="application.purpose"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请简要说明使用目的"
                required
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  预计开始日期
                </label>
                <input 
                  type="date" 
                  v-model="application.startDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  预计开始时间
                </label>
                <input 
                  type="time" 
                  v-model="application.startTime"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  预计结束日期
                </label>
                <input 
                  type="date" 
                  v-model="application.endDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  预计结束时间
                </label>
                <input 
                  type="time" 
                  v-model="application.endTime"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div class="flex gap-4">
              <Button type="submit">提交申请</Button>
              <Button variant="outline" type="button" @click="collectResource">收藏资源</Button>
            </div>
          </form>
        </div>
        
        <!-- 非实验设备只显示收藏按钮 -->
        <div class="p-8" v-else>
          <div class="flex justify-start">
            <Button variant="outline" @click="collectResource" class="flex items-center">
              <BookmarkIcon class="w-4 h-4 mr-1.5" />
              收藏资源
            </Button>
          </div>
        </div>
        
        <!-- 评价与留言 -->
        <div class="border-t border-gray-200"></div>
        <div class="p-8">
          <h2 class="text-xl font-semibold mb-6">评价与留言</h2>
          
          <!-- 评价列表 -->
          <div class="space-y-4 mb-8">
            <div v-if="comments.length === 0" class="text-gray-500 italic">暂无评价</div>
            <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center mb-2">
                <div class="font-medium">{{ comment.user }}</div>
                <div class="ml-2 text-sm text-gray-500">{{ comment.date }}</div>
              </div>
              <p class="text-gray-700">{{ comment.content }}</p>
            </div>
          </div>
          
          <!-- 添加评价 -->
          <div>
            <h3 class="text-lg font-medium mb-3">添加评价</h3>
            <textarea 
              v-model="newComment"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3"
              placeholder="分享您的使用体验..."
            ></textarea>
            <Button size="sm" @click="addComment">提交评价</Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加编辑资源的对话框 -->
  <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-blue-700">编辑资源</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <form @submit.prevent="updateResourceInfo" class="p-6">
        <!-- 资源标题 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            资源标题 <span class="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            v-model="editForm.title"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="请输入资源标题（2-100字）"
            required
            minlength="2"
            maxlength="100"
          />
        </div>
        
        <!-- 资源类型 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            资源类型 <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="editForm.resourceType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="" disabled>请选择资源类型</option>
            <option v-for="type in resourceTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        
        <!-- 资源描述 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            资源描述
          </label>
          <textarea 
            v-model="editForm.description"
            rows="5"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="请详细描述该资源的内容、用途和特点（500字以内）"
            maxlength="500"
          ></textarea>
        </div>
        
        <!-- 可见性 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            可见范围
          </label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input 
                type="radio" 
                id="edit-visibility-public" 
                value="public" 
                v-model="editForm.visibility"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label for="edit-visibility-public" class="ml-2 text-gray-700">
                公开 - 所有用户可见
              </label>
            </div>
            <div class="flex items-center">
              <input 
                type="radio" 
                id="edit-visibility-organization" 
                value="organization_only" 
                v-model="editForm.visibility"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500" 
              />
              <label for="edit-visibility-organization" class="ml-2 text-gray-700">
                组织内 - 仅本组织内用户可见
              </label>
            </div>
            <div class="flex items-center">
              <input 
                type="radio" 
                id="edit-visibility-private" 
                value="private" 
                v-model="editForm.visibility"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label for="edit-visibility-private" class="ml-2 text-gray-700">
                私有 - 仅自己可见
              </label>
            </div>
          </div>
        </div>
        
        <!-- 当前文件 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            当前文件
          </label>
          <div class="flex items-center border border-gray-300 rounded-md p-3">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-gray-700">{{ resource.fileUrl?.split('/').pop() || '资源文件' }}</span>
            <a 
              :href="resource.fileUrl" 
              target="_blank" 
              class="ml-auto text-blue-600 hover:text-blue-800"
            >
              查看
            </a>
          </div>
        </div>
        
        <!-- 上传新文件（可选） -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            上传新文件（可选）
          </label>
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
            :class="{'border-blue-500 bg-blue-50': isDragging}"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onFileDrop"
            @click="triggerFileInput"
          >
            <input 
              type="file" 
              ref="fileInput" 
              @change="onFileChange" 
              class="hidden" 
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.zip,.rar"
            />
            
            <div v-if="!selectedFile">
              <p class="text-sm text-gray-600">
                拖放文件到此处，或 <span class="text-blue-600 font-medium">点击上传</span>
              </p>
              <p class="text-xs text-gray-500">支持PDF、Word、PPT、Excel、图片、视频等格式</p>
            </div>
            
            <div v-else class="text-left">
              <div class="flex items-center">
                <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-gray-700 font-medium">{{ selectedFile.name }}</span>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <span>{{ formatFileSize(selectedFile.size) }}</span>
                <button 
                  type="button" 
                  @click.stop="clearSelectedFile" 
                  class="ml-2 text-red-600 hover:text-red-800"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 专利/著作权图片上传 -->
        <div class="mb-6" v-if="['专利', '专利文献', '著作权'].includes(editForm.resourceType)">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            专利/著作权图片上传（可选）
          </label>
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
            :class="{'border-blue-500 bg-blue-50': isImageDragging}"
            @dragover.prevent="isImageDragging = true"
            @dragleave.prevent="isImageDragging = false"
            @drop.prevent="onImageDrop"
            @click="triggerImageInput"
          >
            <input 
              type="file" 
              ref="imageInput" 
              @change="onImageChange" 
              class="hidden" 
              accept=".jpg,.jpeg,.png,.gif"
            />
            
            <div v-if="!selectedImage">
              <p class="text-sm text-gray-600">
                拖放图片到此处，或 <span class="text-blue-600 font-medium">点击上传</span>
              </p>
              <p class="text-xs text-gray-500">支持JPG、PNG、GIF等图片格式</p>
            </div>
            
            <div v-else class="text-left">
              <div class="flex items-center">
                <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-700 font-medium">{{ selectedImage.name }}</span>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <span>{{ formatFileSize(selectedImage.size) }}</span>
                <button 
                  type="button" 
                  @click.stop="clearSelectedImage" 
                  class="ml-2 text-red-600 hover:text-red-800"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" @click="showEditModal = false">取消</Button>
          <Button type="submit" :loading="isUpdating">保存修改</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Check, Clock, WrenchIcon as Tools, DollarSign, BookmarkIcon, DownloadIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { 
  getResourceById, 
  collectResource as apiCollectResource, 
  submitResourceApplication, 
  addResourceComment, 
  getResourceComments,
  deleteResource,
  updateResourceWithFile,
  getResourceBookings,
  downloadResource
} from '@/lib/api/resource'
import { useAppStore } from '@/stores/app'
import type { ApiResponse } from '@/lib/api/apiClient'

interface User {
  id: number
  [key: string]: any
}

interface ResourceData {
  id: number | string
  title: string
  description: string
  fileUrl: string
  fileType: string
  authorId: number
  authorName: string
  createdAt: string
  updatedAt: string
  [key: string]: any
}

const route = useRoute()
const router = useRouter()
const resourceId = route.params.id as string
const appStore = useAppStore()

// 资源申请表单
const application = ref({
  name: '',
  contact: '',
  purpose: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
})

// 新评论
const newComment = ref('')

// 资源评价列表
const comments = ref<any[]>([])

// 资源预约时间段
const bookings = ref<any[]>([])

// 资源数据
const resource = ref<ResourceData>({
  id: resourceId,
  title: '',
  description: '',
  fileUrl: '',
  fileType: '',
  authorId: 0,
  authorName: '',
  createdAt: '',
  updatedAt: '',
  provider: '',
  category: '',
  type: '',
  location: '',
  status: '可用',
  usage: '免费使用',
  isNew: false,
  isHot: false,
  tags: [],
  specifications: [],
  usage_policy: ''
})

// 资源类型到分类的映射
const resourceTypeToCategory: Record<string, string> = {
  '实验设备': '科研设备',
  '数据集': '科研数据', 
  '技术手册': '技术文档',
  '课件': '精品课程',
  '视频': '精品课程',
  '专利文献': '专利',
  '专利': '专利',
  '著作权': '著作权',
  '论文': '技术文档',
  '软件': '其他'
}

// 编辑资源相关
const showEditModal = ref(false)
const selectedFile = ref<File | null>(null)
const selectedImage = ref<File | null>(null)
const isDragging = ref(false)
const isImageDragging = ref(false)
const isUpdating = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)

// 资源类型列表
const resourceTypes = [
  '实验设备',
  '数据集',
  '技术手册',
  '课件',
  '视频',
  '论文',
  '专利文献',
  '软件'
]

// 编辑表单
const editForm = ref({
  title: '',
  description: '',
  resourceType: '',
  visibility: 'public' as 'public' | 'private' | 'organization_only',
  fileUrl: ''
})

// 判断是否为资源拥有者
const isResourceOwner = computed(() => {
  const userId = (appStore.user as User | null)?.id
  return userId && resource.value?.authorId === userId
})

// 加载资源详情
const loadResourceDetails = async () => {
  try {
    const response = await getResourceById(resourceId) as ApiResponse<ResourceData>
    
    if (response && response.code === 200 && response.data) {
      const data = response.data
      // 处理文件URL和图片URL
      const fileUrl = data.fileUrl || '';
      const imageUrl = data.imageUrl || data.fileUrl || '';
      
      resource.value = {
        ...data,
        // 补充额外显示字段
        provider: data.nickname || data.authorName || '未知提供者',
        category: resourceTypeToCategory[data.resourceType as string] || '其他',
        type: data.resourceType || data.fileType,
        isNew: new Date(data.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
        isHot: Math.random() > 0.7, // 临时随机标记热门
        status: '可用',
        usage: '免费使用',
        location: '在线资源',
        fileUrl: fileUrl,
        imageUrl: imageUrl,
        tags: [data.fileType || '专利图片', '教学资源', '科研资源'],
        specifications: [
          '格式: ' + (data.fileType || fileUrl?.split('.').pop() || 'PDF'),
          '上传时间: ' + new Date(data.createdAt).toLocaleDateString(),
          '提供者: ' + (data.nickname || data.authorName || data.organizationName || '未知')
        ],
        usage_policy: `1. 资源使用遵循校内资源共享管理规定。
2. 使用本资源产生的研究成果，请在致谢中注明。
3. 未经授权，不得将资源用于商业用途。
4. 如需长期使用，请与提供者联系。`
      }

      // 初始化编辑表单数据
      editForm.value = {
        title: data.title || '',
        description: data.description || '',
        resourceType: data.resourceType || '',
        visibility: 'public',
        fileUrl: data.fileUrl || ''
      }
      
      // 如果是实验设备，加载预约时间段
      if (data.resourceType === '实验设备') {
        loadBookings()
      }
    }
  } catch (error) {
    console.error('获取资源详情失败:', error)
  }
}

// 加载资源评论
const loadComments = async () => {
  try {
    const response = await getResourceComments(resourceId) as ApiResponse<any[]>
    if (response && response.code === 200 && response.data) {
      comments.value = response.data.map((comment: any) => ({
        id: comment.id,
        user: comment.nickname || '匿名用户',
        date: new Date(comment.createdAt).toLocaleDateString(),
        content: comment.content
      }))
    }
  } catch (error) {
    console.error('获取评论失败:', error)
    // 使用临时评论数据
    comments.value = [
      { 
        id: 1, 
        user: '张三', 
        date: '2024-01-15', 
        content: '设备性能优良，实验过程非常顺利，文档齐全，使用方便。' 
      },
      { 
        id: 2, 
        user: '李四', 
        date: '2024-01-10', 
        content: '资源非常有用，但是建议增加更多的使用案例和示例数据。' 
      }
    ]
  }
}

// 加载资源预约时间段
const loadBookings = async () => {
  if (resource.value.type !== '实验设备') return;
  
  try {
    const response = await getResourceBookings(resourceId) as ApiResponse<any[]>
    if (response && response.code === 200 && response.data) {
      bookings.value = response.data
    }
  } catch (error) {
    console.error('获取预约时间段失败:', error)
    bookings.value = []
  }
}

// 格式化日期时间
const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取预约状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': '待审核',
    'APPROVED': '已通过',
    'REJECTED': '已拒绝',
    'CANCELED': '已取消'
  }
  return statusMap[status] || status
}

// 提交申请
const submitApplication = async () => {
  try {
    // 格式化日期和时间为ISO格式
    const startDateTime = `${application.value.startDate}T${application.value.startTime}:00`;
    const endDateTime = `${application.value.endDate}T${application.value.endTime}:00`;
    
    const bookingData = {
      name: application.value.name,
      contact: application.value.contact,
      purpose: application.value.purpose,
      startTime: startDateTime,
      endTime: endDateTime
    };
    
    console.log('提交申请:', bookingData);
    await submitResourceApplication(resourceId, bookingData);
    alert('申请已提交，等待审核');
    
    // 清空表单
    application.value = {
      name: '',
      contact: '',
      purpose: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    }
  } catch (error) {
    console.error('提交申请失败:', error)
    alert('提交申请失败，请稍后重试')
  }
}

// 收藏资源
const collectResource = async () => {
  try {
    console.log('收藏资源:', resourceId)
    await apiCollectResource(resourceId)
    alert('资源已收藏')
  } catch (error) {
    console.error('收藏资源失败:', error)
    alert('收藏失败，请稍后重试')
  }
}

// 下载资源
const downloadResourceFile = () => {
  try {
    console.log('下载资源:', resourceId)
    downloadResource(resourceId)
  } catch (error) {
    console.error('下载资源失败:', error)
    alert('下载失败，请稍后重试')
  }
}

// 添加评论
const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      console.log('添加评论:', newComment.value)
      await addResourceComment(resourceId, newComment.value)
      alert('评价已提交')
      newComment.value = ''
      // 重新加载评论列表
      loadComments()
    } catch (error) {
      console.error('添加评论失败:', error)
      alert('评论提交失败，请稍后重试')
    }
  }
}

// 确认删除资源
const confirmDelete = async () => {
  if (confirm('确定要删除此资源吗？此操作不可撤销。')) {
    try {
      await deleteResource(resourceId)
      alert('资源已删除')
      router.push('/resource')
    } catch (error) {
      console.error('删除资源失败:', error)
      alert('删除失败，请稍后重试')
    }
  }
}

// 处理文件拖放
const onFileDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files.length) {
    handleFileSelection(event.dataTransfer.files[0])
  }
}

// 处理文件选择
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    handleFileSelection(target.files[0])
  }
}

// 处理文件选择逻辑
const handleFileSelection = (file: File) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  
  if (file.size > maxSize) {
    alert('文件大小不能超过100MB')
    return
  }
  
  selectedFile.value = file
}

// 清除选择的文件
const clearSelectedFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 触发文件选择器
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理图片拖放
const onImageDrop = (event: DragEvent) => {
  isImageDragging.value = false
  if (event.dataTransfer?.files.length) {
    handleImageSelection(event.dataTransfer.files[0])
  }
}

// 处理图片选择
const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    handleImageSelection(target.files[0])
  }
}

// 处理图片选择逻辑
const handleImageSelection = (file: File) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (file.size > maxSize) {
    alert('图片大小不能超过10MB')
    return
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    alert('请上传有效的图片文件(JPG, PNG, GIF)')
    return
  }
  
  selectedImage.value = file
}

// 清除选择的图片
const clearSelectedImage = () => {
  selectedImage.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// 触发图片选择器
const triggerImageInput = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理图片URL
const getImageUrl = (url: string) => {
  if (!url) return ''
  // 如果URL已经是完整的HTTP URL，则直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 否则，添加API基础URL
  return `http://127.0.0.1:8081/api/v1/files/${url}`
}

// 更新资源信息
const updateResourceInfo = async () => {
  try {
    isUpdating.value = true
    
    // 准备更新数据
    const updateData: {
      title?: string;
      description?: string;
      resourceType?: string;
      visibility?: 'public' | 'private' | 'organization_only';
      file?: File;
      image?: File;
    } = {
      title: editForm.value.title,
      description: editForm.value.description,
      resourceType: editForm.value.resourceType,
      visibility: editForm.value.visibility
    }
    
    // 如果有选择新文件，则添加到更新数据中
    if (selectedFile.value) {
      updateData.file = selectedFile.value
    }
    
    // 如果是专利/著作权类型且有选择图片，则添加图片
    if (['专利', '专利文献', '著作权'].includes(editForm.value.resourceType) && selectedImage.value) {
      updateData.image = selectedImage.value
    }
    
    // 使用新的一步式更新接口
    const response = await updateResourceWithFile(resourceId, updateData) as ApiResponse
    
    if (!response || response.code !== 200) {
      throw new Error('资源更新失败')
    }
    
    // 更新成功，关闭模态框并重新加载资源详情
    showEditModal.value = false
    alert('资源更新成功')
    loadResourceDetails()
  } catch (error) {
    console.error('更新资源失败:', error)
    alert('更新失败，请稍后重试')
  } finally {
    isUpdating.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadResourceDetails()
  loadComments()
  loadBookings()
})
</script> 