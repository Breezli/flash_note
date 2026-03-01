// src/screens/HomeScreen.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaContainer } from '@/components/SafeAreaContainer'
import { Colors } from '@/constants/Colors'
import { NoteInput } from '@/components/notes/NoteInput'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteDetailModal } from '@/components/notes/NoteDetailModal'
import { useNotes } from '@/context/NotesContext'
import { Note } from '@/types'

export default function HomeScreen() {
	const { state, addNote, updateNote } = useNotes()
	const [selectedNote, setSelectedNote] = useState<Note | null>(null)
	const [modalVisible, setModalVisible] = useState(false)

	const handleSubmit = async (content: string) => {
		await addNote(content)
	}

	const handleNotePress = (note: Note) => {
		setSelectedNote(note)
		setModalVisible(true)
	}

	const recentNotes = state.notes.slice(0, 3)

	return (
		<SafeAreaContainer style={styles.container}>
			<View style={styles.header}>
				<View>
					<Text style={styles.greeting}>你好 👋</Text>
					<Text style={styles.subtitle}>记录你的想法，AI 帮你整理</Text>
				</View>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.contentContainer}>
				<View style={styles.inputSection}>
					<Text style={styles.sectionTitle}>快速记录</Text>
					<NoteInput onSubmit={handleSubmit} loading={state.loading} />
				</View>

				{recentNotes.length > 0 && (
					<View style={styles.recentSection}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>最近生成</Text>
							<Text style={styles.noteCount}>{state.notes.length} 个笔记</Text>
						</View>
						{recentNotes.map((note) => (
							<NoteCard key={note.id} note={note} onPress={handleNotePress} />
						))}
					</View>
				)}

				{state.notes.length === 0 && !state.loading && (
					<View style={styles.emptyState}>
						<Text style={styles.emptyIcon}>📝</Text>
						<Text style={styles.emptyTitle}>还没有笔记</Text>
						<Text style={styles.emptyText}>
							在上方输入你的想法，AI 会自动生成笔记卡片
						</Text>
					</View>
				)}
			</ScrollView>

			<NoteDetailModal
				note={selectedNote}
				visible={modalVisible}
				onClose={() => {
					setModalVisible(false)
					setSelectedNote(null)
				}}
				onSave={(id, updates) => updateNote(id, updates)}
			/>
		</SafeAreaContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 12,
		backgroundColor: Colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	greeting: {
		fontSize: 28,
		fontWeight: '700',
		color: Colors.text,
	},
	subtitle: {
		fontSize: 15,
		color: Colors.textSecondary,
		marginTop: 4,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 32,
	},
	inputSection: {
		padding: 20,
		backgroundColor: Colors.surface,
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 17,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 16,
	},
	recentSection: {
		paddingTop: 8,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginBottom: 8,
	},
	noteCount: {
		fontSize: 14,
		color: Colors.textTertiary,
	},
	emptyState: {
		alignItems: 'center',
		paddingTop: 60,
		paddingHorizontal: 40,
	},
	emptyIcon: {
		fontSize: 64,
		marginBottom: 16,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 8,
	},
	emptyText: {
		fontSize: 15,
		color: Colors.textSecondary,
		textAlign: 'center',
		lineHeight: 22,
	},
})
