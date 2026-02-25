import { Note } from '../types/note'

// 初始 Mock 数据
export let MOCK_NOTES: Note[] = [
	{
		id: '1',
		content: '量子纠缠可以尝试用到分布式缓存同步里。',
		summary: '探索量子纠缠在技术架构中的应用',
		keywords: ['架构', '灵感'],
		category: '技术',
		status: 'completed',
		createdAt: Date.now() - 1000000,
	},
]

// 模拟发送笔记并触发 AI 异步分析
export const saveNoteApi = async (content: string): Promise<Note> => {
	const newNote: Note = {
		id: Math.random().toString(36).substring(7),
		content,
		status: 'processing',
		createdAt: Date.now(),
	}

	MOCK_NOTES = [newNote, ...MOCK_NOTES] // 模拟插入数据库
	return newNote
}

// 模拟 AI 异步更新笔记
export const mockAiProcess = (
	id: string,
	callback: (updatedNote: Note) => void,
) => {
	setTimeout(() => {
		const note = MOCK_NOTES.find((n) => n.id === id)
		if (note) {
			note.summary = `AI 自动生成的摘要：${note.content.substring(0, 10)}...`
			note.keywords = ['AI提取', '自动标签']
			note.status = 'completed'
			callback({ ...note })
		}
	}, 3000) // 3秒后模拟 AI 处理完成
}
