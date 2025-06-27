import { apiRequest } from './apiClient'

// 企业管理员创建企业导师账号
export function createMentor(data: {
  email: string
  nickname?: string
  password: string
  phone?: string
}) {
  return apiRequest('/enterprise-admin/mentors', {
    method: 'POST',
    body: JSON.stringify(data)
  })
} 