import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { Button } from '@/components/common/Button'

interface NoteInputProps {
	onSubmit: (content: string) => void
	loading?: boolean
}

export const NoteInput: React.FC<NoteInputProps> = ({
	onSubmit,
	loading = false,
}) => {
	const [content, setContent] = useState('')
	const [isFocused, setIsFocused] = useState(false)

	const handleSubmit = () => {
		if (content.trim() && !loading) {
			onSubmit(content.trim())
			setContent('')
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<View
				style={[
					styles.inputContainer,
					{
						borderColor: isFocused ? Colors.primary : Colors.border,
						shadowOpacity: isFocused ? 0.15 : 0.05,
					},
					loading && styles.loadingContainer,
				]}>
				{loading ? (
					// 加载状态
					<View style={styles.loadingWrapper}>
						<ActivityIndicator size='large' color={Colors.primary} />
						<Text style={styles.loadingText}>AI 正在整理笔记...</Text>
						<Text style={styles.loadingSubText}>
							正在生成标题、标签和详细内容
						</Text>
					</View>
				) : (
					// 正常输入状态
					<>
						<TextInput
							style={styles.input}
							placeholder='输入你的想法...'
							placeholderTextColor={Colors.textTertiary}
							value={content}
							onChangeText={setContent}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							multiline
							maxLength={500}
							textAlignVertical='top'
							editable={!loading}
						/>
						<View style={styles.footer}>
							<View style={styles.charCount}>
								<Ionicons
									name='create-outline'
									size={16}
									color={Colors.textTertiary}
								/>
								<Text style={styles.charCountText}>{content.length}/500</Text>
							</View>
							<Button
								title='生成卡片'
								onPress={handleSubmit}
								disabled={!content.trim()}
								size='medium'
								icon={<Ionicons name='sparkles' size={18} color='#FFF' />}
							/>
						</View>
					</>
				)}
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	inputContainer: {
		backgroundColor: Colors.surface,
		borderRadius: 16,
		borderWidth: 2,
		padding: 16,
		shadowColor: Colors.primary,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowRadius: 12,
		elevation: 4,
		minHeight: 180,
	},
	loadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 200,
	},
	loadingWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 40,
	},
	loadingText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.text,
		marginTop: 16,
	},
	loadingSubText: {
		fontSize: 13,
		color: Colors.textSecondary,
		marginTop: 8,
	},
	input: {
		fontSize: 16,
		lineHeight: 24,
		color: Colors.text,
		minHeight: 120,
		maxHeight: 200,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	charCount: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	charCountText: {
		fontSize: 13,
		color: Colors.textTertiary,
		marginLeft: 6,
	},
})
