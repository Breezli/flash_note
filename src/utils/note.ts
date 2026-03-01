import { mockApi } from '@/api/mock'
import { Note, ArticleStructure } from '@/types'


const USE_MOCK_BACKEND = true

export const notesApi = {
	async getNotes(): Promise<Note[]> {
		if (USE_MOCK_BACKEND) {
			const res = await mockApi.getNotes()
			return res.data
		}
		const res = await fetch('/api/notes')
		return res.json()
	},

	// 修改：直接传入 content，让 mockApi 调用 AI
	async createNote(content: string): Promise<Note> {
		if (USE_MOCK_BACKEND) {
			// mockApi 内部会调用 AI 并创建完整 Note
			const res = await mockApi.createNote(content)
			return res.data
		}

		// 真实后端
		const res = await fetch('/api/notes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content }),
		})
		return res.json()
	},

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

	async deleteNote(id: string): Promise<void> {
		if (USE_MOCK_BACKEND) {
			await mockApi.deleteNote(id)
			return
		}
		await fetch(`/api/notes/${id}`, { method: 'DELETE' })
	},

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

	async searchNotes(query: string): Promise<Note[]> {
		if (USE_MOCK_BACKEND) {
			const res = await mockApi.searchNotes(query)
			return res.data
		}
		const res = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}`)
		return res.json()
	},

	async getTags(): Promise<string[]> {
		if (USE_MOCK_BACKEND) {
			const res = await mockApi.getTags()
			return res.data
		}
		const res = await fetch('/api/tags')
		return res.json()
	},
}
