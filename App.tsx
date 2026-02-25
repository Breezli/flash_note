import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { TimelineScreen } from './src/screens/TimelineScreen'

export default function App() {
	return (
		<>
			<StatusBar style='auto' />
			<TimelineScreen />
		</>
	)
}
