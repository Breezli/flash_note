export interface Note {
	id: string
	content: string // 原始输入
	summary?: string // AI 摘要
	keywords?: string[] // AI 提取的关键词
	category?: string // AI 分类 (如：灵感、待办、学习)
	status: 'processing' | 'completed' // AI 处理状态
	createdAt: number // 时间戳
}
