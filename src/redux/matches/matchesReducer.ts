import { ILoadingAndFailure, RESET_STORE } from '@/redux/generalType'
import { IMatchesActions, IMatchesListPayload, MATCHES_LIST } from './matchesTypes'

export const initState = {
	matchesList: {
		data: [],
		isLoading: true,
		isFailure: false
	} as IMatchesListPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last, @typescript-eslint/default-param-last
export default (state = initState, action: IMatchesActions) => {
	switch (action.type) {
		// matches list
		case MATCHES_LIST.MATCHES_LIST_LOAD_START:
			return {
				...state,
				matchesList: {
					...state.matchesList,
					isLoading: true,
					isFailure: false
				}
			}
		case MATCHES_LIST.MATCHES_LIST_LOAD_FAIL:
			return {
				...state,
				matchesList: {
					...initState.matchesList,
					isFailure: true
				}
			}
		case MATCHES_LIST.MATCHES_LIST_LOAD_DONE:
			return {
				...state,
				matchesList: {
					...initState.matchesList,
					isLoading: false,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
