import React, { useState } from 'react'
import {
	View,
	TextInput,
	TouchableOpacity,
	Text,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'

export const InputBar = ({ onSend }: { onSend: (text: string) => void }) => {
	const [text, setText] = useState('')

	const handleSend = () => {
		if (text.trim()) {
			onSend(text)
			setText('')
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<View style={styles.container}>
				<TextInput
					style={styles.input}
					placeholder='有什么闪念？直接写下来...'
					value={text}
					onChangeText={setText}
					multiline
				/>
				<TouchableOpacity style={styles.button} onPress={handleSend}>
					<Text style={styles.buttonText}>↑</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 15,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#eee',
		alignItems: 'flex-end',
	},
	input: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
		fontSize: 16,
		maxHeight: 100,
	},
	button: {
		marginLeft: 10,
		backgroundColor: '#6366f1',
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
})
