import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NotesProvider } from '@/context/NotesContext'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

// 导入屏幕
import HomeScreen from '@/screens/HomeScreen'
import NotesScreen from '@/screens/NotesScreen'
import OrganizeScreen from '@/screens/OrganizeScreen'
import ProfileScreen from '@/screens/ProfileScreen'

const Tab = createBottomTabNavigator()

export default function App() {
	return (
		<GestureHandlerRootView style={styles.container}>
			<SafeAreaProvider>
				<NotesProvider>
					<StatusBar style='dark' backgroundColor='transparent' translucent />
					<NavigationContainer>
						<Tab.Navigator
							screenOptions={({ route }) => ({
								headerShown: false,
								tabBarActiveTintColor: Colors.tabIconSelected,
								tabBarInactiveTintColor: Colors.tabIconDefault,
								tabBarStyle: {
									backgroundColor: Colors.surface,
									borderTopWidth: 1,
									borderTopColor: Colors.border,
									paddingBottom: 8,
									paddingTop: 8,
									height: 60,
								},
								tabBarLabelStyle: {
									fontSize: 12,
									fontWeight: '500',
								},
								tabBarIcon: ({ color, size }) => {
									let iconName: keyof typeof Ionicons.glyphMap = 'home'
									if (route.name === 'Home') iconName = 'create'
									else if (route.name === 'Notes') iconName = 'document-text'
									else if (route.name === 'Organize') iconName = 'grid'
									else if (route.name === 'Profile') iconName = 'person'
									return <Ionicons name={iconName} size={size} color={color} />
								},
							})}>
							<Tab.Screen 
								name='Home' 
								component={HomeScreen} 
								options={{ title: '首页' }}
							/>
							<Tab.Screen 
								name='Notes' 
								component={NotesScreen} 
								options={{ title: '笔记' }}
							/>
							<Tab.Screen 
								name='Organize' 
								component={OrganizeScreen} 
								options={{ title: '整理' }}
							/>
							<Tab.Screen 
								name='Profile' 
								component={ProfileScreen} 
								options={{ title: '我的' }}
							/>
						</Tab.Navigator>
					</NavigationContainer>
				</NotesProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})