import React, {
	createContext,
	useContext,
	useReducer,
	useCallback,
	useEffect,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Note, NotesState, NotesContextType, ArticleStructure } from '@/types'
import { notesApi } from '@/api/notes'

const STORAGE_KEY = '@flashnoteai_notes'

// 初始状态
const initialState: NotesState = {
	notes: [],
	loading: false,
	error: null,
}

// Action类型
type Action =
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'SET_ERROR'; payload: string | null }
	| { type: 'SET_NOTES'; payload: Note[] }
	| { type: 'ADD_NOTE'; payload: Note }
	| { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
	| { type: 'DELETE_NOTE'; payload: string }
	| { type: 'REORDER_NOTES'; payload: Note[] }

// Reducer
const notesReducer = (state: NotesState, action: Action): NotesState => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, loading: action.payload }
		case 'SET_ERROR':
			return { ...state, error: action.payload }
		case 'SET_NOTES':
			return { ...state, notes: action.payload }
		case 'ADD_NOTE':
			return { ...state, notes: [action.payload, ...state.notes] }
		case 'UPDATE_NOTE':
			return {
				...state,
				notes: state.notes.map((note) =>
					note.id === action.payload.id
						? { ...note, ...action.payload.updates, updatedAt: Date.now() }
						: note,
				),
			}
		case 'DELETE_NOTE':
			return {
				...state,
				notes: state.notes.filter((note) => note.id !== action.payload),
			}
		case 'REORDER_NOTES':
			return { ...state, notes: action.payload }
		default:
			return state
	}
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(notesReducer, initialState)

	// 从API加载笔记（优先）或本地缓存
	const loadNotes = useCallback(async () => {
		dispatch({ type: 'SET_LOADING', payload: true })
		try {
			const notes = await notesApi.getNotes()
			dispatch({ type: 'SET_NOTES', payload: notes })
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
		} catch (error) {
			console.error('加载笔记失败:', error)
			try {
				const stored = await AsyncStorage.getItem(STORAGE_KEY)
				if (stored) {
					dispatch({ type: 'SET_NOTES', payload: JSON.parse(stored) })
				}
			} catch (e) {
				dispatch({ type: 'SET_ERROR', payload: '加载笔记失败' })
			}
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}, [])

	const addNote = useCallback(
		async (content: string) => {
			dispatch({ type: 'SET_LOADING', payload: true })
			dispatch({ type: 'SET_ERROR', payload: null })

			try {
				const newNote = await notesApi.createNote(content)
				dispatch({ type: 'ADD_NOTE', payload: newNote })
				const updatedNotes = [newNote, ...state.notes]
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes))
			} catch (error) {
				console.error('创建笔记失败:', error)
				dispatch({ type: 'SET_ERROR', payload: 'AI处理失败，请重试' })
			} finally {
				dispatch({ type: 'SET_LOADING', payload: false })
			}
		},
		[state.notes],
	)

	const updateNote = useCallback(
		async (id: string, updates: Partial<Note>) => {
			try {
				await notesApi.updateNote(id, updates)
				dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } })
				const updatedNotes = state.notes.map((n) =>
					n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n,
				)
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes))
			} catch (error) {
				console.error('更新笔记失败:', error)
			}
		},
		[state.notes],
	)

	const deleteNote = useCallback(
		async (id: string) => {
			try {
				await notesApi.deleteNote(id)
				dispatch({ type: 'DELETE_NOTE', payload: id })
				const filtered = state.notes.filter((n) => n.id !== id)
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
			} catch (error) {
				console.error('删除笔记失败:', error)
			}
		},
		[state.notes],
	)

	const reorderNotes = useCallback(async (notes: Note[]) => {
		dispatch({ type: 'REORDER_NOTES', payload: notes })
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
	}, [])

	const updateStructure = useCallback(
		async (noteId: string, structure: ArticleStructure[]) => {
			try {
				await notesApi.updateStructure(noteId, structure)
				dispatch({
					type: 'UPDATE_NOTE',
					payload: { id: noteId, updates: { structure } },
				})
			} catch (error) {
				console.error('更新结构失败:', error)
			}
		},
		[],
	)

	const refreshNotes = useCallback(async () => {
		await loadNotes()
	}, [loadNotes])

	useEffect(() => {
		loadNotes()
	}, [loadNotes])

	const value: NotesContextType = {
		state,
		addNote,
		updateNote,
		deleteNote,
		reorderNotes,
		updateStructure,
		refreshNotes,
	}

	return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => {
	const context = useContext(NotesContext)
	if (!context) {
		throw new Error('useNotes must be used within a NotesProvider')
	}
	return context
}
