import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
} from 'react-native'
import { Note } from '../types/note'
import { MOCK_NOTES, saveNoteApi, mockAiProcess } from '../api/mock'
import { InputBar } from '../components/InputBar'
import { processNoteWithAI } from '../api/ai'

export const TimelineScreen = () => {
	const [notes, setNotes] = useState<Note[]>(MOCK_NOTES)

	const handleAddNote = async (content: string) => {
		// Step 1: 先在界面上显示原始笔记（状态为 processing）
		const newNote = await saveNoteApi(content)
		setNotes([newNote, ...notes])

		// 模拟 AI 处理
		// mockAiProcess(newNote.id, (updatedNote) => {
		// 	setNotes((prev) =>
		// 		prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
		// 	)
		// })

		// 调用真正的 AI 接口
		const aiResult = await processNoteWithAI(content)

		if (aiResult) {
			// 如果 AI 返回成功，更新这条笔记
			const updatedNote: Note = {
				...newNote,
				summary: aiResult.summary,
				keywords: aiResult.keywords,
				category: aiResult.category,
				status: 'completed', // 完成状态
			}

			setNotes((prev) =>
				prev.map((n) => (n.id === newNote.id ? updatedNote : n)),
			)
		} else {
			// 如果 AI 失败了，可以把状态改回完成，但提示处理失败（可选）
			console.log('AI 接口调用没拿到结果')
		}
	}

	const renderItem = ({ item }: { item: Note }) => (
		<View style={styles.card}>
			{item.status === 'processing' ? (
				<View style={styles.loadingRow}>
					<ActivityIndicator size='small' color='#6366f1' />
					<Text style={styles.loadingText}>AI 正在深度思考...</Text>
				</View>
			) : (
				<>
					<Text style={styles.summary}>{item.summary}</Text>
					<View style={styles.tagContainer}>
						{item.keywords?.map((tag) => (
							<Text key={tag} style={styles.tag}>
								#{tag}
							</Text>
						))}
					</View>
				</>
			)}
			<Text style={styles.originalContent}>{item.content}</Text>
			<Text style={styles.time}>
				{new Date(item.createdAt).toLocaleTimeString()}
			</Text>
		</View>
	)

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>闪念 AI</Text>
			</View>
			<FlatList
				data={notes}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				contentContainerStyle={{ padding: 15 }}
			/>
			<InputBar onSend={handleAddNote} />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc' },
	header: { padding: 20, backgroundColor: '#fff' },
	headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
	card: {
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 16,
		marginBottom: 12,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
	},
	loadingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
	loadingText: { marginLeft: 10, color: '#94a3b8' },
	summary: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1e293b',
		marginBottom: 8,
	},
	tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
	tag: {
		color: '#6366f1',
		backgroundColor: '#eef2ff',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		fontSize: 12,
		marginRight: 8,
	},
	originalContent: { color: '#64748b', fontSize: 14, fontStyle: 'italic' },
	time: { fontSize: 10, color: '#cbd5e1', marginTop: 10 },
})
