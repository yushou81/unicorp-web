<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">发布新项目</h2>
        
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <!-- 基本信息 -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">基本信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">项目名称 *</label>
                  <input 
                    v-model="form.title" 
                    type="text" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入项目名称"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">计划人数 *</label>
                  <input 
                    v-model.number="form.maxMemberCount" 
                    type="number" 
                    min="1" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入计划人数"
                  />
                </div>
              </div>
              <div class="mt-6">
                <label class="block text-gray-700 mb-2 font-medium">项目描述 *</label>
                <textarea 
                  v-model="form.description" 
                  required 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="请详细描述项目内容、目标和要求"
                ></textarea>
              </div>
            </div>

            <!-- 项目属性 -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">项目属性</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">项目难度 *</label>
                  <select 
                    v-model="form.difficulty" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择项目难度</option>
                    <option value="基础/Basic">基础/Basic</option>
                    <option value="进阶/Advanced">进阶/Advanced</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">支持语言 *</label>
                  <select 
                    v-model="form.language" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择支持语言</option>
                    <option value="中文&English">中文&English</option>
                    <option value="中文">中文</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">技术领域 *</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in techOptions"
                      :key="item"
                      type="button"
                      @click="toggleTech(item)"
                      :class="form.tech.includes(item) ? activeBtn : inactiveBtn"
                    >{{ item }}</button>
                  </div>
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">编程语言 *</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in codeOptions"
                      :key="item"
                      type="button"
                      @click="toggleCode(item)"
                      :class="form.code.includes(item) ? activeBtn : inactiveBtn"
                    >{{ item }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 附件 -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">附件</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-gray-700 mb-2 font-medium">上传附件（PDF或Word格式）*</label>
                <!-- 自定义上传按钮 -->
                <div class="flex items-center gap-4">
                  <label
                    class="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                    for="file-upload"
                  >选择文件</label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    @change="onFileChange"
                    multiple
                    class="hidden"
                  />
                  <!-- 只显示已选文件数量 -->
                  <span v-if="form.planFiles.length" class="text-gray-700 text-sm">
                    已选择 {{ form.planFiles.length }} 个文件
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">支持PDF或Word格式，文件大小不超过10MB</p>
                <!-- 附件列表 -->
                <div v-if="form.planFiles.length" class="flex flex-wrap gap-2 mt-4">
                  <div
                    v-for="(file, idx) in form.planFiles"
                    :key="file.name + file.size + file.lastModified"
                    class="flex items-center bg-white border rounded px-3 py-1 shadow mr-2 mb-2"
                  >
                    <span class="text-sm text-gray-700 mr-2">{{ file.name }} ({{ (file.size / 1024).toFixed(1) }}KB)</span>
                    <button
                      type="button"
                      @click="removeFile(idx)"
                      class="text-gray-400 hover:text-red-500 ml-1"
                      title="移除"
                    >×</button>
                  </div>
                </div>
                <div v-else class="text-gray-400 text-sm mt-4">暂无已上传附件</div>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="flex justify-center">
              <button 
                type="submit" 
                :disabled="submitting" 
                class="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? '发布中...' : '发布项目' }}
              </button>
            </div>
          </form>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">项目类型</label>
          <select v-model="type" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="科研">科研</option>
            <option value="人才培养">人才培养</option>
            <option value="创新">创新</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">项目简介</label>
          <textarea v-model="desc" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">联系人</label>
          <input v-model="contact" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" class="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">提交发布</button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const title = ref('')
const type = ref('科研')
const desc = ref('')
const contact = ref('')
const router = useRouter()
function onSubmit() {
  // 这里可接入API
  alert('项目发布成功，等待审核/对接！')
  router.push('/project/list')
}

const form = ref({
  title: '',
  maxMemberCount: 1, // 这里可以不改名，但提交时要映射到 planMemberCount
  description: '',
  difficulty: '',
  language: '', // 这里建议改成数组，或者提交时转成数组
  tech: [] as string[],
  code: [] as string[],
  planFiles: [] as File[]
})

const techOptions = ['.NET', 'AI', 'ARM', 'Angular', 'AWS', 'AndroidX', 'Apache', 'Appium']
const codeOptions = ['C', 'C++', 'Java', 'Python', 'Go', 'JavaScript', 'HTML', 'MATLAB']

const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'

function toggleTech(item: string) {
  const idx = form.value.tech.indexOf(item)
  if (idx > -1) {
    form.value.tech.splice(idx, 1)
  } else {
    form.value.tech.push(item)
  }
}

function toggleCode(item: string) {
  const idx = form.value.code.indexOf(item)
  if (idx > -1) {
    form.value.code.splice(idx, 1)
  } else {
    form.value.code.push(item)
  }
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    const newFiles = Array.from(files)
    const existing = form.value.planFiles
    
    for (const f of newFiles) {
      if (!existing.some(ef => ef.name === f.name && ef.size === f.size && ef.lastModified === f.lastModified)) {
        existing.push(f)
      }
    }
    
    (e.target as HTMLInputElement).value = ''
  }
}

function removeFile(idx: number) {
  form.value.planFiles.splice(idx, 1)
}



async function onSubmit() {
  
  if (!form.value.planFiles.length) {
    alert('请上传附件')
    return
  }
  if (form.value.tech.length === 0) {
    alert('请选择至少一个技术领域')
    return
  }
  if (form.value.code.length === 0) {
    alert('请选择至少一个编程语言')
    return
  }
  submitting.value = true
  try {
    // 上传所有文件
    const fileUrls: string[] = []
    for (const file of form.value.planFiles) {
      const fileFd = new FormData()
      fileFd.append('file', file)
      const fileRes = await uploadFile(fileFd)
      fileUrls.push(fileRes.data.file_url)
    }
    console.log('文件上传返回：', fileUrls)

    // 组装 JSON 数据
    const projectData = {
    title: form.value.title,
    planMemberCount: form.value.maxMemberCount,
    description: form.value.description,
    difficulty: form.value.difficulty,
    supportLanguages: form.value.language ? form.value.language.split('&') : [],
    techFields: form.value.tech,
    programmingLanguages: form.value.code,
    projectProposalUrls: fileUrls
  }

    await createProject(projectData)
    alert('项目发布成功！')
    router.push('/company/projects')
  } catch (e: any) {
    alert('发布失败：' + (e.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}
</script>
