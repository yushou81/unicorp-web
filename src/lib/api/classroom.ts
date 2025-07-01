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
export async function getEnrollableCourses(page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(`/v1/dual-courses/enrollable?page=${page}&size=${size}`)
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
    body: formData
  })
}

// 获取课程资源详情
export async function getResourceById(resourceId: number) {
  return apiRequest<ApiResponse<CourseResourceVO>>(`/v1/course-resources/${resourceId}`)
}

// 删除课程资源
export async function deleteResource(resourceId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/course-resources/${resourceId}`, {
    method: 'DELETE'
  })
}

// 获取课程资源列表
export async function getResourcesByCourseId(courseId: number, page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<CourseResourceVO>>>(`/v1/course-resources/course/${courseId}?page=${page}&size=${size}`)
}

// 下载课程资源
export function getResourceDownloadUrl(resourceId: number) {
  return `/v1/course-resources/download/${resourceId}`
} 