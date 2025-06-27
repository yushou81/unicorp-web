import { apiRequest } from './apiClient'

// 获取学校列表
export function getSchoolList() {
  return apiRequest('/organizations/schools')
} 