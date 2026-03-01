import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { ArticleStructure } from '@/types'

interface StructureEditorProps {
	structure: ArticleStructure[]
	onChange: (structure: ArticleStructure[]) => void
}

export const StructureEditor: React.FC<StructureEditorProps> = ({
	structure,
	onChange,
}) => {
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editTitle, setEditTitle] = useState('')
	const [editContent, setEditContent] = useState('')
	const [expandedId, setExpandedId] = useState<string | null>(null)

	const handleEditStart = (item: ArticleStructure) => {
		setEditingId(item.id)
		setEditTitle(item.title)
		setEditContent(item.content || '')
	}

	const handleEditEnd = () => {
		if (editingId && editTitle.trim()) {
			const newStructure = structure.map((item) =>
				item.id === editingId
					? { ...item, title: editTitle.trim(), content: editContent.trim() }
					: item,
			)
			onChange(newStructure)
		}
		setEditingId(null)
		setEditTitle('')
		setEditContent('')
	}

	const handleDelete = (id: string) => {
		const newStructure = structure.filter((item) => item.id !== id)
		onChange(newStructure)
	}

	const handleAdd = () => {
		const newItem: ArticleStructure = {
			id: `s-${Date.now()}`,
			title: '新章节',
			content: '点击编辑添加详细内容...',
		}
		onChange([...structure, newItem])
	}

	const handleMove = (index: number, direction: 'up' | 'down') => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === structure.length - 1)
		) {
			return
		}
		const newIndex = direction === 'up' ? index - 1 : index + 1
		const newStructure = [...structure]
		;[newStructure[index], newStructure[newIndex]] = [
			newStructure[newIndex],
			newStructure[index],
		]
		onChange(newStructure)
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>文章结构</Text>
			{structure.map((item, index) => (
				<View key={item.id} style={styles.item}>
					<View style={styles.itemHeader}>
						<View style={styles.numberBadge}>
							<Text style={styles.numberText}>{index + 1}</Text>
						</View>

						{editingId === item.id ? (
							<View style={styles.editContainer}>
								<TextInput
									style={styles.editTitleInput}
									value={editTitle}
									onChangeText={setEditTitle}
									placeholder='章节标题'
									autoFocus
								/>
								<TextInput
									style={styles.editContentInput}
									value={editContent}
									onChangeText={setEditContent}
									placeholder='章节详细内容...'
									multiline
									textAlignVertical='top'
								/>
								<TouchableOpacity
									style={styles.doneBtn}
									onPress={handleEditEnd}>
									<Text style={styles.doneBtnText}>完成</Text>
								</TouchableOpacity>
							</View>
						) : (
							<TouchableOpacity
								style={styles.titleContainer}
								onPress={() => handleEditStart(item)}>
								<Text style={styles.itemTitle}>{item.title}</Text>
								<Text style={styles.itemPreview} numberOfLines={2}>
									{item.content || '点击编辑添加内容'}
								</Text>
							</TouchableOpacity>
						)}

						{editingId !== item.id && (
							<View style={styles.actions}>
								<TouchableOpacity
									onPress={() => handleMove(index, 'up')}
									disabled={index === 0}
									style={[
										styles.actionBtn,
										index === 0 && styles.actionBtnDisabled,
									]}>
									<Ionicons
										name='chevron-up'
										size={18}
										color={
											index === 0 ? Colors.textTertiary : Colors.textSecondary
										}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleMove(index, 'down')}
									disabled={index === structure.length - 1}
									style={[
										styles.actionBtn,
										index === structure.length - 1 && styles.actionBtnDisabled,
									]}>
									<Ionicons
										name='chevron-down'
										size={18}
										color={
											index === structure.length - 1
												? Colors.textTertiary
												: Colors.textSecondary
										}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleDelete(item.id)}
									style={styles.actionBtn}>
									<Ionicons
										name='trash-outline'
										size={18}
										color={Colors.error}
									/>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			))}

			<TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
				<Ionicons name='add-circle' size={20} color={Colors.primary} />
				<Text style={styles.addBtnText}>添加章节</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginTop: 16,
	},
	title: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.textSecondary,
		marginBottom: 12,
	},
	item: {
		backgroundColor: Colors.surfaceSecondary,
		borderRadius: 10,
		padding: 12,
		marginBottom: 8,
	},
	itemHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	numberBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: Colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		marginTop: 2,
	},
	numberText: {
		color: '#FFF',
		fontSize: 12,
		fontWeight: '600',
	},
	titleContainer: {
		flex: 1,
	},
	itemTitle: {
		fontSize: 15,
		color: Colors.text,
		fontWeight: '600',
		marginBottom: 4,
	},
	itemPreview: {
		fontSize: 13,
		color: Colors.textTertiary,
		lineHeight: 18,
	},
	editContainer: {
		flex: 1,
	},
	editTitleInput: {
		fontSize: 15,
		color: Colors.text,
		fontWeight: '600',
		padding: 0,
		marginBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: Colors.primary,
	},
	editContentInput: {
		fontSize: 14,
		color: Colors.textSecondary,
		minHeight: 80,
		textAlignVertical: 'top',
		backgroundColor: Colors.surface,
		borderRadius: 8,
		padding: 10,
		marginBottom: 8,
	},
	doneBtn: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
		alignSelf: 'flex-start',
	},
	doneBtnText: {
		color: '#FFF',
		fontSize: 13,
		fontWeight: '600',
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 8,
	},
	actionBtn: {
		padding: 6,
		marginLeft: 4,
	},
	actionBtnDisabled: {
		opacity: 0.3,
	},
	addBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
		borderWidth: 2,
		borderColor: Colors.primary,
		borderStyle: 'dashed',
		borderRadius: 10,
		marginTop: 8,
	},
	addBtnText: {
		color: Colors.primary,
		fontSize: 14,
		fontWeight: '600',
		marginLeft: 8,
	},
})
