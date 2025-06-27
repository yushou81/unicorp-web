import { apiRequest } from './apiClient'

// 学校管理员创建教师账号
export function createTeacher(data: {
  email: string
  nickname?: string
  password: string
  phone?: string
}) {
  return apiRequest('/school-admin/teachers', {
    method: 'POST',
    body: JSON.stringify(data)
  })
} 