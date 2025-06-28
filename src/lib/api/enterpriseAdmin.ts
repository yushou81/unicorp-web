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

// 获取企业导师列表（分页）
export function getMentorList(params: { page?: number; size?: number } = {}) {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.append('page', String(params.page))
  if (params.size !== undefined) query.append('size', String(params.size))
  const q = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/enterprise-admin/mentors${q}`)
} 