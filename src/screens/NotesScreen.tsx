import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from 'react-native'
import { SafeAreaContainer } from '@/components/SafeAreaContainer'
import { Colors } from '@/constants/Colors'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteDetailModal } from '@/components/notes/NoteDetailModal'
import { useNotes } from '@/context/NotesContext'
import { useState, useMemo } from 'react'
import { Note } from '@/types'
import { Ionicons } from '@expo/vector-icons'

export default function NotesScreen() {
	const { state, updateNote, deleteNote } = useNotes()
	const [selectedNote, setSelectedNote] = useState<Note | null>(null)
	const [modalVisible, setModalVisible] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTag, setSelectedTag] = useState<string | null>(null)

	const allTags = useMemo(() => {
		const tags = new Set<string>()
		state.notes.forEach((note) => note.tags.forEach((tag) => tags.add(tag)))
		return Array.from(tags)
	}, [state.notes])

	const filteredNotes = useMemo(() => {
		return state.notes.filter((note) => {
			const matchesSearch =
				!searchQuery ||
				note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				note.summary.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesTag = !selectedTag || note.tags.includes(selectedTag)
			return matchesSearch && matchesTag
		})
	}, [state.notes, searchQuery, selectedTag])

	const handleNotePress = (note: Note) => {
		setSelectedNote(note)
		setModalVisible(true)
	}

	const handleSave = (id: string, updates: Partial<Note>) => {
		updateNote(id, updates)
	}

	const handleDelete = (id: string) => {
		deleteNote(id)
		if (selectedNote?.id === id) {
			setModalVisible(false)
			setSelectedNote(null)
		}
	}

	return (
		<SafeAreaContainer style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>我的笔记</Text>
				<Text style={styles.subtitle}>{state.notes.length} 个笔记</Text>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchInputContainer}>
					<Ionicons name='search' size={20} color={Colors.textTertiary} />
					<TextInput
						style={styles.searchInput}
						placeholder='搜索笔记...'
						placeholderTextColor={Colors.textTertiary}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery.length > 0 && (
						<Ionicons
							name='close-circle'
							size={20}
							color={Colors.textTertiary}
							onPress={() => setSearchQuery('')}
						/>
					)}
				</View>
			</View>

			{allTags.length > 0 && (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.tagsContainer}
					contentContainerStyle={styles.tagsContent}>
					<TouchableOpacity
						style={[styles.tag, !selectedTag && styles.tagActive]}
						onPress={() => setSelectedTag(null)}>
						<Text
							style={[styles.tagText, !selectedTag && styles.tagTextActive]}>
							全部
						</Text>
					</TouchableOpacity>
					{allTags.map((tag) => (
						<TouchableOpacity
							key={tag}
							style={[styles.tag, selectedTag === tag && styles.tagActive]}
							onPress={() => setSelectedTag(tag === selectedTag ? null : tag)}>
							<Text
								style={[
									styles.tagText,
									selectedTag === tag && styles.tagTextActive,
								]}>
								{tag}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.contentContainer}>
				{filteredNotes.length > 0 ? (
					filteredNotes.map((note) => (
						<NoteCard
							key={note.id}
							note={note}
							onPress={handleNotePress}
							onDelete={handleDelete}
						/>
					))
				) : (
					<View style={styles.emptyState}>
						<Text style={styles.emptyIcon}>🔍</Text>
						<Text style={styles.emptyTitle}>
							{searchQuery || selectedTag ? '没有找到匹配的笔记' : '还没有笔记'}
						</Text>
						<Text style={styles.emptyText}>
							{searchQuery || selectedTag
								? '尝试其他搜索词或标签'
								: '去首页创建你的第一个笔记吧'}
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
				onSave={handleSave}
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
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: Colors.text,
	},
	subtitle: {
		fontSize: 15,
		color: Colors.textSecondary,
		marginTop: 4,
	},
	searchContainer: {
		padding: 16,
		backgroundColor: Colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	searchInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.surfaceSecondary,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: Colors.text,
		marginLeft: 10,
		padding: 0,
	},
	tagsContainer: {
		backgroundColor: Colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
		maxHeight: 60,
	},
	tagsContent: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 8,
	},
	tag: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		backgroundColor: Colors.surfaceSecondary,
		borderRadius: 20,
		marginRight: 8,
	},
	tagActive: {
		backgroundColor: Colors.primary,
	},
	tagText: {
		fontSize: 14,
		color: Colors.textSecondary,
		fontWeight: '500',
	},
	tagTextActive: {
		color: '#FFF',
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		paddingTop: 8,
		paddingBottom: 32,
	},
	emptyState: {
		alignItems: 'center',
		paddingTop: 100,
		paddingHorizontal: 40,
	},
	emptyIcon: {
		fontSize: 64,
		marginBottom: 16,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 8,
	},
	emptyText: {
		fontSize: 14,
		color: Colors.textSecondary,
		textAlign: 'center',
	},
})