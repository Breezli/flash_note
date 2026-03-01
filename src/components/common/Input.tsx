import React, { useState } from 'react'
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	TextInputProps,
	ViewStyle,
} from 'react-native'
import { Colors } from '@/constants/Colors'

interface InputProps extends TextInputProps {
	label?: string
	error?: string
	containerStyle?: ViewStyle
}

export const Input: React.FC<InputProps> = ({
	label,
	error,
	containerStyle,
	style,
	onFocus,
	onBlur,
	...textInputProps
}) => {
	const [isFocused, setIsFocused] = useState(false)

	const handleFocus = (e: any) => {
		setIsFocused(true)
		onFocus?.(e)
	}

	const handleBlur = (e: any) => {
		setIsFocused(false)
		onBlur?.(e)
	}

	return (
		<View style={[styles.container, containerStyle]}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View
				style={[
					styles.inputContainer,
					isFocused && styles.inputContainerFocused,
					error && styles.inputContainerError,
				]}>
				<TextInput
					style={[styles.input, style]}
					placeholderTextColor={Colors.textTertiary}
					onFocus={handleFocus}
					onBlur={handleBlur}
					{...textInputProps}
				/>
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 8,
	},
	inputContainer: {
		backgroundColor: Colors.surface,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: Colors.border,
		paddingHorizontal: 16,
	},
	inputContainerFocused: {
		borderColor: Colors.primary,
	},
	inputContainerError: {
		borderColor: Colors.error,
	},
	input: {
		fontSize: 16,
		color: Colors.text,
		paddingVertical: 14,
	},
	errorText: {
		fontSize: 12,
		color: Colors.error,
		marginTop: 6,
	},
})
