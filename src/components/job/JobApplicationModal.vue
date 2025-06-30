<template>
  <div>
    <!-- 模态框遮罩层 -->
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center overflow-y-auto py-10">
      <!-- 模态框内容 -->
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-full overflow-y-auto">
        <!-- 模态框标题 -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-xl font-bold text-gray-800">申请岗位：{{ job.title }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <!-- 模态框内容区 -->
        <div class="px-6 py-4">
          <div class="mb-6">
            <div class="flex items-center mb-4">
              <div class="flex-1">
                <div class="text-sm text-gray-500 mb-2">请选择申请方式：</div>
                <div class="flex items-center space-x-6">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="applicationType" value="online" class="form-radio h-4 w-4 text-blue-600" />
                    <span class="ml-2">填写在线简历</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="applicationType" value="upload" class="form-radio h-4 w-4 text-blue-600" />
                    <span class="ml-2">上传简历文件</span>
                  </label>
                </div>
              </div>
              
              <div v-if="hasResume" class="text-sm text-gray-600 flex items-center">
                <div class="bg-blue-50 border border-blue-200 rounded px-3 py-2 flex items-center">
                  <DocumentIcon class="w-4 h-4 text-blue-500 mr-2" />
                  <span>已有在线简历</span>
                </div>
              </div>
            </div>
            
            <div class="text-sm text-gray-500 mt-2">
              <InfoIcon class="w-4 h-4 inline-block mr-1" />
              <span>上传简历有助于提高求职效率和成功率</span>
            </div>
          </div>
          
          <!-- 上传简历选项 -->
          <div v-if="applicationType === 'upload'" class="border-t border-gray-200 pt-6">
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2">上传简历</label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                @click="triggerFileInput"
              >
                <input 
                  ref="fileInput" 
                  type="file" 
                  class="hidden" 
                  @change="handleFileChange" 
                  accept=".pdf,.doc,.docx"
                />
                <div v-if="!resumeFile">
                  <UploadIcon class="w-12 h-12 mx-auto text-gray-400" />
                  <p class="mt-2 text-sm text-gray-600">点击或拖拽文件至此处上传</p>
                  <p class="text-xs text-gray-500 mt-1">支持格式：PDF、Word（.doc/.docx）</p>
                </div>
                <div v-else class="text-left">
                  <div class="flex items-center">
                    <DocumentIcon class="w-10 h-10 text-blue-500 mr-3" />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-800">{{ resumeFile.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(resumeFile.size) }}</p>
                    </div>
                    <button 
                      @click.stop="removeFile" 
                      class="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2">求职意向 <span class="text-red-500">*</span></label>
              <input 
                type="text" 
                v-model="jobIntention" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的求职意向"
              />
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2">自我介绍</label>
              <textarea 
                v-model="selfIntroduction" 
                rows="5" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="简要介绍自己的技能、经验和求职意愿（选填）"
              ></textarea>
            </div>
          </div>
          
          <!-- 在线简历表单 -->
          <div v-if="applicationType === 'online'" class="border-t border-gray-200 pt-6">
            <!-- 基本信息 -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <UserIcon class="w-5 h-5 mr-2 text-blue-500" />
                基本信息
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-1">姓名 <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    v-model="resume.name" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-1">性别</label>
                  <select 
                    v-model="resume.gender" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-1">电话 <span class="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    v-model="resume.phone" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入联系电话"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-1">邮箱 <span class="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    v-model="resume.email" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入邮箱地址"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-1">最高学历 <span class="text-red-500">*</span></label>
                  <select 
                    v-model="resume.education" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="高中">高中</option>
                    <option value="专科">专科</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-1">工作经验</label>
                  <select 
                    v-model="resume.experience" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="应届毕业生">应届毕业生</option>
                    <option value="1年以内">1年以内</option>
                    <option value="1-3年">1-3年</option>
                    <option value="3-5年">3-5年</option>
                    <option value="5年以上">5年以上</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- 教育经历 -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <GraduationCapIcon class="w-5 h-5 mr-2 text-blue-500" />
                教育经历
              </h3>
              
              <div v-for="(edu, index) in resume.educations" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">学校 <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="edu.school" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入学校名称"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">专业 <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="edu.major" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入专业名称"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">学历</label>
                    <select 
                      v-model="edu.degree" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="专科">专科</option>
                      <option value="本科">本科</option>
                      <option value="硕士">硕士</option>
                      <option value="博士">博士</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">就读时间</label>
                    <div class="flex items-center space-x-2">
                      <input 
                        type="month" 
                        v-model="edu.startDate" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span>至</span>
                      <input 
                        type="month" 
                        v-model="edu.endDate" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex justify-end mt-2">
                  <button 
                    @click="removeEducation(index)" 
                    class="text-sm text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              <button 
                @click="addEducation" 
                class="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                添加教育经历
              </button>
            </div>
            
            <!-- 工作经历 -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BriefcaseIcon class="w-5 h-5 mr-2 text-blue-500" />
                工作经历
              </h3>
              
              <div v-for="(work, index) in resume.workExperiences" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">公司名称</label>
                    <input 
                      type="text" 
                      v-model="work.company" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入公司名称"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">职位名称</label>
                    <input 
                      type="text" 
                      v-model="work.position" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入职位名称"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">工作时间</label>
                    <div class="flex items-center space-x-2">
                      <input 
                        type="month" 
                        v-model="work.startDate" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span>至</span>
                      <input 
                        type="month" 
                        v-model="work.endDate" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <label class="block text-gray-700 text-sm font-medium mb-1">工作描述</label>
                  <textarea 
                    v-model="work.description" 
                    rows="3" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请描述您的工作内容和成就"
                  ></textarea>
                </div>
                <div class="flex justify-end mt-2">
                  <button 
                    @click="removeWorkExperience(index)" 
                    class="text-sm text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              <button 
                @click="addWorkExperience" 
                class="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                添加工作经历
              </button>
            </div>
            
            <!-- 项目经历 -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CodeIcon class="w-5 h-5 mr-2 text-blue-500" />
                项目经历
              </h3>
              
              <div v-for="(project, index) in resume.projects" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">项目名称</label>
                    <input 
                      type="text" 
                      v-model="project.name" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入项目名称"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">项目角色</label>
                    <input 
                      type="text" 
                      v-model="project.role" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入您在项目中的角色"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">项目时间</label>
                    <div class="flex items-center space-x-2">
                      <input 
                        type="month" 
                        v-model="project.startDate" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span>至</span>
                      <input 
                        type="month" 
                        v-model="project.endDate" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <label class="block text-gray-700 text-sm font-medium mb-1">项目描述</label>
                  <textarea 
                    v-model="project.description" 
                    rows="3" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请描述项目的主要内容、您的职责以及取得的成果"
                  ></textarea>
                </div>
                <div class="flex justify-end mt-2">
                  <button 
                    @click="removeProject(index)" 
                    class="text-sm text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              <button 
                @click="addProject" 
                class="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                添加项目经历
              </button>
            </div>
            
            <!-- 专业技能 -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <WrenchIcon class="w-5 h-5 mr-2 text-blue-500" />
                专业技能
              </h3>
              
              <div v-for="(skill, index) in resume.skills" :key="index" class="mb-3 flex items-center">
                <input 
                  type="text" 
                  v-model="skill.name" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入技能名称"
                />
                <select 
                  v-model="skill.level" 
                  class="ml-2 w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="入门">入门</option>
                  <option value="熟悉">熟悉</option>
                  <option value="精通">精通</option>
                </select>
                <button 
                  @click="removeSkill(index)" 
                  class="ml-2 text-red-500 hover:text-red-700"
                >
                  <XIcon class="w-5 h-5" />
                </button>
              </div>
              
              <button 
                @click="addSkill" 
                class="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                添加技能
              </button>
            </div>
            
            <!-- 自我评价 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <UserCircleIcon class="w-5 h-5 mr-2 text-blue-500" />
                自我评价
              </h3>
              
              <textarea 
                v-model="resume.selfDescription" 
                rows="5" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="简要描述自己的优势、特长和职业发展目标"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- 模态框底部按钮 -->
        <div class="border-t px-6 py-4 flex justify-end space-x-4">
          <button 
            @click="closeModal" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button 
            @click="submitApplication" 
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            :disabled="submitting"
          >
            <span v-if="submitting">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              提交中...
            </span>
            <span v-else>提交申请</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { 
  User as UserIcon,
  UserCircle as UserCircleIcon,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  Code as CodeIcon,
  Wrench as WrenchIcon,
  FileText as DocumentIcon,
  Upload as UploadIcon,
  Trash as TrashIcon,
  X as XIcon,
  Plus as PlusIcon,
  Info as InfoIcon
} from 'lucide-vue-next'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  job: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

// 表单状态
const applicationType = ref('online')
const hasResume = ref(false)
const submitting = ref(false)
const resumeFile = ref<File | null>(null)
const jobIntention = ref('')
const selfIntroduction = ref('')

// 文件上传相关
const fileInput = ref<HTMLInputElement | null>(null)

// 在线简历表单数据
const resume = reactive({
  name: '',
  gender: '',
  phone: '',
  email: '',
  education: '',
  experience: '',
  educations: [
    {
      school: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: ''
    }
  ],
  workExperiences: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ],
  projects: [
    {
      name: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ],
  skills: [
    { name: '', level: '熟悉' }
  ],
  selfDescription: ''
})

// 添加/删除教育经历
const addEducation = () => {
  resume.educations.push({
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: ''
  })
}

const removeEducation = (index: number) => {
  if (resume.educations.length > 1) {
    resume.educations.splice(index, 1)
  }
}

// 添加/删除工作经历
const addWorkExperience = () => {
  resume.workExperiences.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

const removeWorkExperience = (index: number) => {
  if (resume.workExperiences.length > 1) {
    resume.workExperiences.splice(index, 1)
  }
}

// 添加/删除项目经历
const addProject = () => {
  resume.projects.push({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

const removeProject = (index: number) => {
  if (resume.projects.length > 1) {
    resume.projects.splice(index, 1)
  }
}

// 添加/删除技能
const addSkill = () => {
  resume.skills.push({ name: '', level: '熟悉' })
}

const removeSkill = (index: number) => {
  resume.skills.splice(index, 1)
  if (resume.skills.length === 0) {
    addSkill()
  }
}

// 触发文件选择框
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    resumeFile.value = target.files[0]
  }
}

// 移除已选择的文件
const removeFile = () => {
  resumeFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 提交申请
const submitApplication = async () => {
  submitting.value = true
  
  try {
    // 根据申请类型收集不同的数据
    const applicationData = {
      jobId: props.job.id,
      applicationType: applicationType.value,
    }
    
    if (applicationType.value === 'upload') {
      // 上传简历文件的情况
      if (!resumeFile.value && !hasResume.value) {
        alert('请上传简历文件')
        submitting.value = false
        return
      }
      
      // 构建表单数据
      const formData = new FormData()
      formData.append('jobId', props.job.id.toString())
      formData.append('jobIntention', jobIntention.value)
      formData.append('selfIntroduction', selfIntroduction.value)
      
      if (resumeFile.value) {
        formData.append('resumeFile', resumeFile.value)
      }
      
      // 这里可以调用API上传文件
      // 示例: await uploadResumeFile(formData)
      
      console.log('提交文件申请:', formData)
    } else {
      // 在线填写简历的情况
      // 表单验证
      if (!resume.name) {
        alert('请填写姓名')
        submitting.value = false
        return
      }
      
      if (!resume.phone) {
        alert('请填写联系电话')
        submitting.value = false
        return
      }
      
      if (!resume.email) {
        alert('请填写邮箱')
        submitting.value = false
        return
      }
      
      // 提交在线简历数据
      console.log('提交在线简历:', resume)
    }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 提交成功
    emit('submit', { type: applicationType.value })
  } catch (error) {
    console.error('提交申请出错:', error)
    alert('提交申请失败，请稍后再试')
  } finally {
    submitting.value = false
  }
}

// 初始化函数
onMounted(() => {
  // 这里可以调用API检查用户是否已有简历
  // 示例: const result = await checkUserResume()
  // hasResume.value = result.hasResume
  
  // 模拟数据，假设用户已有简历
  setTimeout(() => {
    hasResume.value = true
  }, 500)
})
</script> 