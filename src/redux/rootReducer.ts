/* eslint-disable import/no-cycle */
import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storageSession from 'redux-persist/lib/storage/session'

import { reducer as formReducer } from 'redux-form'
import { ThunkAction } from 'redux-thunk'

import ticketsReducer from '@/redux/tickets/ticketsReducer'
import betTicketsReducer from './betTickets/betTicketsReducer'
import matchesReducer from './matches/matchesReducer'

export const REDUCER_KEYS = {
	FORMS: 'FORMS',
	BETTICKETS: 'BETTICKETS',
	TICKETS: 'TICKETS',
	MATCHES: 'MATCHES'
}

const rootReducer = combineReducers({
	form: persistReducer(
		{
			key: REDUCER_KEYS.FORMS,
			storage: storageSession
		},
		formReducer
	),
	betTickets: persistReducer(
		{
			key: REDUCER_KEYS.BETTICKETS,
			storage: storageSession
		},
		betTicketsReducer
	),
	tickets: persistReducer(
		{
			key: REDUCER_KEYS.TICKETS,
			storage: storageSession
		},
		ticketsReducer
	),
	matches: persistReducer(
		{
			key: REDUCER_KEYS.MATCHES,
			storage: storageSession
		},
		matchesReducer
	)
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>
