// src/lib/api/file.ts
import { apiRequest } from './apiClient'

export interface UploadFileResponse {
  code: number
  data: {
    file_url: string
    // 其他字段按需补充
  }
  // 其他字段按需补充
}

export function uploadFile(formData: FormData): Promise<UploadFileResponse> {
  return apiRequest('/files/upload', {
    method: 'POST',
    body: formData
    // 不要手动设置 Content-Type，浏览器会自动处理
  })
}

/**
 * 下载文件（返回 blob）
 * @param filename 文件名（如 4089990d_20250702113838.pdf）
 */
export function downloadFile(filename: string): Promise<Blob> {
  console.log('调用了 downloadFile 方法，参数为:', filename)
  // 注意：这里拼接完整的后端接口路径
  return fetch(`/api/files/resources/${filename}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token') // 如有 token 校验
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('下载失败')
      return res.blob()
    })
    .catch(error => {
      console.error('下载文件失败:', error)
      throw error
    })
    .finally(() => {
      console.log('下载文件完成')
    })
}