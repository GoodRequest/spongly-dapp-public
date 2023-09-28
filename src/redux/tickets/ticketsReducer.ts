import { ITicketActions, ITicketListPayload, TICKET_LIST } from '@/redux/tickets/ticketType'
import { ILoadingAndFailure, RESET_STORE } from '@/redux/generalType'

export const initState = {
	ticketList: {
		data: [],
		isLoading: true,
		isFailure: false
	} as ITicketListPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last, @typescript-eslint/default-param-last
export default (state = initState, action: ITicketActions) => {
	switch (action.type) {
		// ticket list
		case TICKET_LIST.TICKET_LIST_LOAD_START:
			return {
				...state,
				ticketList: {
					...state.ticketList,
					isLoading: true,
					isFailure: false
				}
			}
		case TICKET_LIST.TICKET_LIST_LOAD_FAIL:
			return {
				...state,
				ticketList: {
					...initState.ticketList,
					isFailure: true
				}
			}
		case TICKET_LIST.TICKET_LIST_LOAD_DONE:
			return {
				...state,
				ticketList: {
					...initState.ticketList,
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
