import { apiRequest } from './apiClient'

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface ResumeData {
  major: string;
  educationLevel: string;
  achievements: string[];
  resumeUrl?: string;
}

/**
 * 获取用户简历信息
 * @returns 简历信息
 */
export async function getUserResume() {
  const url = `/v1/resume`
  console.log(`[getUserResume] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<ResumeData>>(`${url}`)
  console.log(`[getUserResume] 响应数据:`, response)
  
  return response
}

/**
 * 更新用户简历信息
 * @param data 简历数据
 * @returns 更新结果
 */
export async function updateUserResume(data: {
  major: string;
  educationLevel: string;
  achievements: string[];
}) {
  const url = `/v1/resume`
  console.log(`[updateUserResume] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<any>>(`${url}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  console.log(`[updateUserResume] 响应数据:`, response)
  
  return response
}

/**
 * 上传简历文件
 * @param formData 包含简历文件的FormData对象
 * @returns 上传结果
 */
export async function uploadResumeFile(formData: FormData) {
  const url = `/v1/resume/file`
  console.log(`[uploadResumeFile] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<{resumeUrl: string}>>(`${url}`, {
    method: 'POST',
    body: formData,
    // 使用FormData时不要设置Content-Type，浏览器会自动设置
    headers: {}
  })
  console.log(`[uploadResumeFile] 响应数据:`, response)
  
  return response
}

/**
 * 删除简历文件
 * @returns 删除结果
 */
export async function deleteResumeFile() {
  const url = `/v1/resume/file`
  console.log(`[deleteResumeFile] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<any>>(`${url}`, {
    method: 'DELETE'
  })
  console.log(`[deleteResumeFile] 响应数据:`, response)
  
  return response
}

/**
 * 检查用户是否已有简历
 * @returns 检查结果
 */
export async function checkUserResume() {
  const url = `/v1/resume/check`
  console.log(`[checkUserResume] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<{hasResume: boolean}>>(`${url}`)
  console.log(`[checkUserResume] 响应数据:`, response)
  
  return response
} 