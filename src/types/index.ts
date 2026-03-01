// src/types/index.ts
import { ViewStyle } from 'react-native'

// 安全容器
export interface SafeAreaContainerProps {
	children: React.ReactNode
	style?: ViewStyle | ViewStyle[]
	excludeEdges?: ('top' | 'bottom' | 'left' | 'right')[]
}

// 文章结构节点
export interface ArticleStructure {
	id: string
	title: string
	content?: string
}

// 笔记卡片类型（统一版本）
export interface Note {
	id: string
	title: string
	summary: string  // 用户输入
	content: string  // AI 扩写的完整文章
	structure: ArticleStructure[]
	createdAt: number
	updatedAt: number
	tags: string[]
	category?: string // AI返回的分类
}

// 笔记状态
export interface NotesState {
	notes: Note[]
	loading: boolean
	error: string | null
}

// Context类型（添加 refreshNotes）
export interface NotesContextType {
	state: NotesState
	addNote: (content: string) => Promise<void>
	updateNote: (id: string, updates: Partial<Note>) => void
	deleteNote: (id: string) => void
	reorderNotes: (notes: Note[]) => void
	updateStructure: (noteId: string, structure: ArticleStructure[]) => void
	refreshNotes: () => Promise<void>
}

// API响应类型
export interface AIProcessResult {
	summary: string
	keywords: string[] // 对应 tags
	category: string
	title?: string
	structure?: ArticleStructure[]
}

export interface ApiResponse<T> {
	success: boolean
	data: T
	message?: string
}
