# 双师课堂章节功能说明

## 功能概述

双师课堂章节功能提供了完整的课程章节管理能力，包括章节的创建、编辑、发布、资源管理以及学习进度跟踪等。

## 主要功能

### 1. 章节管理
- **创建章节**: 教师可以为课程创建新的章节
- **编辑章节**: 修改章节标题、描述等信息
- **删除章节**: 删除不需要的章节
- **发布/取消发布**: 控制章节对学生是否可见
- **章节排序**: 调整章节的学习顺序

### 2. 章节资源管理
- **添加资源**: 为章节关联课程资源
- **移除资源**: 从章节中移除资源
- **资源预览**: 查看章节关联的所有资源
- **资源下载**: 学生可以下载章节资源

### 3. 学习进度跟踪 ⭐ 新增功能
- **进度记录**: 记录学生在章节中的学习进度
- **进度更新**: 学生可以更新自己的学习状态
- **进度统计**: 查看课程整体学习进度
- **学习时间统计**: 记录学习开始和完成时间
- **进度数据导出**: 支持导出Excel和CSV格式的进度数据

#### 3.1 学生端学习进度功能
- **个人进度查看**: 查看自己在课程中的整体学习进度
- **章节进度更新**: 标记章节的学习状态（未开始/学习中/已完成）
- **学习统计**: 显示完成章节数、总学习时长、平均进度等
- **进度可视化**: 通过进度条直观显示学习进度

#### 3.2 教师端学习进度管理
- **课程进度统计**: 查看整个课程的学习进度统计
  - 总学生数、平均进度、完成率
  - 各章节进度分布
  - 学生详细进度列表
- **章节进度统计**: 查看特定章节的学习进度统计
  - 参与学生数、平均进度、完成率
  - 平均学习时间
  - 学生详细进度列表
- **进度数据导出**: 支持导出Excel和CSV格式的学习进度数据

### 4. 章节导航
- **章节列表**: 显示课程的所有章节
- **章节跳转**: 在不同章节间快速切换
- **进度显示**: 显示每个章节的学习进度

## 页面结构

### 1. 课程章节列表页面 (`CourseChapters.vue`)
- 显示课程的所有章节
- 教师可以添加、编辑、删除章节
- 学生可以查看已发布的章节和学习进度

### 2. 章节详情页面 (`CourseChapterView.vue`)
- 显示章节的详细内容
- 展示章节关联的资源
- 学生可以更新学习进度
- 教师可以查看章节进度统计

### 3. 章节编辑页面 (`ChapterEditView.vue`)
- 编辑章节的基本信息
- 管理章节资源
- 控制章节发布状态

### 4. 章节资源管理组件 (`ChapterResourceManager.vue`)
- 为章节添加/移除资源
- 显示章节关联的资源列表
- 提供资源下载功能

### 5. 学习进度管理组件 (`LearningProgressManager.vue`) ⭐ 新增
- 教师查看课程和章节的学习进度统计
- 显示学生详细进度列表
- 提供进度数据导出功能

### 6. 学生进度查看组件 (`StudentProgressView.vue`) ⭐ 新增
- 学生查看个人学习进度
- 显示课程整体进度统计
- 章节详细进度列表
- 学习统计信息

### 7. 学习进度导出组件 (`LearningProgressExport.vue`) ⭐ 新增
- 支持导出Excel和CSV格式
- 可选择导出范围（整个课程/当前章节）
- 数据预览功能

## API接口

### 章节相关接口
- `GET /v1/course-chapter/course/{courseId}` - 获取课程章节列表
- `GET /v1/course-chapter/{id}` - 获取章节详情
- `POST /v1/course-chapter` - 创建章节
- `PUT /v1/course-chapter/{id}` - 更新章节
- `DELETE /v1/course-chapter/{id}` - 删除章节
- `PUT /v1/course-chapter/{id}/publish` - 发布章节
- `PUT /v1/course-chapter/{id}/unpublish` - 取消发布章节
- `PUT /v1/course-chapter/course/{courseId}/reorder` - 重新排序章节

### 章节资源相关接口
- `GET /v1/course-chapter/{id}/resources` - 获取章节资源
- `POST /v1/course-chapter/{id}/resources/add` - 添加章节资源
- `POST /v1/course-chapter/{id}/resources/remove` - 移除章节资源

### 学习进度相关接口 ⭐ 新增
- `POST /v1/learning-progress` - 更新学习进度
- `GET /v1/learning-progress/{id}` - 获取学习进度详情
- `GET /v1/learning-progress/chapter/{chapterId}/student/{studentId}` - 获取学生在章节的进度
- `GET /v1/learning-progress/course/{courseId}/student/{studentId}` - 获取学生在课程的进度
- `GET /v1/learning-progress/course/{courseId}/statistics` - 获取课程学习进度统计
- `GET /v1/learning-progress/chapter/{chapterId}/statistics` - 获取章节学习进度统计

## 使用流程

### 教师操作流程
1. 进入课程详情页面
2. 在章节列表中添加新章节
3. 编辑章节内容和描述
4. 为章节添加相关资源
5. 发布章节供学生学习
6. 查看学生学习进度统计
7. 导出学习进度数据

### 学生操作流程
1. 查看课程章节列表
2. 点击章节进入详情页面
3. 查看章节内容和资源
4. 更新学习进度状态
5. 下载需要的资源
6. 查看个人学习进度统计

## 学习进度状态说明

### 进度状态
- **未开始 (not_started)**: 学生尚未开始学习该章节
- **学习中 (in_progress)**: 学生正在学习该章节
- **已完成 (completed)**: 学生已完成该章节的学习

### 进度百分比
- 未开始: 0%
- 学习中: 50%
- 已完成: 100%

## 权限控制

- **教师权限**: 可以创建、编辑、删除章节，管理章节资源，控制章节发布状态，查看学习进度统计，导出进度数据
- **学生权限**: 可以查看已发布的章节，更新学习进度，下载资源，查看个人进度统计
- **管理员权限**: 拥有所有教师权限

## 技术实现

### 前端技术栈
- Vue 3 + TypeScript
- Vue Router 用于路由管理
- Tailwind CSS 用于样式设计

### 组件结构
```
src/
├── components/classroom/
│   ├── CourseChapters.vue              # 章节列表组件
│   ├── ChapterResourceManager.vue      # 章节资源管理组件
│   ├── LearningProgressManager.vue     # 学习进度管理组件 ⭐ 新增
│   ├── StudentProgressView.vue         # 学生进度查看组件 ⭐ 新增
│   └── LearningProgressExport.vue      # 学习进度导出组件 ⭐ 新增
├── views/classroom/
│   ├── CourseChapterView.vue           # 章节详情页面
│   ├── ChapterEditView.vue             # 章节编辑页面
│   └── ChapterTestView.vue             # 测试页面
└── lib/api/
    └── classroom.ts                    # API接口定义
```

### 数据模型 ⭐ 新增
```typescript
interface LearningProgressDTO {
  chapterId: number
  status: 'not_started' | 'in_progress' | 'completed'
  progressPercent?: number
}

interface LearningProgressVO {
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
```

### 数据流
1. 组件通过API接口获取数据
2. 数据存储在组件的响应式状态中
3. 用户操作触发API调用
4. 根据API响应更新界面状态

## 测试

访问 `/classroom/test` 页面可以进行章节功能的测试：
- 测试章节列表加载
- 测试章节详情获取
- 验证API接口是否正常工作
- 测试学习进度功能 ⭐ 新增

## 注意事项

1. 确保后端API接口已经实现并正常工作
2. 用户身份验证和权限控制需要正确配置
3. 文件上传和下载功能需要正确的服务器配置
4. 学习进度数据需要定期备份
5. 学习进度功能需要学生登录才能使用 ⭐ 新增
6. 教师只能查看自己创建的课程的学习进度 ⭐ 新增
7. 进度数据导出功能支持Excel和CSV格式 ⭐ 新增

## 扩展功能

可以考虑添加以下功能：
- 章节评论和讨论
- 章节测验和作业
- 章节学习时间统计
- 章节完成证书
- 章节推荐算法
- 学习进度提醒功能 ⭐ 新增
- 学习进度排行榜 ⭐ 新增
- 学习进度分析报告 ⭐ 新增 