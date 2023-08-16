import { SportMarket } from '@/__generated__/resolvers-types'
import { IResetStore } from '../generalTypes'
import { SGPItem, SportMarketInfo } from '@/typescript/types'
import { BET_OPTIONS } from '@/utils/enums'

export enum UNSUBMITTED_BET_TICKETS {
	UNSUBMITTED_BET_TICKETS_INIT = 'UNSUBMITTED_BET_TICKETS_INIT',
	UNSUBMITTED_BET_TICKETS_UPDATE = 'UNSUBMITTED_BET_TICKETS_UPDATE'
}

export enum ACTIVE_BET_TICKET {
	ACTIVE_BET_TICKET_SET = 'ACTIVE_BET_TICKET_SET',
	ACTIVE_BET_TICKET_UPDATE_MATCHES = 'ACTIVE_BET_TICKET_UPDATE_MATCHES'
}

export enum ACTIVE_TICKET_PROCESSING {
	SET = 'SET_ACTIVE_TICKET_PROCESSING'
}

export enum ACTIVE_TICKET_SUBMITTING {
	SET = 'SET_ACTIVE_TICKET_SUBMITTING'
}

export type IBetTicketActions = IResetStore | ISetUnsubmittedBetTickets | ISetProcessing | ISetSubmitting

export interface IUnsubmittedBetTicket {
	id?: number
	allowance?: number
	matches?: TicketPosition[]
	totalQuote?: number
	totalBonus?: number
	payout?: number
	potentionalProfit?: number
	available?: number
	fees?: {
		parlay: number
		safebox: number
		skew: number
	}
	buyIn?: number
	minBuyIn?: number
	maxBuyIn?: number
	skew?: any
	selectedStablecoin?: string
}

export type ParlayAmmData = {
	minUsdAmount: number
	maxSupportedAmount: number
	maxSupportedOdds: number
	parlayAmmFee: number
	safeBoxImpact: number
	parlaySize: number
}

export type TicketPosition = SportMarket & {
	winnerTypeMatch?: SportMarketInfo
	doubleChanceTypeMatches?: SportMarketInfo[]
	spreadTypeMatch?: SportMarketInfo
	totalTypeMatch?: SportMarketInfo
	combinedTypeMatch?: SGPItem
	betOption: BET_OPTIONS
	homeBonus?: number
	awayBonus?: number
	drawBonus?: number
}

export interface IUnsubmittedBetTicketsPayload {
	data: IUnsubmittedBetTicket[] | null
}

export interface ISetUnsubmittedBetTickets {
	type: UNSUBMITTED_BET_TICKETS
	payload: IUnsubmittedBetTicketsPayload
}

export interface ISetProcessing {
	type: ACTIVE_TICKET_PROCESSING
	payload: boolean
}

export interface ISetSubmitting {
	type: ACTIVE_TICKET_SUBMITTING
	payload: boolean
}
