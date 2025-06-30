import { apiRequest } from './apiClient'

// 获取学校列表
export function getSchoolList() {
  return apiRequest('/v1/organizations/schools')
}

// 获取学校列表（公开接口，供学生注册时选择）
export function getAllSchools(view: 'simple' | 'detailed' = 'simple') {
  return apiRequest(`/v1/organizations/schools?view=${view}`)
}

// 获取学校详情（公开接口）
export function getSchoolById(id: number) {
  return apiRequest(`/v1/organizations/schools/${id}`)
}

// 获取企业列表（公开接口）
export function getAllEnterprises(view: 'simple' | 'detailed' = 'simple') {
  return apiRequest(`/v1/organizations/enterprises?view=${view}`)
}

// 获取企业详情（公开接口）
export function getEnterpriseById(id: number) {
  return apiRequest(`/v1/organizations/enterprises/${id}`)
}

// 上传组织Logo
export function uploadOrganizationLogo(id: number, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return apiRequest(`/v1/organizations/${id}/logo`, {
    method: 'POST',
    body: formData,
    headers: {}
  })
} 