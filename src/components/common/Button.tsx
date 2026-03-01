import React from 'react'
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ActivityIndicator,
	ViewStyle,
	TextStyle,
} from 'react-native'
import { Colors } from '@/constants/Colors'

interface ButtonProps {
	title: string
	onPress: () => void
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
	size?: 'small' | 'medium' | 'large'
	disabled?: boolean
	loading?: boolean
	icon?: React.ReactNode
	style?: ViewStyle
	textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	size = 'medium',
	disabled = false,
	loading = false,
	icon,
	style,
	textStyle,
}) => {
	const getBackgroundColor = () => {
		if (disabled) return Colors.textTertiary
		switch (variant) {
			case 'primary':
				return Colors.primary
			case 'secondary':
				return Colors.secondary
			case 'outline':
			case 'ghost':
				return 'transparent'
			default:
				return Colors.primary
		}
	}

	const getTextColor = () => {
		if (disabled) return Colors.surface
		switch (variant) {
			case 'primary':
			case 'secondary':
				return '#FFFFFF'
			case 'outline':
			case 'ghost':
				return Colors.primary
			default:
				return '#FFFFFF'
		}
	}

	const getPadding = () => {
		switch (size) {
			case 'small':
				return { paddingVertical: 8, paddingHorizontal: 16 }
			case 'large':
				return { paddingVertical: 16, paddingHorizontal: 32 }
			default:
				return { paddingVertical: 12, paddingHorizontal: 24 }
		}
	}

	const getFontSize = () => {
		switch (size) {
			case 'small':
				return 14
			case 'large':
				return 18
			default:
				return 16
		}
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled || loading}
			activeOpacity={0.8}
			style={[
				styles.button,
				{
					backgroundColor: getBackgroundColor(),
					...getPadding(),
					borderWidth: variant === 'outline' ? 2 : 0,
					borderColor: variant === 'outline' ? Colors.primary : 'transparent',
				},
				style,
			]}>
			{loading ? (
				<ActivityIndicator color={getTextColor()} size='small' />
			) : (
				<>
					{icon}
					<Text
						style={[
							styles.text,
							{
								color: getTextColor(),
								fontSize: getFontSize(),
								marginLeft: icon ? 8 : 0,
							},
							textStyle,
						]}>
						{title}
					</Text>
				</>
			)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-start',
	},
	text: {
		fontWeight: '600',
	},
})
