import { ITicketActions, ITicketListPayload, TICKET_LIST } from '@/redux/tickets/ticketType'
import { ILoadingAndFailure, ILoadingBatch, RESET_STORE } from '@/redux/generalType'

export const initState = {
	ticketList: {
		data: null,
		isLoading: false,
		isLoadingBatch: false,
		isFailure: false
	} as ITicketListPayload & ILoadingAndFailure & ILoadingBatch
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
					isLoadingBatch: true
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
		case TICKET_LIST.TICKET_LIST_LOAD_BATCH_DONE:
			return {
				...state,
				ticketList: {
					...state.ticketList,
					isLoadingBatch: false,
					data: action.payload.data
				}
			}
		case TICKET_LIST.TICKET_LIST_LOAD_DONE:
			return {
				...state,
				ticketList: {
					...initState.ticketList,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
