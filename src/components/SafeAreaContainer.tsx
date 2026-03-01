import React from 'react'
import { View, Platform, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SafeAreaContainerProps } from '@/types'

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
	children,
	style,
	excludeEdges = [],
}) => {
	const insets = useSafeAreaInsets()

	const safeAreaStyle = Platform.select({
		web: {
			paddingTop: 0,
			paddingBottom: 0,
			paddingLeft: 0,
			paddingRight: 0,
		},
		default: {
			paddingTop: excludeEdges.includes('top') ? 0 : insets.top,
			paddingBottom: excludeEdges.includes('bottom') ? 0 : insets.bottom,
			paddingLeft: excludeEdges.includes('left') ? 0 : insets.left,
			paddingRight: excludeEdges.includes('right') ? 0 : insets.right,
		},
	})

	return (
		<View style={[styles.container, safeAreaStyle, style]}>{children}</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
