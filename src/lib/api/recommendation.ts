import { apiRequest } from './apiClient';

// 获取推荐岗位列表
export function getRecommendedJobs(params = { page: 0, size: 5 }) {
  return apiRequest('/v1/recommendations/jobs', { params });
}

// 获取当前学生的个人特征
export function getUserFeature() {
  return apiRequest('/v1/recommendations/features/me');
}

// 更新当前学生的个人特征
export function updateUserFeature(data: any) {
  return apiRequest('/v1/recommendations/features/me', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 生成岗位推荐
export function generateRecommendedJobs() {
  return apiRequest('/v1/recommendations/jobs/generate', { method: 'POST' });
} 