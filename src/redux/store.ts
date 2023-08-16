import { useMemo } from 'react'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'
import rootReducer from './rootReducer'

let store: any

function loggerFilter(getState: any, action: any) {
	if (action.type.startsWith('persist')) {
		return false
	}
	if (action.type === '@@redux-form/REGISTER_FIELD') {
		return false
	}
	return action.type !== '@@redux-form/UNREGISTER_FIELD'
}

function initStore(initialState: any) {
	const logger = createLogger({
		collapsed: true,
		duration: true,
		predicate: loggerFilter
	})

	return createStore(
		rootReducer,
		initialState,
		composeWithDevTools(process.env.NODE_ENV === 'development' ? applyMiddleware(thunkMiddleware, logger) : applyMiddleware(thunkMiddleware))
	)
}

export const initializeStore = (preloadedState: any) => {
	// eslint-disable-next-line no-underscore-dangle
	let _store: any = store ?? initStore(preloadedState)

	// After navigating to a page with an initial Redux state, merge that state
	// with the current state in the store, and create a new store
	if (preloadedState && store) {
		_store = initStore({
			...store?.getState(),
			...preloadedState
		})
		// Reset the current store
		store = undefined
	}
	// For SSG and SSR always create a new store
	if (typeof window === 'undefined') return _store
	// Create the store once in the client
	if (!store) store = _store
	// eslint-disable-next-line no-underscore-dangle

	return _store
}

export const useStore = (initialState: any) => {
	return useMemo(() => initializeStore(initialState), [initialState])
}

export function usePersistor(storeWrapper: any) {
	return persistStore(storeWrapper)
}
