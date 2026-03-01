import { Note, ArticleStructure } from '@/types'
import { processNoteWithAI } from './ai'
import { mockApi } from './mock'

// 切换开关：true使用Mock，false直接调用AI（无后端）
const USE_MOCK_BACKEND = true

/**
 * 笔记API统一入口
 * 当前使用Mock + 真实AI，后续可替换为真实后端
 */
export const notesApi = {
	// 获取笔记列表
	async getNotes(): Promise<Note[]> {
		if (USE_MOCK_BACKEND) {
			const res = await mockApi.getNotes()
			return res.data
		}
		// 真实后端实现
		const res = await fetch('/api/notes')
		return res.json()
	},

	// 创建笔记（自动调用AI处理）
	async createNote(content: string): Promise<Note> {
		// 第一步：AI处理内容
		const aiResult = await processNoteWithAI(content)

		if (USE_MOCK_BACKEND) {
			const res = await mockApi.createNote(content, aiResult)
			return res.data
		}

		// 真实后端：后端会自动调用AI，这里直接传content
		const res = await fetch('/api/notes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content }),
		})
		return res.json()
	},

	// 更新笔记
	async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
		if (USE_MOCK_BACKEND) {
			const res = await mockApi.updateNote(id, updates)
			return res.data
		}
		const res = await fetch(`/api/notes/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates),
		})
		return res.json()
	},

	// 删除笔记
	async deleteNote(id: string): Promise<void> {
		if (USE_MOCK_BACKEND) {
			await mockApi.deleteNote(id)
			return
		}
		await fetch(`/api/notes/${id}`, { method: 'DELETE' })
	},

	// 更新笔记结构
	async updateStructure(
		id: string,
		structure: ArticleStructure[],
	): Promise<void> {
		if (USE_MOCK_BACKEND) {
			await mockApi.updateStructure(id, structure)
			return
		}
		await fetch(`/api/notes/${id}/structure`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ structure }),
		})
	},

	// 搜索笔记
	async searchNotes(query: string): Promise<Note[]> {
		if (USE_MOCK_BACKEND) {
			const res = await mockApi.searchNotes(query)
			return res.data
		}
		const res = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}`)
		return res.json()
	},

	// 获取标签云
	async getTags(): Promise<string[]> {
		if (USE_MOCK_BACKEND) {
			const res = await mockApi.getTags()
			return res.data
		}
		const res = await fetch('/api/tags')
		return res.json()
	},
}
