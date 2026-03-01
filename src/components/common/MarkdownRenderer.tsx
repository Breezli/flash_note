// src/components/common/MarkdownRenderer.tsx
import React from 'react'
import { View, Text, StyleSheet, Linking } from 'react-native'
import { Colors } from '@/constants/Colors'

interface MarkdownRendererProps {
	content: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
	content,
}) => {
	// 简单的 Markdown 解析（支持 # ## ### ** * 等）
	const renderContent = () => {
		const lines = content.split('\n')

		return lines.map((line, index) => {
			const trimmed = line.trim()

			// 标题
			if (trimmed.startsWith('### ')) {
				return (
					<Text key={index} style={styles.h3}>
						{trimmed.replace('### ', '')}
					</Text>
				)
			}
			if (trimmed.startsWith('## ')) {
				return (
					<Text key={index} style={styles.h2}>
						{trimmed.replace('## ', '')}
					</Text>
				)
			}
			if (trimmed.startsWith('# ')) {
				return (
					<Text key={index} style={styles.h1}>
						{trimmed.replace('# ', '')}
					</Text>
				)
			}

			// 分隔线
			if (trimmed === '---' || trimmed === '___') {
				return <View key={index} style={styles.hr} />
			}

			// 普通段落（处理粗体和斜体）
			let text = trimmed
			const parts: React.ReactNode[] = []
			let keyIndex = 0

			// 简单的 **粗体** 解析
			const boldRegex = /\*\*(.*?)\*\*/g
			let lastIndex = 0
			let match

			while ((match = boldRegex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					parts.push(
						<Text key={keyIndex++} style={styles.text}>
							{text.slice(lastIndex, match.index)}
						</Text>,
					)
				}
				parts.push(
					<Text key={keyIndex++} style={styles.bold}>
						{match[1]}
					</Text>,
				)
				lastIndex = match.index + match[0].length
			}

			if (lastIndex < text.length) {
				parts.push(
					<Text key={keyIndex++} style={styles.text}>
						{text.slice(lastIndex)}
					</Text>,
				)
			}

			return parts.length > 0 ? (
				<Text key={index} style={styles.paragraph}>
					{parts}
				</Text>
			) : (
				<Text key={index} style={styles.paragraph}>
					{text}
				</Text>
			)
		})
	}

	return <View style={styles.container}>{renderContent()}</View>
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
	},
	h1: {
		fontSize: 20,
		fontWeight: '700',
		color: Colors.text,
		marginTop: 16,
		marginBottom: 8,
	},
	h2: {
		fontSize: 17,
		fontWeight: '600',
		color: Colors.text,
		marginTop: 14,
		marginBottom: 6,
	},
	h3: {
		fontSize: 15,
		fontWeight: '600',
		color: Colors.text,
		marginTop: 12,
		marginBottom: 4,
	},
	paragraph: {
		fontSize: 14,
		lineHeight: 22,
		color: Colors.textSecondary,
		marginBottom: 8,
	},
	text: {
		fontSize: 14,
		lineHeight: 22,
		color: Colors.textSecondary,
	},
	bold: {
		fontSize: 14,
		lineHeight: 22,
		color: Colors.text,
		fontWeight: '600',
	},
	hr: {
		height: 1,
		backgroundColor: Colors.border,
		marginVertical: 12,
	},
})
