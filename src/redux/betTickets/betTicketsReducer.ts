import { RESET_STORE } from '../generalTypes'
import { ACTIVE_TICKET_PROCESSING, IBetTicketActions, IUnsubmittedBetTicketsPayload, UNSUBMITTED_BET_TICKETS, ACTIVE_TICKET_SUBMITTING } from './betTicketTypes'

export const initState = {
	unsubmittedBetTickets: {
		data: null
	} as IUnsubmittedBetTicketsPayload,
	isProcessing: false,
	isSubmitting: false
}

// eslint-disable-next-line default-param-last, @typescript-eslint/default-param-last
export default (state = initState, action: IBetTicketActions) => {
	switch (action.type) {
		// Unsubmitted tickets
		case UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_INIT:
			return {
				...state,
				unsubmittedBetTickets: {
					...state.unsubmittedBetTickets,
					data: action.payload.data
				}
			}
		case UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE:
			return {
				...state,
				unsubmittedBetTickets: {
					...state.unsubmittedBetTickets,
					data: action.payload.data ? [...action.payload.data] : []
				}
			}
		case ACTIVE_TICKET_PROCESSING.SET:
			return {
				...state,
				isProcessing: action.payload
			}
		case ACTIVE_TICKET_SUBMITTING.SET:
			return {
				...state,
				isSubmitting: action.payload
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
