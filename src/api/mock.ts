import { Note, ArticleStructure, ApiResponse } from '@/types'
import { processNoteWithAI } from './ai'

// 模拟数据库
let mockNotes: Note[] = []
let mockIdCounter = 1

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
	async getNotes(): Promise<ApiResponse<Note[]>> {
		await delay(300)
		return { success: true, data: [...mockNotes] }
	},

	// 修改：只接收 content，内部调用 AI
	async createNote(content: string): Promise<ApiResponse<Note>> {
		await delay(500)

		// 调用 AI 处理，返回完整 Partial<Note>
		const aiResult = await processNoteWithAI(content)

		const newNote: Note = {
			id: `note-${Date.now()}-${mockIdCounter++}`,
			title: aiResult.title || '未命名笔记',
			summary: aiResult.summary || '', // 用户输入的精简版
			content: aiResult.content || '', // AI 扩写的完整文章（关键！）
			structure: aiResult.structure || [],
			tags: aiResult.tags || [],
			category: aiResult.category || '其他',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}

		mockNotes.unshift(newNote)
		console.log('Created note:', {
			title: newNote.title,
			summary: newNote.summary?.slice(0, 50),
			content: newNote.content?.slice(0, 100), // 调试用
		})
		return { success: true, data: newNote }
	},

	async updateNote(
		id: string,
		updates: Partial<Note>,
	): Promise<ApiResponse<Note>> {
		await delay(300)
		const index = mockNotes.findIndex((n) => n.id === id)
		if (index === -1) throw new Error('笔记不存在')

		mockNotes[index] = {
			...mockNotes[index],
			...updates,
			updatedAt: Date.now(),
		}
		return { success: true, data: mockNotes[index] }
	},

	async deleteNote(id: string): Promise<ApiResponse<boolean>> {
		await delay(300)
		mockNotes = mockNotes.filter((n) => n.id !== id)
		return { success: true, data: true }
	},

	async updateStructure(
		id: string,
		structure: ArticleStructure[],
	): Promise<ApiResponse<boolean>> {
		await delay(300)
		const index = mockNotes.findIndex((n) => n.id === id)
		if (index !== -1) {
			mockNotes[index].structure = structure
			// 同时更新 content
			mockNotes[index].content = structure
				.map((item) => `## ${item.title}\n\n${item.content || ''}`)
				.join('\n\n---\n\n')
			mockNotes[index].updatedAt = Date.now()
		}
		return { success: true, data: true }
	},

	async getTags(): Promise<ApiResponse<string[]>> {
		await delay(200)
		const tags = new Set<string>()
		mockNotes.forEach((note) => note.tags.forEach((tag) => tags.add(tag)))
		return { success: true, data: Array.from(tags) }
	},

	async searchNotes(query: string): Promise<ApiResponse<Note[]>> {
		await delay(400)
		const lowerQuery = query.toLowerCase()
		const results = mockNotes.filter(
			(note) =>
				note.title.toLowerCase().includes(lowerQuery) ||
				note.summary.toLowerCase().includes(lowerQuery) ||
				note.content.toLowerCase().includes(lowerQuery) ||
				note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
		)
		return { success: true, data: results }
	},

	async clearAll(): Promise<void> {
		mockNotes = []
	},
}
