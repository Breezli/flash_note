import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
} from 'react-native'
import { SafeAreaContainer } from '@/components/SafeAreaContainer'
import { Colors } from '@/constants/Colors'
import { useNotes } from '@/context/NotesContext'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ProfileScreen() {
	const { state } = useNotes()

	const handleClearAll = () => {
		Alert.alert('确认删除', '确定要删除所有笔记吗？此操作不可恢复。', [
			{ text: '取消', style: 'cancel' },
			{
				text: '删除',
				style: 'destructive',
				onPress: async () => {
					try {
						await AsyncStorage.removeItem('@smart_notes')
					} catch (error) {
						console.error('清除数据失败:', error)
					}
				},
			},
		])
	}

	const menuItems = [
		{
			icon: 'document-text-outline',
			title: '笔记统计',
			value: `${state.notes.length} 个`,
			color: Colors.primary,
		},
		{
			icon: 'pricetag-outline',
			title: '标签数量',
			value: `${new Set(state.notes.flatMap((n) => n.tags)).size} 个`,
			color: Colors.secondary,
		},
		{
			icon: 'time-outline',
			title: '今日创建',
			value: `${
				state.notes.filter((n) => {
					const today = new Date()
					const noteDate = new Date(n.createdAt)
					return today.toDateString() === noteDate.toDateString()
				}).length
			} 个`,
			color: Colors.accent,
		},
	]

	const settingItems = [
		{
			icon: 'trash-outline',
			title: '清除所有笔记',
			color: Colors.error,
			onPress: handleClearAll,
		},
	]

	return (
		<SafeAreaContainer style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>个人中心</Text>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.userCard}>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>📝</Text>
					</View>
					<View style={styles.userInfo}>
						<Text style={styles.userName}>闪念 · FlashNote</Text>
						<Text style={styles.userDesc}>智能整理你的每一个想法</Text>
					</View>
				</View>

				<View style={styles.statsContainer}>
					{menuItems.map((item, index) => (
						<View key={index} style={styles.statItem}>
							<View
								style={[
									styles.statIcon,
									{ backgroundColor: item.color + '15' },
								]}>
								<Ionicons
									name={item.icon as any}
									size={22}
									color={item.color}
								/>
							</View>
							<Text style={styles.statValue}>{item.value}</Text>
							<Text style={styles.statLabel}>{item.title}</Text>
						</View>
					))}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>设置</Text>
					<View style={styles.menuContainer}>
						{settingItems.map((item, index) => (
							<TouchableOpacity
								key={index}
								style={styles.menuItem}
								onPress={item.onPress}>
								<View style={styles.menuItemLeft}>
									<Ionicons
										name={item.icon as any}
										size={22}
										color={item.color}
									/>
									<Text style={[styles.menuItemText, { color: item.color }]}>
										{item.title}
									</Text>
								</View>
								<Ionicons
									name='chevron-forward'
									size={20}
									color={Colors.textTertiary}
								/>
							</TouchableOpacity>
						))}
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>关于</Text>
					<View style={styles.aboutContainer}>
						<Text style={styles.aboutText}>AI 闪念笔记</Text>
						<Text style={styles.versionText}>版本 1.0.0</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 12,
		backgroundColor: Colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: Colors.text,
	},
	content: {
		flex: 1,
	},
	userCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.surface,
		margin: 16,
		padding: 20,
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 8,
		elevation: 3,
	},
	avatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: Colors.primary + '15',
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 32,
	},
	userInfo: {
		marginLeft: 16,
	},
	userName: {
		fontSize: 20,
		fontWeight: '700',
		color: Colors.text,
	},
	userDesc: {
		fontSize: 14,
		color: Colors.textSecondary,
		marginTop: 4,
	},
	statsContainer: {
		flexDirection: 'row',
		marginHorizontal: 16,
		marginBottom: 24,
		gap: 12,
	},
	statItem: {
		flex: 1,
		backgroundColor: Colors.surface,
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 4,
		elevation: 2,
	},
	statIcon: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	statValue: {
		fontSize: 20,
		fontWeight: '700',
		color: Colors.text,
	},
	statLabel: {
		fontSize: 12,
		color: Colors.textSecondary,
		marginTop: 4,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.textTertiary,
		marginLeft: 20,
		marginBottom: 10,
		textTransform: 'uppercase',
	},
	menuContainer: {
		backgroundColor: Colors.surface,
		marginHorizontal: 16,
		borderRadius: 12,
		overflow: 'hidden',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	menuItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	menuItemText: {
		fontSize: 16,
		marginLeft: 12,
		fontWeight: '500',
	},
	aboutContainer: {
		backgroundColor: Colors.surface,
		marginHorizontal: 16,
		borderRadius: 12,
		padding: 20,
		alignItems: 'center',
	},
	aboutText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.text,
	},
	versionText: {
		fontSize: 14,
		color: Colors.textSecondary,
		marginTop: 4,
	},
})
