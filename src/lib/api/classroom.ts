import { apiRequest } from './apiClient'

// 定义API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 定义分页响应类型
export interface PagedResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 课程状态枚举
export enum CourseStatus {
  PLANNING = 'planning',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 课程类型枚举
export enum CourseType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid'
}

// 课程创建/更新DTO
export interface DualTeacherCourseDTO {
  title: string
  description: string
  teacherId?: number
  mentorId?: number
  scheduledTime: string
  maxStudents?: number
  location?: string
  courseType: CourseType
}

// 课程详情VO
export interface DualTeacherCourseVO {
  id: number
  title: string
  description: string
  teacherId: number
  teacherName: string
  mentorId: number
  mentorName: string
  enterpriseName: string
  scheduledTime: string
  maxStudents: number
  enrolledCount: number
  location: string
  courseType: CourseType
  status: CourseStatus
  createdAt: string
}

// 课程报名DTO
export interface CourseEnrollmentDTO {
  courseId: number
}

// 课程评价DTO
export interface CourseRatingDTO {
  courseId: number
  rating: number
  content: string
}

// 课程评价VO
export interface CourseRatingVO {
  id: number
  courseId: number
  courseTitle: string
  studentId: number
  studentName: string
  rating: number
  content: string
  createdAt: string
  updatedAt: string
}

// 课程资源DTO
export interface CourseResourceDTO {
  courseId: number
  title: string
  description?: string
  resourceType: 'document' | 'video' | 'code' | 'other'
}

// 课程资源VO
export interface CourseResourceVO {
  id: number
  courseId: number
  courseTitle: string
  title: string
  description: string
  resourceType: string
  fileUrl: string
  fileSize: number
  fileType: string
  uploaderId: number
  uploaderName: string
  uploaderRole: string
  createdAt: string
}

// 课程章节DTO
export interface CourseChapterDTO {
  courseId: number
  title: string
  description?: string
  sequence?: number
}

// 课程章节VO
export interface CourseChapterVO {
  id: number
  courseId: number
  courseTitle: string
  title: string
  description: string
  sequence: number
  isPublished: boolean
  resourceCount: number
  createdAt: string
  updatedAt: string
}

// 学习进度DTO
export interface LearningProgressDTO {
  chapterId: number
  status: 'not_started' | 'in_progress' | 'completed'
  progressPercent?: number
}

// 学习进度VO
export interface LearningProgressVO {
  id: number
  studentId: number
  studentName: string
  chapterId: number
  chapterTitle: string
  courseId: number
  courseTitle: string
  status: 'not_started' | 'in_progress' | 'completed'
  progressPercent: number
  startTime: string
  completeTime?: string
  durationMinutes?: number
}

// 创建双师课堂课程
export async function createCourse(courseData: DualTeacherCourseDTO) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>('/v1/dual-courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  })
}

// 获取课程详情
export async function getCourseById(id: number) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>(`/v1/dual-courses/${id}`)
}

// 更新课程信息
export async function updateCourse(id: number, courseData: DualTeacherCourseDTO) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>(`/v1/dual-courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData)
  })
}

// 删除课程
export async function deleteCourse(id: number) {
  return apiRequest<ApiResponse<null>>(`/v1/dual-courses/${id}`, {
    method: 'DELETE'
  })
}

// 更新课程状态
export async function updateCourseStatus(id: number, status: CourseStatus) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>(`/v1/dual-courses/${id}/status?status=${status}`, {
    method: 'PATCH'
  })
}

// 获取教师创建的课程列表
export async function getTeacherCourses(page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(`/v1/dual-courses/teacher?page=${page}&size=${size}`)
}

// 获取企业导师参与的课程列表
export async function getMentorCourses(page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(`/v1/dual-courses/mentor?page=${page}&size=${size}`)
}

// 获取可报名的课程列表
export async function getEnrollableCourses(page = 1, size = 10, keyword?: string, courseType?: string) {
  let url = `/v1/dual-courses/enrollable?page=${page}&size=${size}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  if (courseType) url += `&courseType=${courseType}`;
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(url);
}

// 学生报名课程
export async function enrollCourse(courseId: number) {
  const enrollmentData: CourseEnrollmentDTO = { courseId }
  return apiRequest<ApiResponse<null>>('/v1/dual-courses/enroll', {
    method: 'POST',
    body: JSON.stringify(enrollmentData)
  })
}

// 学生取消报名
export async function cancelEnrollment(courseId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/dual-courses/enroll/${courseId}`, {
    method: 'DELETE'
  })
}

// 获取学生已报名的课程列表
export async function getStudentEnrolledCourses(page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(`/v1/dual-courses/enrolled?page=${page}&size=${size}`)
}

// 更新学生选课状态
export async function updateEnrollmentStatus(enrollmentId: number, status: 'enrolled' | 'cancelled' | 'completed') {
  return apiRequest<ApiResponse<null>>(`/v1/dual-courses/enrollment/${enrollmentId}/status?status=${status}`, {
    method: 'PATCH'
  })
}

// 获取课程的学生列表
export async function getCourseStudents(courseId: number) {
  return apiRequest<ApiResponse<Array<{
    id: number
    name: string
    email?: string
    studentId?: string
    enrollTime: string
    status: string
  }>>>(`/v1/dual-courses/${courseId}/students`)
}

// 提交课程评价
export async function submitRating(ratingData: CourseRatingDTO) {
  return apiRequest<ApiResponse<CourseRatingVO>>('/v1/course-ratings', {
    method: 'POST',
    body: JSON.stringify(ratingData)
  })
}

// 获取课程评价详情
export async function getRatingById(ratingId: number) {
  return apiRequest<ApiResponse<CourseRatingVO>>(`/v1/course-ratings/${ratingId}`)
}

// 更新课程评价
export async function updateRating(ratingId: number, ratingData: CourseRatingDTO) {
  return apiRequest<ApiResponse<CourseRatingVO>>(`/v1/course-ratings/${ratingId}`, {
    method: 'PUT',
    body: JSON.stringify(ratingData)
  })
}

// 删除课程评价
export async function deleteRating(ratingId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/course-ratings/${ratingId}`, {
    method: 'DELETE'
  })
}

// 获取课程评价列表
export async function getRatingsByCourseId(courseId: number, page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<CourseRatingVO>>>(`/v1/course-ratings/course/${courseId}?page=${page}&size=${size}`)
}

// 获取课程平均评分
export async function getAverageRating(courseId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/course-ratings/average/${courseId}`)
}

// 检查学生是否已评价课程
export async function hasRated(courseId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-ratings/check/${courseId}`)
}

// 上传课程资源
export async function uploadResource(formData: FormData) {
  return apiRequest<ApiResponse<CourseResourceVO>>('/v1/course-resources', {
    method: 'POST',
    body: formData,
    headers: {
      // 不设置Content-Type，让浏览器自动设置multipart/form-data和boundary
    }
  })
}

// 获取资源详情
export async function getResourceById(resourceId: number) {
  return apiRequest<ApiResponse<CourseResourceVO>>(`/v1/course-resources/${resourceId}`)
}

// 删除资源
export async function deleteResource(resourceId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/course-resources/${resourceId}`, {
    method: 'DELETE'
  })
}

// 获取课程资源列表
export async function getResourcesByCourseId(courseId: number, page = 1, size = 10, resourceType?: string) {
  let url = `/v1/course-resources/course/${courseId}?page=${page}&size=${size}`;
  if (resourceType) url += `&resourceType=${resourceType}`;
  return apiRequest<ApiResponse<PagedResponse<CourseResourceVO>>>(url);
}

// 获取资源下载URL
export function getResourceDownloadUrl(resourceId: number) {
  return `/v1/course-resources/download/${resourceId}`;
}

// 创建课程章节
export async function createChapter(chapterData: CourseChapterDTO) {
  return apiRequest<ApiResponse<CourseChapterVO>>('/v1/course-chapters', {
    method: 'POST',
    body: JSON.stringify(chapterData)
  });
}

// 更新课程章节
export async function updateChapter(id: number, chapterData: CourseChapterDTO) {
  return apiRequest<ApiResponse<CourseChapterVO>>(`/v1/course-chapters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(chapterData)
  });
}

// 获取章节详情
export async function getChapterById(id: number) {
  return apiRequest<ApiResponse<CourseChapterVO>>(`/v1/course-chapters/${id}`);
}

// 删除章节
export async function deleteChapter(id: number) {
  return apiRequest<ApiResponse<null>>(`/v1/course-chapters/${id}`, {
    method: 'DELETE'
  });
}

// 获取课程章节列表
export async function getChaptersByCourseId(courseId: number) {
  return apiRequest<ApiResponse<CourseChapterVO[]>>(`/v1/course-chapters/course/${courseId}`);
}

// 更新章节发布状态
export async function updateChapterPublishStatus(id: number, isPublished: boolean) {
  return apiRequest<ApiResponse<null>>(`/v1/course-chapters/${id}/publish?isPublished=${isPublished}`, {
    method: 'PUT'
  });
}

// 更新章节顺序
export async function updateChapterSequence(id: number, sequence: number) {
  return apiRequest<ApiResponse<null>>(`/v1/course-chapters/${id}/sequence?sequence=${sequence}`, {
    method: 'PUT'
  });
}

// 关联资源到章节
export async function associateResourceToChapter(chapterId: number, resourceId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/course-chapters/${chapterId}/resources/${resourceId}`, {
    method: 'POST'
  });
}

// 从章节移除资源
export async function removeResourceFromChapter(chapterId: number, resourceId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/course-chapters/${chapterId}/resources/${resourceId}`, {
    method: 'DELETE'
  });
}

// 获取章节关联的资源列表
export async function getChapterResources(chapterId: number) {
  return apiRequest<ApiResponse<number[]>>(`/v1/course-chapters/${chapterId}/resources`);
}

// 更新学习进度
export async function updateLearningProgress(progressData: LearningProgressDTO) {
  return apiRequest<ApiResponse<null>>('/v1/learning-progress', {
    method: 'PUT',
    body: JSON.stringify(progressData)
  });
}

// 获取学生在章节中的学习进度
export async function getStudentProgressInChapter(chapterId: number, studentId: number) {
  return apiRequest<ApiResponse<LearningProgressVO>>(`/v1/learning-progress/chapter/${chapterId}/student/${studentId}`);
}

// 获取学生在课程中的学习进度
export async function getStudentProgressInCourse(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<LearningProgressVO[]>>(`/v1/learning-progress/course/${courseId}/student/${studentId}`);
}

// 获取课程进度概览
export async function getCourseProgressOverview(courseId: number) {
  return apiRequest<ApiResponse<{
    totalStudents: number,
    completedStudents: number,
    averageProgress: number,
    chapterProgressStats: {
      chapterId: number,
      chapterTitle: string,
      completedCount: number,
      inProgressCount: number,
      notStartedCount: number
    }[]
  }>>(`/v1/learning-progress/course/${courseId}/overview`);
}

// 获取学生课程完成率
export async function getCourseCompletionRate(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/learning-progress/course/${courseId}/student/${studentId}/completion-rate`);
}

// 初始化章节学习进度
export async function initializeChapterProgress(chapterId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/learning-progress/chapter/${chapterId}/initialize`, {
    method: 'POST'
  });
}

// 获取课程过滤后的列表
export async function getCoursesList(params: {
  page?: number,
  size?: number,
  keyword?: string,
  status?: string,
  courseType?: string
}) {
  const { page = 1, size = 10, keyword, status, courseType } = params;
  let url = `/v1/dual-courses?page=${page}&size=${size}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  if (status) url += `&status=${status}`;
  if (courseType) url += `&courseType=${courseType}`;
  
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(url);
} 