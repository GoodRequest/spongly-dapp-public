import { IResetStore } from '@/redux/generalType'

export enum MATCHES_LIST {
	MATCHES_LIST_LOAD_START = 'MATCHES_LIST_LOAD_START',
	MATCHES_LIST_LOAD_DONE = 'MATCHES_LIST_LOAD_DONE',
	MATCHES_LIST_LOAD_FAIL = 'MATCHES_LIST_LOAD_FAIL'
}

export type IMatchesActions = IResetStore | IGetMatchesList

export interface IMatchesListPayload {
	data: any
}

export interface IGetMatchesList {
	type: MATCHES_LIST
	payload: IMatchesListPayload
}
