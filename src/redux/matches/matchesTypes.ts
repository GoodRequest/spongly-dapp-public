import { IResetStore } from '../generalTypes'

export enum SET_ALL_MATCHES {
	SET_ALL_MATCHES_ARRAY = 'SET_ALL_MATCHES_ARRAY',
	SET_ALL_MATCHES_ARRAY_START = 'SET_ALL_MATCHES_ARRAY_START',
	STATE = 'STATE'
}

export interface IState {
	isLoading: boolean
	isFailed: boolean
}

export interface IMatchesPayload {
	matches: any
	isLoading: boolean
	isFailed: boolean
}

export interface ISetAllMatches {
	type: SET_ALL_MATCHES
	payload: IMatchesPayload
}

export type IMatchesActions = IResetStore | ISetAllMatches
