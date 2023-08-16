export const RESET_STORE = 'RESET_STORE'

export interface IResetStore {
	type: typeof RESET_STORE
}

export interface ILoadingAndFailure {
	isLoading: boolean
	isFailure: boolean
}

export interface ILoadingBatch {
	isLoadingBatch: boolean
}
