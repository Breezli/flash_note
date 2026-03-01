import React, { useState, useEffect, useCallback } from 'react'
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TextInput,
	Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { Note, ArticleStructure } from '@/types'
import { StructureEditor } from './StructureEditor'
import { Button } from '@/components/common/Button'
import { MarkdownRenderer } from '../common/MarkdownRenderer'

interface NoteDetailModalProps {
	note: Note | null
	visible: boolean
	onClose: () => void
	onSave: (id: string, updates: Partial<Note>) => void
}

// 将 structure 转换为 content
const structureToContent = (structure: ArticleStructure[]): string => {
	if (!structure || structure.length === 0) return ''
	return structure
		.map((item) => `${item.title}\n${item.content || ''}`)
		.join('\n\n')
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
	note,
	visible,
	onClose,
	onSave,
}) => {
	const [title, setTitle] = useState('')
	const [summary, setSummary] = useState('')
	const [content, setContent] = useState('')
	const [structure, setStructure] = useState<ArticleStructure[]>([])
	const [activeTab, setActiveTab] = useState<'content' | 'structure'>('content')
	const [isEditingContent, setIsEditingContent] = useState(false)

	// 初始化数据
	useEffect(() => {
		if (note) {
			setTitle(note.title)
			setSummary(note.summary)
			setContent(note.content)
			setStructure(note.structure)
			setIsEditingContent(false)
		}
	}, [note, visible])

	// 当 structure 变化时，同步更新 content
	const handleStructureChange = useCallback(
		(newStructure: ArticleStructure[]) => {
			setStructure(newStructure)
			// 自动同步到 content
			const newContent = structureToContent(newStructure)
			setContent(newContent)
		},
		[],
	)

	const handleSave = () => {
		if (note) {
			onSave(note.id, {
				title,
				summary,
				content,
				structure,
			})
			onClose()
		}
	}

	const handleClose = () => {
		// 检查是否有未保存的更改
		if (note) {
			const hasChanges =
				title !== note.title ||
				summary !== note.summary ||
				content !== note.content ||
				JSON.stringify(structure) !== JSON.stringify(note.structure)

			if (hasChanges) {
				Alert.alert('未保存的更改', '确定要放弃更改吗？', [
					{ text: '取消', style: 'cancel' },
					{ text: '放弃', style: 'destructive', onPress: onClose },
				])
			} else {
				onClose()
			}
		}
	}

	const toggleEditMode = () => {
		setIsEditingContent(!isEditingContent)
	}

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp)
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(
			date.getMinutes(),
		).padStart(2, '0')}`
	}

	if (!note) return null

	return (
		<Modal
			visible={visible}
			animationType='slide'
			presentationStyle='pageSheet'
			onRequestClose={handleClose}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
						<Ionicons name='close' size={24} color={Colors.text} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>编辑笔记</Text>
					<TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
						<Text style={styles.saveBtnText}>保存</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.tabContainer}>
					<TouchableOpacity
						style={[styles.tab, activeTab === 'content' && styles.activeTab]}
						onPress={() => setActiveTab('content')}>
						<Text
							style={[
								styles.tabText,
								activeTab === 'content' && styles.activeTabText,
							]}>
							内容
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, activeTab === 'structure' && styles.activeTab]}
						onPress={() => setActiveTab('structure')}>
						<Text
							style={[
								styles.tabText,
								activeTab === 'structure' && styles.activeTabText,
							]}>
							结构
						</Text>
					</TouchableOpacity>
				</View>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					{activeTab === 'content' ? (
						<View style={styles.form}>
							{/* 概要 - 用户原文 */}
							<View style={styles.inputGroup}>
								<View style={styles.labelRow}>
									<Text style={styles.label}>核心概要（你的输入）</Text>
									<View style={styles.badge}>
										<Text style={styles.badgeText}>原文</Text>
									</View>
								</View>
								<TextInput
									style={[styles.input, styles.textArea]}
									value={summary}
									onChangeText={setSummary}
									placeholder='核心想法...'
									placeholderTextColor={Colors.textTertiary}
									multiline
									textAlignVertical='top'
								/>
							</View>

							{/* 完整内容 - 显示模式 */}
							<View style={styles.inputGroup}>
								<View style={styles.labelRow}>
									<Text style={styles.label}>完整内容（AI扩写）</Text>
									<TouchableOpacity onPress={toggleEditMode}>
										<Text style={styles.editLink}>
											{isEditingContent ? '完成' : '编辑'}
										</Text>
									</TouchableOpacity>
								</View>

								{isEditingContent ? (
									// 编辑模式：显示 TextInput
									<TextInput
										style={[
											styles.input,
											styles.textArea,
											styles.largeTextArea,
										]}
										value={content}
										onChangeText={setContent}
										multiline
										textAlignVertical='top'
										placeholder='在此编辑 Markdown 内容...'
										placeholderTextColor={Colors.textTertiary}
									/>
								) : (
									// 显示模式：渲染 Markdown
									<View style={styles.markdownContainer}>
										<MarkdownRenderer content={content} />
									</View>
								)}
							</View>
						</View>
					) : (
						<View style={styles.structureContainer}>
							<Text style={styles.structureDescription}>
								编辑章节标题和内容，修改会自动同步到"内容"页面
							</Text>
							<StructureEditor
								structure={structure}
								onChange={handleStructureChange}
							/>
						</View>
					)}
				</ScrollView>

				<View style={styles.footer}>
					<Button
						title='取消'
						variant='outline'
						onPress={handleClose}
						style={styles.footerBtn}
					/>
					<Button
						title='保存修改'
						onPress={handleSave}
						style={[styles.footerBtn, styles.saveFooterBtn]}
					/>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: Platform.OS === 'ios' ? 60 : 20,
		paddingBottom: 16,
		backgroundColor: Colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	closeBtn: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 17,
		fontWeight: '600',
		color: Colors.text,
	},
	hintText: {
		fontSize: 12,
		color: Colors.textTertiary,
		marginTop: 8,
		fontStyle: 'italic',
	},
	saveBtn: {
		padding: 8,
	},
	saveBtnText: {
		fontSize: 16,
		color: Colors.primary,
		fontWeight: '600',
	},
	tabContainer: {
		flexDirection: 'row',
		backgroundColor: Colors.surface,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	tab: {
		paddingVertical: 12,
		marginRight: 24,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	activeTab: {
		borderBottomColor: Colors.primary,
	},
	tabText: {
		fontSize: 15,
		color: Colors.textSecondary,
		fontWeight: '500',
	},
	activeTabText: {
		color: Colors.primary,
	},
	content: {
		flex: 1,
	},
	form: {
		padding: 16,
	},
	structureContainer: {
		padding: 16,
	},
	structureDescription: {
		fontSize: 14,
		color: Colors.textSecondary,
		marginBottom: 16,
		lineHeight: 22,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 8,
	},
	input: {
		backgroundColor: Colors.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.border,
		padding: 14,
		fontSize: 16,
		color: Colors.text,
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: 'top',
	},
	largeTextArea: {
		minHeight: 200,
	},
	metaInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 8,
	},
	metaText: {
		fontSize: 12,
		color: Colors.textTertiary,
		marginLeft: 6,
	},
	footer: {
		flexDirection: 'row',
		padding: 16,
		backgroundColor: Colors.surface,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
		gap: 12,
	},
	footerBtn: {
		flex: 1,
	},
	saveFooterBtn: {
		backgroundColor: Colors.primary,
	},
	labelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	badge: {
		backgroundColor: Colors.surfaceSecondary,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	badgeText: {
		fontSize: 11,
		color: Colors.textSecondary,
		fontWeight: '600',
	},
	aiBadge: {
		backgroundColor: Colors.primary + '15',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	aiBadgeText: {
		color: Colors.primary,
	},
	markdownContainer: {
		backgroundColor: Colors.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.border,
		padding: 14,
		minHeight: 200,
	},
	editLink: {
		color: Colors.primary,
		fontSize: 14,
		fontWeight: '600',
	},
})
