import { apiRequest } from './apiClient';

// 上传章节视频
export function uploadChapterVideo(data: FormData) {
  return apiRequest('/v1/chapter-videos', {
    method: 'POST',
    body: data
  });
}

// 获取视频详情
export function getChapterVideoById(videoId: number) {
  return apiRequest(`/v1/chapter-videos/${videoId}`);
}

// 更新视频信息
export function updateChapterVideo(videoId: number, data: any) {
  return apiRequest(`/v1/chapter-videos/${videoId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 删除视频
export function deleteChapterVideo(videoId: number) {
  return apiRequest(`/v1/chapter-videos/${videoId}`, {
    method: 'DELETE'
  });
}

// 获取指定章节的视频
export function getChapterVideoByChapterId(chapterId: number) {
  return apiRequest(`/v1/chapter-videos/chapter/${chapterId}`);
}

// 标记视频为已完成
export function markVideoCompleted(videoId: number) {
  return apiRequest(`/v1/chapter-videos/${videoId}/complete`, {
    method: 'POST'
  });
} 