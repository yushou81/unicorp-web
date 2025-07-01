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