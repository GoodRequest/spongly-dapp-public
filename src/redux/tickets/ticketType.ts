import { IResetStore } from '@/redux/generalType'
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'

export enum TICKET_LIST {
	TICKET_LIST_LOAD_START = 'TICKET_LIST_LOAD_START',
	TICKET_LIST_LOAD_DONE = 'TICKET_LIST_LOAD_DONE',
	TICKET_LIST_LOAD_BATCH_DONE = 'TICKET_LIST_LOAD_BATCH_DONE',
	TICKET_LIST_LOAD_FAIL = 'TICKET_LIST_LOAD_FAIL'
}

export type ITicketActions = IResetStore | IGetTicketList

export interface ITicketListPayload {
	data: ITicketContent[] | null
}
export interface IGetTicketList {
	type: TICKET_LIST
	payload: ITicketListPayload
}
