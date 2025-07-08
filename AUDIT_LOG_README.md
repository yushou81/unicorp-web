# 失败操作日志功能说明

## 功能概述

根据提供的审计日志API文档，我已经在管理员dashboard中添加了失败操作日志查看功能，专门用于监控和查看系统中的失败操作。

## 实现的功能

### 1. API集成
- 在 `src/lib/api/admin.ts` 中添加了审计日志相关的API函数：
  - `getAuditLogs()` - 分页查询审计日志
  - `getAuditLogStatistics()` - 获取日志统计信息

### 2. 失败操作日志管理组件
- 创建了 `src/components/dashboard/AuditLogManager.vue` 组件
- 包含以下功能：
  - 统计信息展示（总日志数、今日日志、成功/失败操作数）
  - 多条件筛选（用户名、时间范围）
  - 失败操作日志列表展示（用户名、日期、时间、IP地址、结果）
  - 分页功能
  - 响应式设计

### 3. 管理员Dashboard集成
- 在 `src/views/dashboard/AdminDashboard.vue` 中：
  - 添加了"审计日志"标签页
  - 集成了 AuditLogManager 组件
  - 保持了与现有功能的一致性

## 使用方法

1. 以管理员身份登录系统
2. 进入管理员dashboard (`/dashboard/admin`)
3. 点击"审计日志"标签页
4. 可以查看统计信息和失败操作日志列表
5. 使用筛选条件进行精确查询

## 筛选功能

- **用户名**: 输入特定用户名进行筛选
- **时间范围**: 设置开始和结束时间进行时间范围筛选
- **重置**: 清除所有筛选条件

## 显示字段

- **用户名**: 执行失败操作的用户名
- **日期**: 操作发生的日期
- **时间**: 操作发生的具体时间
- **IP地址**: 用户操作的IP地址
- **结果**: 操作结果（失败）

## 技术实现

- 使用 Vue 3 Composition API
- 响应式数据管理
- 错误处理和加载状态
- 分页和筛选逻辑
- 现代化的UI设计（使用Tailwind CSS）

## API接口

### 获取失败操作日志
```
GET /v1/admin/audit/logs
参数：
- page: 页码
- size: 每页大小
- status: FAILURE（只获取失败操作）
- startTime: 开始时间（可选）
- endTime: 结束时间（可选）
```

### 获取统计信息
```
GET /v1/admin/audit/statistics
返回：
- totalLogs: 总日志数
- todayLogs: 今日日志数
- successCount: 成功操作数
- failureCount: 失败操作数
- actionCounts: 各操作类型统计
- userCounts: 用户操作统计
```

## 注意事项

1. 需要管理员权限才能访问失败操作日志功能
2. 只显示失败的操作记录，成功操作不会显示
3. 日志数据来源于后端API，确保后端服务正常运行
4. 时间筛选使用ISO 8601格式
5. 分页功能支持10、20、50条每页的显示 