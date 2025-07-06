// src/lib/api/project.ts
import { apiRequest } from './apiClient'
import qs from 'qs'

// 项目合作管理相关接口类型定义
export interface Project {
  projectId: number
  title: string
  description: string
  initiatorType: 'school' | 'enterprise'
  initiatorId: number
  field?: string
  budget?: number
  contact: string
  attachments?: string[]
  status: 'pending' | 'active' | 'closed' | 'rejected'
  createdAt?: string
  updatedAt?: string
  projectName?: string
}

export interface ProjectListResponse {
  total: number
  list: Project[]
}

export interface ProjectDetail extends Project {
  members?: ProjectMember[]
  applications?: ProjectApplication[]
  progress?: ProjectProgress[]
  documents?: ProjectDocument[]
  fundRecords?: FundRecord[]
}

export interface ProjectMember {
  userId: number
  realName?: string
  nickname?: string
  joinedAt?: string
  createdAt?: string
  reason?: string
}

export interface ProjectApplication {
  applicationId: number
  projectId: number
  applicantType: 'school' | 'enterprise'
  applicantId: number
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: string
  reviewerId?: number
  reviewComment?: string
}

export interface ProjectProgress {
  progressId: number
  projectId: number
  stage: string
  content: string
  attachments?: string[]
  createdAt?: string
}

export interface ProjectDocument {
  documentId: number
  projectId: number
  type: 'contract' | 'report' | 'other'
  url: string
  description?: string
  createdAt?: string
}

export interface FundRecord {
  fundId: number
  projectId: number
  amount: number
  purpose: string
  applicantId: number
  applicantName?: string
  status: 'pending' | 'approved' | 'rejected' | 'used'
  attachments?: string[]
  reviewerId?: number
  reviewerName?: string
  reviewComment?: string
  createdAt?: string
}

// 项目合作管理相关API接口

// 1. 项目发布与对接
export function getProjects(params: any = {}): Promise<{ data: ProjectListResponse }> {
  const query = qs.stringify(params, { arrayFormat: 'repeat' })
  return apiRequest(`/v1/projects?${query}`)
}

export function getProject(projectId: number): Promise<{ data: ProjectDetail }> {
  return apiRequest(`/v1/projects/${projectId}`)
}

export function createProject(data: any): Promise<{ data: { projectId: number; status: string } }> {
  return apiRequest('/v1/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function updateProject(data: any): Promise<{ data: { projectId: number; status: string } }>  {
  return apiRequest(`/v1/projects`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export function applyForProject(projectId: number, data: any): Promise<{ data: { applicationId: number; status: string } }> {
  return apiRequest(`/v1/projects/${projectId}/apply`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function getProjectApplications(projectId: number): Promise<{ data: ProjectApplication[] }> {
  return apiRequest(`/v1/projects/${projectId}/applications`)
}


export function reviewApplication(projectId: number, applicationId: number, data: any): Promise<{ data: { result: string } }> {
  return apiRequest(`/v1/projects/${projectId}/applications/${applicationId}/review`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}


export function getMyProjectApplications() {
  return apiRequest('/v1/projects/application/my-applications')
}



// 发起合同
export function createContract(projectId: number, data: {
  contractName: string,
  contractUrl: string,
  receiverId: number,
  remark?: string
}) {
  return apiRequest(`/v1/projects/${projectId}/contracts`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}


// 获取合同详情
export function getContractDetail(projectId: number, contractId: number) {
  return apiRequest(`/v1/projects/${projectId}/contracts/${contractId}`)
}

// 更新合同状态
export function updateContractStatus(projectId: number, contractId: number, data: {
  status: string,
  remark?: string
}) {
  return apiRequest(`/v1/projects/${projectId}/contracts/${contractId}/status`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 获取项目下所有合同
export function getContracts(projectId: number) {
  return apiRequest(`/v1/projects/${projectId}/contracts`)
}






// 2. 项目全周期管理
export function addProjectProgress(projectId: number, data: any): Promise<{ data: { progressId: number } }> {
  return apiRequest(`/v1/projects/${projectId}/progress`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function closeProject(projectId: number, data: any): Promise<{ data: { status: string } }> {
  return apiRequest(`/v1/projects/${projectId}/close`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}


// 2.1.1 获取项目进度列表
export function getProjectProgressList(projectId: number): Promise<{ data: ProjectProgress[] }> {
  return apiRequest(`/v1/projects/${projectId}/progress`)
}

export function getClosure(projectId: number) {
  return apiRequest(`/v1/projects/${projectId}/closure`)
}









// 3. 合同与资料管理
export function uploadProjectDocument(projectId: number, data: any): Promise<{ data: { documentId: number } }> {
  return apiRequest(`/v1/projects/${projectId}/documents`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function getProjectDocuments(projectId: number): Promise<{ data: ProjectDocument[] }> {
  return apiRequest(`/v1/projects/${projectId}/documents`)
}





// 4. 经费管理
export function applyForFund(projectId: number, data: any): Promise<{ data: { fundId: number; status: string } }> {
  return apiRequest(`/v1/projects/${projectId}/funds/apply`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function reviewFund(projectId: number, fundId: number, data: any): Promise<{ data: { result: string } }> {
  return apiRequest(`/v1/projects/${projectId}/funds/${fundId}/review`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function getProjectFundRecords(projectId: number): Promise<{ data: FundRecord[] }> {
  return apiRequest(`/v1/projects/${projectId}/funds/records`)
}

export function getProjectFundList(projectId: number): Promise<{ data: FundRecord[] }> {
  return apiRequest(`/v1/projects/${projectId}/funds`)
}








// 5. 日志与操作记录
export function getProjectLogs(projectId: number): Promise<{ data: any[] }> {
  return apiRequest(`/v1/projects/${projectId}/logs`)
}





// 保留原有的旧接口以兼容现有代码
export interface ProjectListResponseOld {
  records: Project[]
  total: number
  current: number
}

export function getProjectsOld(params: any = {}): Promise<{ data: ProjectListResponseOld }> {
  const query = qs.stringify(params, { arrayFormat: 'repeat' })
  return apiRequest(`/v1/projects?${query}`)
}

export function deleteProject(id: number) {
  return apiRequest(`/v1/projects/${id}`, { method: 'DELETE' })
}

export function getProjectMembers(projectId: number): Promise<{ data: ProjectMember[] }> {
  return apiRequest(`/v1/projects/${projectId}/members`, { method: 'GET' })
}

export function removeProjectMember(userId: number, projectId: number) {
  return apiRequest(`/v1/projects/${projectId}/member/${userId}`, { method: 'DELETE' })
}

// 6. 动态权限管理
export function assignProjectPermission(
  projectId: number,
  data: { userId: number; roles: string[]; expireAt?: string }
): Promise<{ code: number; message: string; data: { result: string } }> {
  return apiRequest('/v1/projects/' + projectId + '/permissions/assign', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function revokeProjectPermission(projectId: number, data: { userId: number; roles: string[] }) {
  return apiRequest(`/v1/projects/${projectId}/permissions/revoke`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function getProjectPermissions(projectId: number, userId?: number) {
  const query = userId ? `?userId=${userId}` : ''
  return apiRequest(`/v1/projects/${projectId}/permissions${query}`)
}

export function getProjectPermissionLogs(projectId: number) {
  return apiRequest(`/v1/projects/${projectId}/permissions/logs`)
}

// 文件上传（建议单独放到 src/lib/api/file.ts）
export function uploadFile(file: File): Promise<{ code: number; message: string; data: { file_url: string } }> {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest('/files/upload', {
    method: 'POST',
    body: formData
  })
}

export function updateProjectStatus(projectId: number, status: string, reason: string) {
  // 拼接查询参数
  const params = new URLSearchParams({ status, reason}).toString()
  return apiRequest(`/v1/projects/${projectId}/status?${params}`, {
    method: 'PUT'
    // 不需要 body
  })
}

