import React, { useState } from 'react'
import {
	View,
	StyleSheet,
	Text as RNText,
	FlatList,
	TouchableOpacity,
} from 'react-native'
import { NoteCard } from './NoteCard'
import { Note } from '@/types'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface DraggableCardListProps {
	notes: Note[]
	onReorder: (notes: Note[]) => void
	onDelete: (id: string) => void
	onPress: (note: Note) => void
}

export const DraggableCardList: React.FC<DraggableCardListProps> = ({
	notes,
	onReorder,
	onDelete,
	onPress,
}) => {
	const [editingId, setEditingId] = useState<string | null>(null)

	// 上移
	const moveUp = (index: number) => {
		if (index === 0) return
		const newNotes = [...notes]
		;[newNotes[index - 1], newNotes[index]] = [
			newNotes[index],
			newNotes[index - 1],
		]
		onReorder(newNotes)
	}

	// 下移
	const moveDown = (index: number) => {
		if (index === notes.length - 1) return
		const newNotes = [...notes]
		;[newNotes[index], newNotes[index + 1]] = [
			newNotes[index + 1],
			newNotes[index],
		]
		onReorder(newNotes)
	}

	const renderItem = ({ item, index }: { item: Note; index: number }) => (
		<View style={styles.itemContainer}>
			<View style={styles.cardWrapper}>
				<NoteCard note={item} onPress={onPress} onDelete={onDelete} />
			</View>

			{/* 排序控制按钮 */}
			<View style={styles.controls}>
				<TouchableOpacity
					onPress={() => moveUp(index)}
					disabled={index === 0}
					style={[styles.controlBtn, index === 0 && styles.controlBtnDisabled]}>
					<Ionicons
						name='chevron-up'
						size={20}
						color={index === 0 ? Colors.textTertiary : Colors.primary}
					/>
				</TouchableOpacity>

				<RNText style={styles.indexText}>{index + 1}</RNText>

				<TouchableOpacity
					onPress={() => moveDown(index)}
					disabled={index === notes.length - 1}
					style={[
						styles.controlBtn,
						index === notes.length - 1 && styles.controlBtnDisabled,
					]}>
					<Ionicons
						name='chevron-down'
						size={20}
						color={
							index === notes.length - 1 ? Colors.textTertiary : Colors.primary
						}
					/>
				</TouchableOpacity>
			</View>
		</View>
	)

	if (notes.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<View style={styles.emptyIcon}>
					<RNText style={styles.emptyIconText}>📝</RNText>
				</View>
				<RNText style={styles.emptyTitle}>暂无笔记</RNText>
				<RNText style={styles.emptyText}>去首页创建你的第一个笔记卡片吧</RNText>
			</View>
		)
	}

	return (
		<FlatList
			data={notes}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={false}
		/>
	)
}

const styles = StyleSheet.create({
	listContent: {
		paddingVertical: 8,
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	cardWrapper: {
		flex: 1,
	},
	controls: {
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 8,
	},
	controlBtn: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.surface,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	controlBtnDisabled: {
		backgroundColor: Colors.surfaceSecondary,
		shadowOpacity: 0,
		elevation: 0,
	},
	indexText: {
		fontSize: 12,
		color: Colors.textTertiary,
		marginVertical: 4,
		fontWeight: '600',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
		paddingTop: 100,
	},
	emptyIcon: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: Colors.surfaceSecondary,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	emptyIconText: {
		fontSize: 36,
		lineHeight: 44,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 8,
	},
	emptyText: {
		fontSize: 14,
		color: Colors.textTertiary,
		textAlign: 'center',
		lineHeight: 22,
	},
})
