import { apiRequest } from './apiClient'

// 获取学校列表
export function getSchoolList() {
  return apiRequest('/organizations/schools')
}

// 获取学校列表（公开接口，供学生注册时选择）
export function getAllSchools(view: 'simple' | 'detailed' = 'simple') {
  return apiRequest(`/organizations/schools?view=${view}`)
}

// 获取企业列表（公开接口）
export function getAllEnterprises(view: 'simple' | 'detailed' = 'simple') {
  return apiRequest(`/organizations/enterprises?view=${view}`)
} 