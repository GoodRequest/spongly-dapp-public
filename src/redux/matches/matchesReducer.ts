import { RESET_STORE } from '../generalTypes'
import { SET_ALL_MATCHES, IMatchesActions, IMatchesPayload } from './matchesTypes'

export const initState = {
	rawMatches: {
		matches: [],
		isFailed: false,
		isLoading: true
	} as IMatchesPayload
}

// eslint-disable-next-line @typescript-eslint/default-param-last
export default (state = initState, action: IMatchesActions) => {
	switch (action.type) {
		case SET_ALL_MATCHES.SET_ALL_MATCHES_ARRAY:
			return {
				...state,
				rawMatches: action.payload
			}
		case SET_ALL_MATCHES.SET_ALL_MATCHES_ARRAY_START:
			return {
				...state,
				isFailed: false
			}
		case SET_ALL_MATCHES.STATE:
			return {
				...state,
				rawMatches: {
					...state.rawMatches,
					isLoading: action.payload.isLoading,
					isFailed: action.payload.isFailed
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
