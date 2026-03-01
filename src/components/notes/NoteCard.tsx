import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { Note } from '@/types'

interface NoteCardProps {
	note: Note
	onPress?: (note: Note) => void
	onDelete?: (id: string) => void
	isDragging?: boolean
	drag?: () => void
	style?: any
}

export const NoteCard: React.FC<NoteCardProps> = ({
	note,
	onPress,
	onDelete,
	isDragging,
	drag,
	style,
}) => {
	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp)
		return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(
			date.getMinutes(),
		).padStart(2, '0')}`
	}

	return (
		<View style={[styles.container, isDragging && styles.dragging, style]}>
			<TouchableOpacity
				onPress={() => onPress?.(note)}
				onLongPress={drag}
				activeOpacity={0.9}
				style={styles.card}>
				<View style={styles.topBar}>
					<View style={styles.tagContainer}>
						{note.tags.map((tag, index) => (
							<View key={index} style={styles.tag}>
								<Text style={styles.tagText}>{tag}</Text>
							</View>
						))}
					</View>
					{onDelete && (
						<TouchableOpacity
							onPress={() => onDelete(note.id)}
							style={styles.deleteBtn}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
							<Ionicons name='close' size={18} color={Colors.textTertiary} />
						</TouchableOpacity>
					)}
				</View>

				<Text style={styles.title} numberOfLines={2}>
					{note.title}
				</Text>

				<Text style={styles.summary} numberOfLines={3}>
					{note.summary}
				</Text>

				{note.structure.length > 0 && (
					<View style={styles.structurePreview}>
						<View style={styles.structureHeader}>
							<Ionicons name='list-outline' size={14} color={Colors.primary} />
							<Text style={styles.structureTitle}>文章结构</Text>
						</View>
						<View style={styles.structureItems}>
							{note.structure.slice(0, 3).map((item, index) => (
								<View key={item.id} style={styles.structureItem}>
									<Text style={styles.structureBullet}>•</Text>
									<Text style={styles.structureText} numberOfLines={1}>
										{item.title}
									</Text>
								</View>
							))}
							{note.structure.length > 3 && (
								<Text style={styles.moreText}>
									+{note.structure.length - 3} 更多
								</Text>
							)}
						</View>
					</View>
				)}

				<View style={styles.footer}>
					<View style={styles.timeContainer}>
						<Ionicons
							name='time-outline'
							size={12}
							color={Colors.textTertiary}
						/>
						<Text style={styles.timeText}>{formatDate(note.createdAt)}</Text>
					</View>
					<Ionicons
						name='chevron-forward'
						size={16}
						color={Colors.textTertiary}
					/>
				</View>

				{drag && (
					<View style={styles.dragHandle}>
						<Ionicons
							name='reorder-three'
							size={20}
							color={Colors.textTertiary}
						/>
					</View>
				)}
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginVertical: 8,
	},
	dragging: {
		opacity: 0.9,
		transform: [{ scale: 1.02 }],
		shadowOpacity: 0.3,
		elevation: 10,
	},
	card: {
		backgroundColor: Colors.surface,
		borderRadius: 16,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 8,
		elevation: 3,
	},
	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	tagContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		flex: 1,
	},
	tag: {
		backgroundColor: Colors.primary + '15',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		marginRight: 6,
		marginBottom: 4,
	},
	tagText: {
		fontSize: 11,
		color: Colors.primary,
		fontWeight: '600',
	},
	deleteBtn: {
		padding: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: Colors.text,
		marginBottom: 8,
		lineHeight: 26,
	},
	summary: {
		fontSize: 14,
		color: Colors.textSecondary,
		lineHeight: 22,
		marginBottom: 12,
	},
	structurePreview: {
		backgroundColor: Colors.surfaceSecondary,
		borderRadius: 10,
		padding: 12,
		marginBottom: 12,
	},
	structureHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	structureTitle: {
		fontSize: 12,
		fontWeight: '600',
		color: Colors.primary,
		marginLeft: 6,
	},
	structureItems: {
		marginLeft: 4,
	},
	structureItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	structureBullet: {
		fontSize: 14,
		color: Colors.primary,
		marginRight: 8,
	},
	structureText: {
		fontSize: 13,
		color: Colors.textSecondary,
		flex: 1,
	},
	moreText: {
		fontSize: 12,
		color: Colors.textTertiary,
		marginTop: 4,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	timeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	timeText: {
		fontSize: 12,
		color: Colors.textTertiary,
		marginLeft: 4,
	},
	dragHandle: {
		position: 'absolute',
		right: 8,
		top: '50%',
		transform: [{ translateY: -10 }],
		padding: 8,
	},
})
