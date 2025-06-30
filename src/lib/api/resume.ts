import { apiRequest } from './apiClient'

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface ResumeData {
  id?: number;
  major: string;
  educationLevel: string;
  achievements: string;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 获取指定用户的所有简历列表
 * @param userId 用户ID
 * @returns 简历列表
 */
export async function getUserResumes(userId: number) {
  const url = `/v1/resumes/user/${userId}`
  console.log(`[getUserResumes] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<ResumeData[]>>(`${url}`)
  console.log(`[getUserResumes] 响应数据:`, response)
  
  return response
}

/**
 * 获取指定ID的简历
 * @param resumeId 简历ID
 * @returns 简历信息
 */
export async function getResumeById(resumeId: number) {
  const url = `/v1/resumes/${resumeId}`
  console.log(`[getResumeById] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<ResumeData>>(`${url}`)
  console.log(`[getResumeById] 响应数据:`, response)
  
  return response
}

/**
 * 获取当前用户的所有简历列表
 * @returns 简历列表
 */
export async function getMyResumes() {
  const url = `/v1/me/resumes`
  console.log(`[getMyResumes] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<ResumeData[]>>(`${url}`)
  console.log(`[getMyResumes] 响应数据:`, response)
  
  return response
}

/**
 * 创建简历
 * @param formData 包含简历信息和文件的FormData对象
 * @returns 创建结果
 */
export async function createMyResume(formData: FormData) {
  // 确保FormData包含所有必需的字段
  if (!formData.has('major') || !formData.has('educationLevel') || !formData.has('achievements') || !formData.has('file')) {
    console.error('[createMyResume] 缺少必填字段', {
      hasMajor: formData.has('major'),
      hasEducationLevel: formData.has('educationLevel'),
      hasAchievements: formData.has('achievements'),
      hasFile: formData.has('file')
    });
    throw new Error('请填写所有必填字段并上传简历文件');
  }

  const url = `/v1/me/resume`;
  
  // 调试输出
  console.log('[createMyResume] 请求URL:', url);
  console.log('[createMyResume] FormData内容:');
  for (const pair of formData.entries()) {
    if (pair[0] === 'file') {
      const file = pair[1] as File;
      console.log(`- ${pair[0]}: 文件名=${file.name}, 类型=${file.type}, 大小=${file.size}字节`);
    } else {
      console.log(`- ${pair[0]}: ${pair[1]}`);
    }
  }
  
  try {
    // 不要在headers中设置Content-Type，让浏览器自动设置带boundary的multipart/form-data
    const response = await apiRequest<ApiResponse<ResumeData>>(`${url}`, {
      method: 'POST',
      body: formData,
      headers: undefined // 完全移除headers，让浏览器处理
    });
    console.log(`[createMyResume] 响应数据:`, response);
    return response;
  } catch (error) {
    console.error('[createMyResume] 请求失败:', error);
    throw error;
  }
}

/**
 * 更新简历
 * @param resumeId 简历ID
 * @param formData 包含简历信息和文件的FormData对象
 * @returns 更新结果
 */
export async function updateMyResume(resumeId: number | undefined, formData: FormData) {
  // 确保resumeId是有效的数字
  if (resumeId === undefined) {
    throw new Error('简历ID不能为空');
  }
  
  // 确保FormData包含所有必需的字段
  if (!formData.has('major') || !formData.has('educationLevel') || !formData.has('achievements') || !formData.has('file')) {
    console.error('[updateMyResume] 缺少必填字段', {
      hasMajor: formData.has('major'),
      hasEducationLevel: formData.has('educationLevel'),
      hasAchievements: formData.has('achievements'),
      hasFile: formData.has('file')
    });
    throw new Error('请填写所有必填字段并上传简历文件');
  }

  const url = `/v1/me/resume/${resumeId}`;
  
  // 调试输出
  console.log('[updateMyResume] 请求URL:', url);
  console.log('[updateMyResume] 简历ID:', resumeId);
  console.log('[updateMyResume] FormData内容:');
  for (const pair of formData.entries()) {
    if (pair[0] === 'file') {
      const file = pair[1] as File;
      console.log(`- ${pair[0]}: 文件名=${file.name}, 类型=${file.type}, 大小=${file.size}字节`);
    } else {
      console.log(`- ${pair[0]}: ${pair[1]}`);
    }
  }
  
  try {
    const response = await apiRequest<ApiResponse<ResumeData>>(`${url}`, {
      method: 'PUT',
      body: formData,
      headers: undefined // 完全移除headers，让浏览器处理Content-Type和boundary
    });
    console.log(`[updateMyResume] 响应数据:`, response);
    return response;
  } catch (error) {
    console.error('[updateMyResume] 请求失败:', error);
    throw error;
  }
}

/**
 * 删除简历
 * @param resumeId 简历ID
 * @returns 删除结果
 */
export async function deleteMyResume(resumeId: number) {
  const url = `/v1/me/resume/${resumeId}`
  console.log(`[deleteMyResume] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<void>>(`${url}`, {
    method: 'DELETE'
  })
  console.log(`[deleteMyResume] 响应数据:`, response)
  
  return response
} 