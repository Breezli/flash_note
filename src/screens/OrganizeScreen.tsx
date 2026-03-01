import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaContainer } from '@/components/SafeAreaContainer'
import { Colors } from '@/constants/Colors'
import { DraggableCardList } from '@/components/notes/DraggableCard'
import { NoteDetailModal } from '@/components/notes/NoteDetailModal'
import { useNotes } from '@/context/NotesContext'
import { useState } from 'react'
import { Note } from '@/types'
import { Ionicons } from '@expo/vector-icons'

export default function OrganizeScreen() {
	const { state, reorderNotes, deleteNote, updateNote } = useNotes()
	const [selectedNote, setSelectedNote] = useState<Note | null>(null)
	const [modalVisible, setModalVisible] = useState(false)

	const handleReorder = (notes: Note[]) => {
		reorderNotes(notes)
	}

	const handleNotePress = (note: Note) => {
		setSelectedNote(note)
		setModalVisible(true)
	}

	const handleSave = (id: string, updates: Partial<Note>) => {
		updateNote(id, updates)
	}

	return (
		<SafeAreaContainer style={styles.container}>
			<View style={styles.header}>
				<View>
					<Text style={styles.title}>整理笔记</Text>
					<Text style={styles.subtitle}>长按拖拽调整卡片顺序</Text>
				</View>
			</View>

			<View style={styles.tipContainer}>
				<Ionicons name='information-circle' size={18} color={Colors.primary} />
				<Text style={styles.tipText}>
					长按卡片并拖动可重新排序，点击卡片可编辑内容
				</Text>
			</View>

			<View style={styles.listContainer}>
				<DraggableCardList
					notes={state.notes}
					onReorder={handleReorder}
					onDelete={deleteNote}
					onPress={handleNotePress}
				/>
			</View>

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
	tipContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.primary + '10',
		padding: 14,
		margin: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.primary + '20',
	},
	tipText: {
		flex: 1,
		fontSize: 14,
		color: Colors.primary,
		marginLeft: 10,
		lineHeight: 20,
	},
	listContainer: {
		flex: 1,
	},
})
