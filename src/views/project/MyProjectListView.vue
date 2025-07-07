<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div class="container mx-auto px-4">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <button
            @click="router.back()"
            class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
        </div>
  
        <!-- 标题 -->
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">我的项目管理</h2>
  
        <!-- 搜索框 -->
        <div class="flex justify-center mb-6">
          <input
            v-model="keyword"
            @keyup.enter="onSearch"
            type="text"
            placeholder="请输入项目名称/项目编号"
            class="flex-1 max-w-2xl border border-blue-400 rounded-l-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          />
          <button
            @click="onSearch"
            class="px-8 py-3 rounded-r-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-base"
          >
            查找项目
          </button>
        </div>
  
        <!-- 筛选栏 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">按条件筛选项目</h2>
          <div class="space-y-4">
            <!-- 项目状态 -->
            <div class="flex items-center flex-wrap overflow-x-auto">
              <span class="mr-4 font-medium whitespace-nowrap">项目状态：</span>
              <div class="flex space-x-2">
                <button
                  v-for="item in statusOptions"
                  :key="item.value"
                  @click="selectFilter(item.value)"
                  :class="isSelected(item.value) ? activeBtn : inactiveBtn"
                  class="mb-2"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
  

  
  
        <!-- 项目表格 -->
        <div class="bg-white rounded-2xl shadow-lg p-4">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2">项目名称</th>
                <th class="px-4 py-2">发起方</th>
                <th class="px-4 py-2">项目领域</th>
                <th class="px-4 py-2">状态</th>
                <th class="px-4 py-2">联系方式</th>
                <th class="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.projectId" class="border-b hover:bg-blue-50 transition">
                <td class="px-4 py-2 text-center">
                  <router-link :to="`/project/detail/${project.projectId}`" class="text-blue-600 hover:text-blue-800 font-medium">
                    {{ project.title }}
                  </router-link>
                </td>
                <td class="px-4 py-2 text-center">
                  <span class="text-blue-600">{{ project.organizationName || '-' }}</span>
                </td>
                <td class="px-4 py-2 text-center">{{ project.field || '-' }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="getStatusClass(project.status)">
                    {{ getStatusText(project.status) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-center">{{ project.contact }}</td>
                <td class="px-4 py-2 text-center">
                  <router-link :to="`/project/detail/${project.projectId}`">
                    <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs mr-1 shadow hover:bg-blue-600 transition">
                      查看详情
                    </button>
                  </router-link>
                  <!-- draft: 编辑、取消 -->
                  <button v-if="project.status === 'draft'" @click="editProject(project.projectId)" class="px-2 py-1 rounded-md bg-yellow-500 text-white text-xs mr-1 shadow hover:bg-yellow-600 transition">编辑</button>
                  <button v-if="project.status === 'draft'" @click="cancelProject(project.projectId)" class="px-2 py-1 rounded-md bg-orange-500 text-white text-xs shadow hover:bg-orange-600 transition">取消</button>
                  <!-- pending: 查看申请、取消 -->
                  <button v-if="project.status === 'pending'" @click="cancelProject(project.projectId)" class="px-2 py-1 rounded-md bg-orange-500 text-white text-xs shadow hover:bg-orange-600 transition">取消</button>
                  <!-- active: 查看申请、终止 -->
                  <button v-if="project.status === 'active'" @click="viewApplication(project.projectId)" class="px-2 py-1 rounded-md bg-indigo-500 text-white text-xs mr-1 shadow hover:bg-indigo-600 transition">查看申请</button>
                  
                  <!-- matched: 合同相关按钮 -->
                  <template v-if="project.status === 'matched'">
                    <!-- 合同全部被拒绝 -->
                    <template v-if="allContractsRejected(project.projectId)">
                      <button
                        @click="startContract(project.projectId)"
                        class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs shadow hover:bg-blue-600 transition"
                      >重新发起合同</button>
                      <button
                        @click="terminateProject(project.projectId)"
                        class="px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 transition ml-1"
                      >终止</button>
                    </template>
                    <!-- 有已签署合同 -->
                    <template v-else-if="hasApprovedContract(project.projectId)">
                      <template v-if="applyFinishMap[String(project.projectId)]">
                        <span
                          class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow cursor-pointer"
                          @click="refreshProjects"
                        >已申请结项</span>
                      </template>
                      <template v-else>
                        <button
                          @click="onApplyFinish(project.projectId)"
                          class="px-2 py-1 rounded-md bg-purple-600 text-white text-xs shadow hover:bg-purple-700 transition"
                        >申请结项</button>
                        <button
                          @click="openFundApplyDialog(project.projectId)"
                          class="px-2 py-1 rounded-md bg-green-800 text-white text-xs shadow hover:bg-green-900 transition ml-1"
                        >经费申请</button>
                        <router-link :to="`/project/${project.projectId}/fund-readonly`">
                          <button
                            class="px-2 py-1 rounded-md bg-blue-400 text-white text-xs shadow hover:bg-blue-500 transition ml-1"
                          >经费申请详情</button>
                        </router-link>
                      </template>
                    </template>
                    <!-- 有待签署合同 -->
                    <template v-else-if="hasPendingContract(project.projectId)">
                      <span class="px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs shadow">等待对方签署</span>
                      <button
                        @click="terminateProject(project.projectId)"
                        class="px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 transition ml-1"
                      >终止</button>
                    </template>
                    <!-- 没有合同 -->
                    <template v-else>
                      <button
                        @click="startContract(project.projectId)"
                        class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs shadow hover:bg-blue-600 transition"
                      >发起合同</button>
                      <button
                        @click="terminateProject(project.projectId)"
                        class="px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 transition ml-1"
                      >终止</button>
                    </template>
                  </template>
                  
                  <!-- rejected: 查看拒绝缘由 -->
                  <button v-if="project.status === 'rejected'" @click="viewReason(project)" class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
                  <!-- canceled: 查看取消原因 -->
                  <button v-if="project.status === 'canceled'" @click="viewReason(project)" class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
                  <!-- terminated: 查看终止原因 -->
                  <button v-if="project.status === 'terminated'" @click="viewReason(project)" class="px-2 py-1 rounded-md bg-gray-400 text-white text-xs shadow hover:bg-gray-500 transition">查看原因</button>
                  <!-- 申请合作按钮保留 -->
                  <button 
                    v-if="canApply(project)"
                    @click="applyProject(project.projectId)" 
                    class="px-2 py-1 rounded-md bg-green-500 text-white text-xs shadow hover:bg-green-600 transition"
                  >
                    申请合作
                  </button>
                </td>
              </tr>
              <tr v-if="projects.length === 0">
                <td colspan="6" class="text-center text-gray-400 py-6">暂无项目</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- 分页 -->
        <div class="flex justify-center mt-6">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            上一页
          </button>
          <span class="mx-2">第 {{ currentPage }} / {{ Math.ceil(total / pageSize) }} 页</span>
          <button
            :disabled="currentPage === Math.ceil(total / pageSize)"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>
  
     
  
      
  
  
  
      <!-- 查看原因弹窗 -->
      <div v-if="reasonViewDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <div class="font-bold text-lg mb-2">原因</div>
          <div class="text-gray-700 mb-4 whitespace-pre-line">{{ reasonText }}</div>
          <div class="flex justify-end">
            <button @click="reasonViewDialogVisible = false" class="px-4 py-2 bg-blue-500 text-white rounded">关闭</button>
          </div>
        </div>
      </div>
  
      <!-- 输入原因弹窗 -->
      <div v-if="reasonDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <div class="font-bold text-lg mb-2">
            请输入
            <template v-if="currentAction === 'canceled'">取消</template>
            <template v-else-if="currentAction === 'terminated'">终止</template>
            原因
          </div>
          <textarea v-model="reasonText" class="w-full border rounded p-2 mb-4" rows="3" placeholder="请输入原因"></textarea>
          <div class="flex justify-end space-x-2">
            <button @click="reasonDialogVisible = false" class="px-4 py-2 bg-gray-300 rounded">取消</button>
            <button @click="confirmReason" class="px-4 py-2 bg-blue-500 text-white rounded">确定</button>
          </div>
        </div>
      </div>
  
      <!-- 申请列表弹窗 -->
      <div v-if="showApplicationModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">项目申请列表</h3>
          <div v-if="applicationList.length === 0" class="text-gray-500">暂无申请</div>
          <table v-else class="min-w-full mb-4">
            <thead>
              <tr>
                <th class="px-2 py-1">申请人</th>
                <th class="px-2 py-1">所属组织</th>
                <th class="px-2 py-1">申请时间</th>
                <th class="px-2 py-1">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applicationList" :key="app.applicationId">
                <td class="px-2 py-1">{{ app.applicantName || app.applicantId }}</td>
                <td class="px-2 py-1">{{ app.organizationName || '-' }}</td>
                <td class="px-2 py-1">{{ dayjs(app.createdAt).format('YYYY-MM-DD HH:mm') }}</td>
                <td class="px-2 py-1">
                  <button @click="viewApplicationInfo(app)" class="text-blue-600 mr-2">查看详情</button>
                  <button v-if="app.status === 'pending'" @click="confirmApprove(app)" class="text-green-600 mr-2">同意</button>
                  <button v-if="app.status === 'pending'" @click="confirmReject(app)" class="text-red-600">拒绝</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-end">
            <button @click="showApplicationModal = false" class="px-4 py-2 bg-gray-300 rounded">关闭</button>
          </div>
        </div>
      </div>
  
      <!-- 申请信息弹窗 -->
      <div v-if="showApplicationInfoModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">申请说明</h3>
          <div v-if="selectedApplication">
            <div class="text-gray-700 whitespace-pre-line">{{ selectedApplication.message || '无说明' }}</div>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="showApplicationInfoModal = false" class="px-4 py-2 bg-blue-500 text-white rounded">关闭</button>
          </div>
        </div>
      </div>
  
      <!-- 发起合同弹窗 -->
      <div v-if="showNoContractDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <div class="font-bold text-lg mb-4">当前还未发起合同</div>
          <div class="text-gray-700 mb-6">是否现在发起合同？</div>
          <div class="flex justify-end space-x-3">
            <button @click="cancelInitiateContract" class="px-4 py-2 bg-gray-300 text-gray-700 rounded">取消</button>
            <button @click="confirmInitiateContract" class="px-4 py-2 bg-blue-600 text-white rounded">去发起合同</button>
          </div>
        </div>
      </div>
  
      <!-- 合同上传弹窗 -->
      <div v-if="showUploadContractDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <div class="font-bold text-lg mb-4">上传合同附件</div>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div v-if="uploadFileUrls.length === 0" class="space-y-2">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-sm text-gray-600">
                <label for="contract-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>上传合同附件</span>
                  <input id="contract-upload" type="file" class="sr-only" @change="onContractFileChange" multiple />
                </label>
                <p class="pl-1">或拖拽文件到此处</p>
              </div>
              <p class="text-xs text-gray-500">支持 PDF, DOC, DOCX，单个文件不超过 10MB</p>
            </div>
            <div v-else class="space-y-2">
              <div v-if="uploadFileUrls.length > 0" class="mb-2">
                <div v-for="(url, idx) in uploadFileUrls" :key="url" class="flex items-center text-xs mb-1">
                  <span class="truncate max-w-[180px] select-all" :title="url">{{ url.split('/').pop() }}</span>
                  <button @click="removeUploadFile(idx)" class="ml-2 text-red-500 hover:underline" title="移除">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <label for="contract-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>继续添加文件</span>
                <input id="contract-upload" type="file" class="sr-only" @change="onContractFileChange" multiple />
              </label>
            </div>
          </div>
          <textarea v-model="uploadRemark" rows="2" class="w-full border rounded mb-3" placeholder="备注（可选）"></textarea>
          <div class="flex justify-end space-x-3">
            <button @click="cancelUploadContract" class="px-4 py-2 bg-gray-300 text-gray-700 rounded">取消</button>
            <button @click="submitUploadContract" :disabled="uploadFileUrls.length === 0" class="px-4 py-2 bg-blue-600 text-white rounded">上传</button>
          </div>
        </div>
      </div>
  
      <!-- 有效合同弹窗 -->
      <div v-if="showValidContractsDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-[700px] max-w-[95vw]">
          <div class="font-bold text-lg mb-4 text-center">合同详情</div>
          <div v-for="contract in validContracts" :key="contract.contractId" class="mb-6 border-b pb-4">
            <div class="font-semibold text-base mb-2">名称：{{ contract.contractName || '无' }}</div>
            <div class="mb-2">备注：{{ contract.remark || '-' }}</div>
            <div class="mb-2 flex flex-col items-start">
              <div class="mb-1">附件：</div>
              <div class="flex flex-wrap gap-2">
                <template v-for="(fileUrl, fileIdx) in contract.contractUrl.split(',')" :key="fileIdx">
                  <div class="flex items-center bg-gray-100 rounded px-3 py-1 shadow-sm">
                    <svg class="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v4" />
                    </svg>
                    <span class="truncate max-w-[200px] select-all" :title="fileUrl">{{ fileUrl.split('/').pop() }}</span>
                    <button @click="handleDownloadFile(fileUrl)" class="ml-2 px-2 py-0.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-700">下载</button>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button @click="closeValidContractsDialog" class="px-4 py-2 bg-gray-300 text-gray-700 rounded">关闭</button>
          </div>
        </div>
      </div>
  
      <!-- 经费申请弹窗 -->
      <div v-if="showFundApplyDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-96">
          <div class="font-bold text-lg mb-2">经费申请</div>
          <div class="mb-3">
            <label class="block mb-1">金额（元）</label>
            <input v-model="fundAmount" type="number" min="0" step="0.01" class="w-full border rounded p-2" placeholder="请输入金额" />
          </div>
          <div class="mb-3">
            <label class="block mb-1">用途</label>
            <input v-model="fundPurpose" class="w-full border rounded p-2" placeholder="请输入经费用途" />
          </div>
          <div class="mb-3">
            <label class="block mb-1">附件（可选）</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center mb-2">
              <input id="fund-upload" type="file" class="sr-only" @change="onFundFileChange" multiple />
              <label for="fund-upload" class="cursor-pointer text-blue-600 hover:underline">上传附件</label>
              <div v-if="fundUploading" class="text-xs text-gray-400 mt-1">上传中...</div>
              <div v-if="fundAttachments.length > 0" class="mt-2 space-y-1">
                <div v-for="(url, idx) in fundAttachments" :key="url" class="flex items-center text-xs">
                  <span class="truncate max-w-[180px] select-all" :title="url">{{ url.split('/').pop() }}</span>
                  <button @click="removeFundAttachment(idx)" class="ml-2 text-red-500 hover:underline" title="移除">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="block mb-1">备注（可选）</label>
            <textarea v-model="fundRemark" rows="2" class="w-full border rounded" placeholder="备注"></textarea>
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="cancelFundApply" class="px-4 py-2 bg-gray-300 rounded">取消</button>
            <button @click="submitFundApply" :disabled="fundUploading" class="px-4 py-2 bg-blue-600 text-white rounded">提交</button>
          </div>
        </div>
      </div>
  
      <!-- 经费申请详情弹窗 -->
      <div v-if="showFundDetailDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-[600px] max-w-[95vw]">
          <div class="font-bold text-lg mb-4">经费申请记录</div>
          <div v-if="fundDetailList.length === 0" class="text-gray-500">暂无经费申请记录</div>
          <table v-else class="min-w-full mb-4">
            <thead>
              <tr>
                <th class="px-2 py-1">金额</th>
                <th class="px-2 py-1">用途</th>
                <th class="px-2 py-1">备注</th>
                <th class="px-2 py-1">附件</th>
                <th class="px-2 py-1">申请时间</th>
                <th class="px-2 py-1">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in fundDetailList" :key="item.fundId">
                <td class="px-2 py-1">{{ item.amount }}</td>
                <td class="px-2 py-1">{{ item.purpose }}</td>
                <td class="px-2 py-1">{{ item.remark || '-' }}</td>
                <td class="px-2 py-1">
                  <template v-if="item.attachments && item.attachments.length">
                    <a
                      v-for="(url, idx) in item.attachments"
                      :key="url"
                      :href="url"
                      target="_blank"
                      class="text-blue-600 underline mr-1"
                    >附件{{ idx + 1 }}</a>
                  </template>
                  <span v-else>-</span>
                </td>
                <td class="px-2 py-1">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm') }}</td>
                <td class="px-2 py-1">{{ item.status || '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-end">
            <button @click="closeFundDetailDialog" class="px-4 py-2 bg-gray-300 rounded">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'
  import { getProjects, updateProjectStatus, getProjectApplications, reviewApplication, getContracts, createContract, addProjectProgress, applyForFund, getClosure, getProjectProgressList, getProjectFundRecords } from '@/lib/api/project'
  import { uploadFile, downloadFile } from '@/lib/api/file'
  import dayjs from 'dayjs'
  
  const router = useRouter()
  const appStore = useAppStore()
  
  // 数据
  const projects = ref<any[]>([])
  const keyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  
  // 筛选项
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'draft', label: '未提交' },
    { value: 'pending', label: '待审核' },
    { value: 'active', label: '待合作' },
    { value: 'matched', label: '已合作' },
    { value: 'closed', label: '已完成' },
    { value: 'rejected', label: '已驳回' },
    { value: 'canceled', label: '已取消' },
    { value: 'terminated', label: '已终止' }
  ]
  
  const filter = ref({
    status: ''
  })
  
  const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
  const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'
  
  // 申请相关
  const showApplyModal = ref(false)
  const applyMessage = ref('')
  const currentProjectId = ref<number | null>(null)
  const currentAction = ref<'canceled' | 'terminated' | null>(null)
  
  // 智能推荐相关
  const showRecommendModal = ref(false)
  const showCycleModal = ref(false)
  
  // 原因相关
  const reasonDialogVisible = ref(false)
  const reasonText = ref('')
  const reasonViewDialogVisible = ref(false)
  
  // 申请列表相关
  const showApplicationModal = ref(false)
  const applicationList = ref<any[]>([])
  const selectedApplication = ref<any>(null)
  const showApplicationInfoModal = ref(false)
  
  // 发起合同相关
  const showNoContractDialog = ref(false)
  const pendingProjectId = ref<number | null>(null)
  
  // 合同上传相关
  const showUploadContractDialog = ref(false)
  const uploadFileUrls = ref<string[]>([])
  const uploadRemark = ref('')
  
  // 有效合同相关
  const showValidContractsDialog = ref(false)
  const validContracts = ref<any[]>([])
  
  const contractMap = ref<Record<number, boolean>>({})
  
  const finishProjectMap = ref<Record<number, boolean>>({})
  
  const allContractsSignedMap = ref<Record<number, boolean>>({})
  
  // 新增：经费申请相关
  const showFundApplyDialog = ref(false)
  const fundApplyProjectId = ref<number | null>(null)
  const fundAmount = ref('')
  const fundPurpose = ref('')
  const fundAttachments = ref<string[]>([])
  const fundRemark = ref('')
  const fundUploading = ref(false)
  
  const applyFinishMap = ref<Record<string, boolean>>({})
  
  // 经费申请详情相关变量
  const showFundDetailDialog = ref(false)
  const fundDetailList = ref<any[]>([])
  
  const contractsMap = ref<Record<number, any[]>>({})
  
  // 方法
  function selectFilter(value: string) {
    filter.value.status = value
    currentPage.value = 1
    fetchProjects(1)
  }
  
  function isSelected(value: string): boolean {
    return filter.value.status === value
  }
  
  async function fetchProjects(page = currentPage.value) {
    try {
      const params = {
        page,
        pageSize: pageSize.value,
        keyword: keyword.value,
        status: filter.value.status || undefined,
        initiatorId: appStore.user?.id
      }
      console.log('请求参数', params)
      const res = await getProjects(params)
      if (Array.isArray(res.data)) {
        projects.value = res.data
        total.value = res.data.length
      } else if (res.data.list) {
        projects.value = res.data.list
        total.value = res.data.total
      } else {
        projects.value = []
        total.value = 0
      }
      currentPage.value = page
      await updateContractMap()
      await updateAllContractsSignedMap()
      await updateApplyFinishMap()
      await nextTick()
    } catch (error) {
      console.error('获取项目列表失败:', error)
      projects.value = []
      total.value = 0
    }
  }
  
  function changePage(page: number) {
    currentPage.value = page
    fetchProjects(page)
  }
  
  function onSearch() {
    currentPage.value = 1
    fetchProjects(1)
  }
  
  function getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
      active: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
      closed: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
      rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs'
  }
  
  function getStatusText(status: string): string {
    const map: Record<string, string> = {
      draft: '未提交',
      pending: '待审核',
      active: '待合作',
      matched: '已合作',
      closed: '已完成',
      rejected: '已驳回',
      canceled: '已取消',
      terminated: '已终止'
    }
    return map[status] || status
  }
  
  function canApply(project: any): boolean {
    // 判断是否可以申请合作
    const userType = appStore.user?.role
    const projectInitiatorType = project.initiatorType
    
    // 如果用户是学校，只能申请企业项目；如果用户是企业，只能申请学校项目
    if (userType === 'TEACHER' && projectInitiatorType === 'enterprise') return true
    if (userType === 'EN_TEACHER' && projectInitiatorType === 'school') return true
    
    return false
  }
  
  function applyProject(projectId: number) {
    currentProjectId.value = projectId
    applyMessage.value = ''
    showApplyModal.value = true
  }
  
  async function submitApply() {
    try {
      // 这里需要调用申请合作的API
      console.log('申请合作:', {
        projectId: currentProjectId.value,
        message: applyMessage.value
      })
      
      showApplyModal.value = false
      // 可以显示成功提示
    } catch (error) {
      console.error('申请失败:', error)
    }
  }
  
  // 操作按钮相关方法（空实现，后续可补充具体逻辑）
  function editProject(projectId: number) {
    // 跳转到编辑页面
    router.push(`/project/edit/${projectId}`)
  }
  function cancelProject(projectId: number) {
    currentAction.value = 'canceled'
    currentProjectId.value = projectId
    reasonText.value = ''
    reasonDialogVisible.value = true
  }
  function terminateProject(projectId: number) {
    currentAction.value = 'terminated'
    currentProjectId.value = projectId
    reasonText.value = ''
    reasonDialogVisible.value = true
  }
  function viewApplication(projectId: number) {
    getProjectApplications(projectId)
      .then(res => {
        applicationList.value = res.data || []
        showApplicationModal.value = true
      })
      .catch(() => {
        alert('获取申请列表失败')
      })
  }
  function viewContract(projectId: number) {
    getContracts(projectId)
      .then((res: any) => {
        console.log('getContracts', projectId, res.data)
        const contracts = res.data || []
        // 过滤出所有非 rejected 合同
        const validList = contracts.filter((c: any) => c.status !== 'rejected')
        if (!contracts.length || validList.length === 0) {
          // 没有合同或全部被拒绝，可以上传新合同
          pendingProjectId.value = projectId
          showUploadContractDialog.value = true
          return
        }
        // 有有效合同，弹窗展示所有有效合同
        validContracts.value = validList
        showValidContractsDialog.value = true
      })
      .catch(() => {
        alert('获取合同信息失败')
      })
  }
  function viewReason(project: any) {
    reasonText.value = project.reason || '暂无原因'
    reasonViewDialogVisible.value = true
  }
  
  async function confirmReason() {
    if (!reasonText.value || !reasonText.value.trim()) {
      alert('请输入原因')
      return
    }
    if (currentProjectId.value && currentAction.value) {
      try {
        await updateProjectStatus(currentProjectId.value, currentAction.value, reasonText.value)
      } catch (e) {
        alert('操作失败')
      } finally {
        reasonDialogVisible.value = false
        fetchProjects()
      }
    }
  }
  
  function getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || '附件'
  }
  
  function viewApplicationInfo(application: any) {
    selectedApplication.value = application
    showApplicationInfoModal.value = true
  }
  
  function confirmApprove(app: any) {
    if (window.confirm('确定要同意该申请吗？')) {
      reviewApplication(app.projectId, app.applicationId, { status: 'approved' })
        .then(() => {
          alert('已同意')
          applicationList.value = applicationList.value.map(a =>
            a.applicationId === app.applicationId ? { ...a, status: 'approved' } : a
          )
        })
        .catch(() => {
          alert('操作失败')
        })
    }
  }
  
  function confirmReject(app: any) {
    if (window.confirm('确定要拒绝该申请吗？')) {
      reviewApplication(app.projectId, app.applicationId, { status: 'rejected' })
        .then(() => {
          alert('已拒绝')
          applicationList.value = applicationList.value.map(a =>
            a.applicationId === app.applicationId ? { ...a, status: 'rejected' } : a
          )
        })
        .catch(() => {
          alert('操作失败')
        })
    }
  }
  
  function confirmInitiateContract() {
    if (pendingProjectId.value) {
      router.push(`/project/${pendingProjectId.value}/contract/initiate`)
      showNoContractDialog.value = false
      pendingProjectId.value = null
    }
  }
  
  function cancelInitiateContract() {
    showNoContractDialog.value = false
    pendingProjectId.value = null
  }
  
  async function onContractFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])
      try {
        const res: any = await uploadFile(formData)
        const url = res.data.url || res.data.file_url
        if (url) uploadFileUrls.value.push(url)
      } catch (err) {
        alert('文件上传失败: ' + files[i].name)
      }
    }
  }
  
  async function submitUploadContract() {
    if (!pendingProjectId.value || uploadFileUrls.value.length === 0) return

    // 1. 获取项目申请列表
    const res = await getProjectApplications(pendingProjectId.value)
    const applications = res.data || []
    // 2. 找到已通过的申请
    const approvedApp = applications.find(app => app.status === 'approved')
    if (!approvedApp) {
      alert('未找到已通过的合作方，无法上传合同')
      return
    }
    const receiverId = approvedApp.applicantId

    // 获取项目名称
    const project = projects.value.find((p: any) => p.projectId === pendingProjectId.value)
    const contractName = project ? (project.title + '合同') : '合同'

    console.log('contractName:', contractName)

    // 3. 上传合同
    await createContract(pendingProjectId.value, {
      contractName,
      contractUrl: uploadFileUrls.value.join(','),
      receiverId,
      remark: uploadRemark.value
    })
    showUploadContractDialog.value = false
    uploadFileUrls.value = []
    uploadRemark.value = ''
    pendingProjectId.value = null
    fetchProjects()
  }
  
  function removeUploadFile(idx: number) {
    uploadFileUrls.value.splice(idx, 1)
  }
  
  function cancelUploadContract() {
    showUploadContractDialog.value = false
    uploadFileUrls.value = []
    uploadRemark.value = ''
    pendingProjectId.value = null
  }
  
  async function handleDownloadContract(contract: any) {
    try {
      // 从合同 url 中提取文件名
      const url = contract.contractUrl
      const filename = url.split('/').pop()
      if (!filename) {
        alert('无法获取文件名')
        return
      }
      const blob = await downloadFile(filename)
      // 创建下载链接
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    } catch (err) {
      alert('下载失败')
    }
  }
  
  function closeValidContractsDialog() {
    showValidContractsDialog.value = false
    validContracts.value = []
  }
  
  async function handleDownloadFile(fileUrl: string) {
    try {
      const filename = fileUrl.split('/').pop()
      if (!filename) {
        alert('无法获取文件名')
        return
      }
      const blob = await downloadFile(filename)
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    } catch (err) {
      alert('下载失败')
    }
  }
  
  function hasContract(projectId: number) {
    return contractMap.value[projectId] === true
  }
  
  async function updateContractMap() {
    for (const project of projects.value) {
      const res = await getContracts(project.projectId) as { data: any[] }
      const contracts = res.data || []
      contractMap.value[project.projectId] = Array.isArray(contracts) && contracts.length > 0
      contractsMap.value[project.projectId] = contracts
    }
  }
  
  function startContract(projectId: number) {
    pendingProjectId.value = projectId
    showUploadContractDialog.value = true
  }
  
  // 判断所有合同都已签署
  async function allContractsSigned(projectId: number): Promise<boolean> {
    const res = await getContracts(projectId) as { data: any[] }
    const contracts = res.data || []
    // 至少有一个合同，且全部为approved
    return contracts.length > 0 && contracts.every((c: any) => c.status === 'approved')
  }
  
  async function canShowFinishBtn(projectId: number): Promise<boolean> {
    // 已缓存则直接返回
    if (finishProjectMap.value[projectId] !== undefined) return finishProjectMap.value[projectId]
    // 判断所有合同都签署
    const signed = await allContractsSigned(projectId)
    finishProjectMap.value[projectId] = signed
    return signed
  }
  
  async function onApplyFinish(projectId: number) {
    if (!window.confirm('确定要申请结项吗？')) return
    try {
      await addProjectProgress(projectId, { stage: 'pending', content: '申请结项', attachments: [] })
      alert('申请结项已提交')
    } catch (e) {
      alert('申请失败')
    }
  }
  
  async function updateAllContractsSignedMap() {
    for (const project of projects.value) {
      if (project.status === 'matched') {
        const res = await getContracts(project.projectId) as { data: any[] }
        const contracts = res.data || []
        allContractsSignedMap.value[project.projectId] = contracts.length > 0 && contracts.every((c: any) => c.status === 'approved')
      } else {
        allContractsSignedMap.value[project.projectId] = false
      }
    }
  }
  
  function openFundApplyDialog(projectId: number) {
    fundApplyProjectId.value = projectId
    fundAmount.value = ''
    fundPurpose.value = ''
    fundAttachments.value = []
    fundRemark.value = ''
    showFundApplyDialog.value = true
  }
  
  async function onFundFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return
    fundUploading.value = true
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])
      try {
        const res: any = await uploadFile(formData)
        const url = res.data.url || res.data.file_url
        if (url) fundAttachments.value.push(url)
      } catch (err) {
        alert('文件上传失败: ' + files[i].name)
      }
    }
    fundUploading.value = false
  }
  
  function removeFundAttachment(idx: number) {
    fundAttachments.value.splice(idx, 1)
  }
  
  function cancelFundApply() {
    showFundApplyDialog.value = false
    fundApplyProjectId.value = null
    fundAmount.value = ''
    fundPurpose.value = ''
    fundAttachments.value = []
    fundRemark.value = ''
  }
  
  async function submitFundApply() {
    if (!fundApplyProjectId.value) return
    if (!fundAmount.value || isNaN(Number(fundAmount.value))) {
      alert('请输入正确的金额')
      return
    }
    if (!fundPurpose.value.trim()) {
      alert('请输入经费用途')
      return
    }
    try {
      await applyForFund(fundApplyProjectId.value, {
        amount: fundAmount.value,
        purpose: fundPurpose.value,
        attachments: fundAttachments.value,
        remark: fundRemark.value
      })
      alert('经费申请已提交')
      showFundApplyDialog.value = false
      fundApplyProjectId.value = null
      fundAmount.value = ''
      fundPurpose.value = ''
      fundAttachments.value = []
      fundRemark.value = ''
    } catch (e) {
      alert('申请失败')
    }
  }
  
  function refreshProjects() {
    fetchProjects()
  }
  
  async function updateApplyFinishMap() {
    applyFinishMap.value = {}
    const matchedProjects = projects.value.filter(p => p.status === 'matched')
    for (const project of matchedProjects) {
      try {
        const res = await getProjectProgressList(project.projectId) as { data: any[] }
        // 判断是否有"申请结项"进度
        const hasApplyFinish = Array.isArray(res.data) && res.data.some(
          prog => prog.content?.includes('申请结项')
        )
        applyFinishMap.value[String(project.projectId)] = hasApplyFinish
      } catch (e) {
        applyFinishMap.value[String(project.projectId)] = false
      }
    }
  }
  
  async function openFundDetailDialog(projectId: number) {
    try {
      const res = await getProjectFundRecords(projectId)
      fundDetailList.value = res.data || []
      showFundDetailDialog.value = true
    } catch (e) {
      alert('获取经费申请记录失败')
    }
  }
  
  function closeFundDetailDialog() {
    showFundDetailDialog.value = false
    fundDetailList.value = []
  }
  
  function hasValidContract(projectId: number): boolean {
    // 合同存在且有一个不是被拒绝的
    return contractMap.value[projectId] === true
  }
  
  function allContractsRejected(projectId: number): boolean {
    const contracts = contractsMap.value[projectId] || []
    return contracts.length > 0 && contracts.every((c: any) => c.status === 'rejected')
  }
  
  function hasApprovedContract(projectId: number): boolean {
    const contracts = contractsMap.value[projectId] || []
    return contracts.some((c: any) => c.status === 'approved')
  }
  
  function hasPendingContract(projectId: number): boolean {
    const contracts = contractsMap.value[projectId] || []
    return contracts.some((c: any) => c.status === 'pending')
  }
  
  onMounted(() => {
    fetchProjects()
  })
  </script>